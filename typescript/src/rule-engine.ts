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
    failFast?: boolean;
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
    validate(): void;
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
      validator: predicate,
      withMessage: message,
    };
  };

  /**
   * Defaults
   */

  const DefaultRuleConfig: IRuleConfig = {
    failFast: true,
    verbose: false,
  };
  class RuleEngine<T extends Record<string, unknown>>
    implements IRuleEngine<T>
  {
    #config!: IRuleConfig;
    #body!: T;
    #schema: ISchema;
    metaContext!: IMetaContext;
    #ruleErrors: RuleError[] = [];
    #log: ILogger;

    private constructor(raw: T, schema: ISchema, config?: IRuleConfig) {
      if (config) {
        this.#config = {
          ...DefaultRuleConfig,
          ...config,
        };
      }
      this.#body = raw;
      this.#schema = schema;
      this.#log = logger(this.#config);
    }

    #createRuleError(field: string, message: string): RuleError {
      return {
        field,
        message,
      };
    }
    isFailFast(): boolean {
      return this.#config.failFast ?? false;
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
      const err = this.#createRuleError(
        field,
        this.#customErrorMessage(rule.withMessage)
      );
      this.#log("info", `Validation failed for field: ${field}`, err);
      this.#ruleErrors.push(err);
      // TODO: implement transform
    }

    #checkIfFailFast(ruleErrors: RuleError[]): void {
      if (ruleErrors.length > 0 && this.isFailFast()) {
        console.log("Fail fast enabled. Stopping execution.", ruleErrors.pop());
        throw Error("Validation failed");
      }
    }

    validate(): RuleError[] | void {
      for (const [field, rules] of Object.entries(this.#schema)) {
        const value = this.#body[field];
        for (const rule of rules) {
          const execResult = this.#execRuleValidator(value, field, rule);
          if (execResult) {
            this.#ruleErrors.push(execResult);
          }
        }
      }
      this.#checkIfFailFast(this.#ruleErrors);

      return this.#ruleErrors;
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
   * @remarks
   * - This function performs synchronous validation and will propagate any exceptions
   *   thrown by the `ruleEngine` invocation or by the returned object's `validate()` call.
   * - If you require different options (for example, `verbose: false`) or asynchronous
   *   validation, invoke the `ruleEngine` directly or adapt this function accordingly.
   *
   * @throws Any error thrown by the `ruleEngine` or by its `validate()` method.
   *
   */
  function main(body: any, ruleEngine: RuleEngineClosure<any>) {
    const re = ruleEngine(body, { verbose: true });
    re.validate();
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
