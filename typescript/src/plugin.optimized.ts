// plugin
namespace EditorPlugin {
  interface EditorPlugin {
    name: string;
    events: {
      onStart?: (data: PluginContext) => void;
      onSave?: (data: PluginContext) => void;
      onShutdown?: (data: PluginContext) => void;
    };
  }

  interface SamplePluginMeta {
    disableLogging?: boolean;
    name?: string;
    label?: string;
    reason?: string;
  }

  const isValidMetaField = <T>(
    meta: unknown,
    validationFn: (value: unknown) => boolean
  ): meta is T => {
    if (typeof meta !== "object" || meta === null) return false;

    return validationFn(meta);
  };

  // concrete plugin implementation
  const samplePlugin: EditorPlugin = {
    name: "SamplePlugin",
    events: {
      onStart: (data) => {
        const { meta, ...pluginEngineContext } = data;

        const validateMeta = (data: unknown): boolean => {
          const metaObj = data as Record<string, unknown>;
          return (
            (metaObj.disableLogging == undefined ||
              typeof metaObj.disableLogging === "boolean") &&
            (metaObj.name == undefined || typeof metaObj.name === "string") &&
            (metaObj.label == undefined || typeof metaObj.label === "string") &&
            (metaObj.reason == undefined || typeof metaObj.reason === "string")
          );
        };

        if (!isValidMetaField<SamplePluginMeta>(meta, validateMeta)) {
          throw new Error("Invalid meta data for SamplePlugin");
        }

        console.log(
          `Starting up! ${
            pluginEngineContext.editorName
          } | meta: ${JSON.stringify(meta)}`
        );
      },
      onSave: (data) => {
        console.log(`Document saved.  | meta: ${JSON.stringify(data)}`);
      },
      onShutdown: (data) => {
        console.log(`Shutting down.  | meta: ${JSON.stringify(data)}`);
      },
    },
  } satisfies EditorPlugin;

  const logPlugin: EditorPlugin = {
    name: "LogPlugin",
    events: {},
  } satisfies EditorPlugin;

  interface PluginContext {
    editorName: string;
    [key: string]: any; // Additional metadata about the editor state
  }

  // data flow

  /**
   *
   * User adds a new plugin
   * Plugin is registered in the editor
   * Editor triggers plugin events based on user actions
   * Plugin responds to events
   * Plugin can modify editor behavior or content
   *
   * Actions:
   * - lookup
   * - register
   * - trigger
   * - respond
   */

  type PluginEvent = keyof EditorPlugin["events"];

  // plugin engine
  class EditorPluginEngine {
    private registeredPluginNames = new Set<string>();
    private eventHandlers: Map<
      PluginEvent,
      NonNullable<EditorPlugin["events"][PluginEvent]>[]
    > = new Map();

    private context: PluginContext = {
      editorName: "MyCodeEditor",
    };

    register(plugin: EditorPlugin) {
      if (this.registeredPluginNames.has(plugin.name)) {
        console.warn(`Plugin ${plugin.name} already registered`);
        return;
      }

      // map events to plugins
      for (const [eventName, handler] of Object.entries(plugin.events)) {
        const handlers = this.eventHandlers.get(eventName as PluginEvent) ?? [];

        if (!handler) continue;
        handlers.push(handler);
        this.eventHandlers.set(eventName as PluginEvent, handlers);
      }
      this.registeredPluginNames.add(plugin.name);
    }

    /**
     * Emits a plugin event to all registered handlers asynchronously.
     *
     * @typeParam T - The type of the plugin event.
     * @typeParam TData - The type of additional data to be merged into the plugin context.
     * @param event - The event to emit.
     * @param data - Additional data to be merged into the plugin context for the event handlers.
     *
     * @remarks
     * Each handler for the specified event is invoked asynchronously using `queueMicrotask`.
     * The context passed to handlers is a combination of the plugin's context and the provided data.
     */
    emit<T extends PluginEvent, TData = {}>(event: T, data: TData) {
      const handlers = this.eventHandlers.get(event);
      if (!handlers) return;

      const contextWithMeta: PluginContext = {
        ...this.context,
        meta: data,
      };

      for (const handler of handlers) {
        // Ensure asynchronous execution
        queueMicrotask(() => {
          try {
            handler?.(contextWithMeta);
          } catch (e) {
            console.error(`Error in plugin handler for event ${event}:`, e);
          }
        });
      }
    }
  }

  // usage
  const pluginEngine = new EditorPluginEngine();
  pluginEngine.register(samplePlugin);

  // Simulate editor lifecycle
  pluginEngine.emit("onStart", {
    disableLogging: false,
    name: "MyCodeEditor",
  } satisfies SamplePluginMeta);
  pluginEngine.emit("onSave", { name: "Document1", label: "Initial Save" });
  pluginEngine.emit("onShutdown", { reason: "Editor closed" });

  console.log("This is a TypeScript plugin.");
}
