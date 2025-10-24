/**
 * FR
 * - Add rules declaratively on wht to do for each fields
 * - Validate based on rule callback
 * - Transform data if specified
 * - Allow config to fail fast or parse on demand and then handle error
 *
 * NFR
 *
 * Entities
 * - Rule
 * - RuleTransform
 * - MetaConte
 */
namespace ruleEngine {
  interface IRuleConfig {
    verbose?: boolean;
  }

  type IMetaContext = {
    field: string;
    dirty: Record<string, unknown>;
  };

  type ISchema = {
    [field: string]: IRule[];
  };

  type IRuleValidator = (value: unknown, metaContext: IMetaContext) => boolean;

  interface IRule {
    validator?: IRuleValidator;
    withMessage?: string;
  }

  interface IRuleEngine<T> {
    getValidationResults(): { isValid: boolean; errors: RuleError[] };
  }

  interface RuleError {
    field: string;
    message: string;
    value?: any;
  }

  const logger = ({ verbose }: IRuleConfig) => {
    return (level: "info" | "error", ...args: any[]): void => {
      if (!verbose) return;
      console[level]?.(...args);
    };
  };

  type ILogger = ReturnType<typeof logger>;

  type RuleEngineClosure<T extends Record<string, unknown>> = (
    body: T,
    config?: IRuleConfig
  ) => RuleEngine<T>;

  type RuleWithMessage = { message?: string };
  /**
 * In-built validator functions
 * - length
 * - min
 * - isEmpty

 */

  const isDefinedValue = (
    value: unknown,
    check: (value: unknown) => boolean
  ): boolean => {
    return value !== undefined && value !== null && check(value);
  };

  const minRule = ({
    min,
    message,
  }: { min: number } & RuleWithMessage): IRule => {
    return {
      validator: (value: unknown): boolean => {
        return isDefinedValue(
          value,
          (v) => typeof v === "string" && (v as string).length >= min
        );
      },
      withMessage: message ?? "Must be >=" + min,
    };
  };

  /**
   * Common rule helpers
   */

  const isRequired = (opts?: RuleWithMessage): IRule => {
    return {
      validator: (value: unknown) => isDefinedValue(value, (v) => v !== ""),
      withMessage: opts?.message ?? "Field is required.",
    };
  };

  const maxRule = ({
    max,
    message,
  }: { max: number } & RuleWithMessage): IRule => {
    return {
      validator: (value: unknown): boolean => {
        if (value === undefined || value === null) {
          return true;
        }
        return typeof value === "string" && value.length <= max;
      },
      withMessage: message ?? `Must be <= ${max} characters`,
    };
  };

  const isString = (opts?: RuleWithMessage): IRule => {
    return {
      validator: (value: unknown) =>
        value === undefined ||
        value === null ||
        value === "" ||
        typeof value === "string"
          ? true
          : false,
      withMessage: opts?.message ?? "Field is not a string",
    };
  };

  const isIn = <T extends string>({
    message,
    list,
  }: { list: T[] } & RuleWithMessage): IRule => {
    return {
      validator: (value: unknown) => !!value && list.includes(value as T),
      withMessage: message,
    };
  };

  const when = ({
    message,
    predicate,
  }: { predicate: (data: any) => boolean } & RuleWithMessage): IRule => {
    return {
      validator: (v: unknown) => predicate(v),
      withMessage: message,
    };
  };

  /**
   * Defaults
   */

  const DefaultRuleConfig: IRuleConfig = {
    verbose: false,
  };
  class RuleEngine<T extends Record<string, unknown>>
    implements IRuleEngine<T>
  {
    #config!: IRuleConfig;
    #body!: T;
    #schema: ISchema;
    metaContext!: IMetaContext;
    #log: ILogger;

    private constructor(raw: T, schema: ISchema, config?: IRuleConfig) {
      this.#config = {
        ...DefaultRuleConfig,
        ...config,
      };

      this.#body = raw;
      this.#schema = schema;
      this.#log = logger(this.#config);
      this.metaContext = {
        field: "",
        dirty: {},
      }; // hardcode to avoid definite assignment error;
    }

    #createRuleError(field: string, message: string): RuleError {
      return {
        field,
        message,
      };
    }

    #customErrorMessage(
      message: string | undefined,
      defaultMessage = "Field is required"
    ) {
      return message ?? defaultMessage;
    }

    #execRuleValidator(
      value: unknown,
      field: string,
      rule: IRule | undefined
    ): RuleError | void {
      if (!rule || !rule?.validator) {
        return;
      }

      const isValid = rule.validator(value, this.metaContext);

      if (isValid) {
        return;
      }
      // TODO: implement transform

      const err = this.#createRuleError(
        field,
        this.#customErrorMessage(rule.withMessage)
      );

      this.#log("info", `Validation failed for field: ${field}`, err);
      return err;
    }

    #validate(): RuleError[] | void {
      const ruleErrors: RuleError[] = [];
      for (const [field, rules] of Object.entries(this.#schema)) {
        const value = this.#body[field];
        for (const rule of rules) {
          const execResult = this.#execRuleValidator(value, field, rule);
          if (execResult) ruleErrors.push(execResult);
        }
      }

      return ruleErrors;
    }

    /**
     * Retrieves a complete validation result from the rule engine without short-circuiting.
     *
     * This method temporarily disables the engine's "failFast" configuration so that all rules
     * are evaluated and every validation error is collected. After calling the engine's
     * validate() method, the original failFast configuration is restored.
     *
     * @returns An object with the following properties:
     * - isValid: `true` when no validation errors were found, otherwise `false`.
     * - errors: an array of `RuleError` instances (empty when `isValid` is `true`).
 
     */
    getValidationResults(): { isValid: boolean; errors: RuleError[] } {
      const errors = this.#validate() || [];

      return {
        isValid: errors.length === 0,
        errors,
      };
    }

    static schema<T extends Record<string, unknown>>(
      schema: ISchema
    ): RuleEngineClosure<T> {
      return (body: T, config?: IRuleConfig): RuleEngine<T> => {
        return new RuleEngine(body, schema, config);
      };
    }
  }

  /**
   * Main entry that executes a rule-engine closure against the provided payload.
   *
   * Invokes the provided `ruleEngine` closure with the supplied `body` and a default
   * options object (`{ verbose: true }`), then calls the returned rule engine's
   * `validate()` method to perform synchronous validation.
   *
   * @param body - The input data to validate. This value is forwarded to the rule engine
   *               and can be any shape required by the specific rule set.
   * @param ruleEngine - A closure that accepts `(body, options)` and returns an object
   *                     exposing a synchronous `validate()` method. The closure is called
   *                     here with the default options `{ verbose: true }`.
   *
   * @returns void
   *
   * @throws Any error thrown by the `ruleEngine` or by its `validate()` method.
   *
   */
  function main(body: any, ruleEngine: RuleEngineClosure<any>) {
    const re = ruleEngine(body, { verbose: true });
    const results = re.getValidationResults();
    console.log("Validation Results:", results);
  }

  const exampleBody = {
    firstName: "Jane",
    lastName: "Doe",
    age: 28,
    height: 34,
    status: "active2",
  };
  main(
    exampleBody,
    RuleEngine.schema({
      firstName: [
        minRule({ min: 4, message: "FirstName is too short" }),
        isRequired(),
      ],
      lastName: [
        minRule({ min: 3, message: "LastName is too short" }),
        isRequired(),
      ],
      age: [isRequired()],
      status: [
        isRequired(),
        isIn({ list: ["active", "inactive"], message: "Status is invalid" }),
      ],
    })
  );
}
