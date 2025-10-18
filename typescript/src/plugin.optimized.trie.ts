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

  type EventNames = "user.onStart" | "user.onSave" | "user.onShutdown";

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

  const eventNameList = ["user.onStart", "user.onSave", "user.onShutdown"];

  // Trie node for event handlers
  /** example:
   * user.signup -> user -> signup
   * user.login -> user -> login
   * user.logout -> user -> logout
   */
  class TrieEventNode {
    children: Map<string, TrieEventNode> = new Map();
    handlers: Array<{
      pluginName: string;
      handler: NonNullable<EditorPlugin["events"][PluginEvent]>;
    }> = [];
  }

  class TrieManager {
    #root: TrieEventNode = new TrieEventNode();

    /**
     * Retrieves the node in the trie corresponding to the given dot-separated key.
     * If any part of the key path does not exist, it will be created.
     *
     * @param key - A dot-separated string representing the path to the desired node (e.g., "foo.bar.baz").
     * @returns The {@link TrieEventNode} at the end of the specified key path.
     */
    getNode(key: string): TrieEventNode {
      const parts = key.split(".");

      console.log(`Looking up key: ${key}`, parts);
      let currentNode: TrieEventNode = this.#root;

      for (const part of parts) {
        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, new TrieEventNode());
        }
        currentNode = currentNode.children.get(part)!;
      }

      return currentNode;
    }

    /**
     * Removes handlers for a specific plugin from given event paths
     * @returns Number of handlers removed
     */

    /**
     * Removes all handlers associated with the specified plugin name from the trie.
     *
     * Traverses the entire trie structure, filtering out handlers whose `pluginName`
     * matches the provided argument. Returns the total number of handlers removed.
     *
     * @param pluginName - The name of the plugin whose handlers should be removed.
     * @returns The number of handlers removed from the trie.
     */
    remove(pluginName: string): number {
      let removedCount = 0;

      const traverseAndRemove = (node: TrieEventNode) => {
        const initialLength = node.handlers.length;
        node.handlers = node.handlers.filter(
          (handler) => handler.pluginName !== pluginName
        );
        removedCount += initialLength - node.handlers.length;

        for (const childNode of node.children.values()) {
          traverseAndRemove(childNode);
        }
      };
      traverseAndRemove(this.#root);

      return removedCount;
    }
  }

  // plugin engine
  class EditorPluginEngine {
    #registeredPluginNames = new Set<string>();

    #trieManager: TrieManager;

    #context: PluginContext = {
      editorName: "MyCodeEditor",
    };

    namespace = "user"; // ✅ Use const

    constructor(trieManager: TrieManager = new TrieManager()) {
      this.#trieManager = trieManager;
    }

    register(plugin: EditorPlugin) {
      if (this.#registeredPluginNames.has(plugin.name)) {
        console.warn(`Plugin ${plugin.name} already registered`);
        return;
      }

      for (const [eventName, handler] of Object.entries(plugin.events)) {
        if (!handler) {
          console.warn(
            `${plugin.name} event handler cannot be undefined. Skipping...`
          );
          continue;
        }

        const path = `${this.namespace}.${eventName}`; // ✅ Build fresh path each time
        const registeredPlugin = this.#trieManager.getNode(path);

        console.log(`Registering handler for plugin: ${plugin.name}`, handler);
        registeredPlugin.handlers.push({ pluginName: plugin.name, handler });
      }

      this.#registeredPluginNames.add(plugin.name);
      console.log(`Registered plugin: ${plugin.name}`);
    }

    /**
     * Unregisters a plugin by its name.
     *
     * Removes all handlers associated with the specified plugin from the trie manager,
     * deletes the plugin name from the registered plugins set, and logs the actions.
     * If the plugin is not registered, a warning is logged and no action is taken.
     *
     * @param pluginName - The name of the plugin to unregister.
     */
    unregister(pluginName: string): boolean {
      if (!this.#registeredPluginNames.has(pluginName)) {
        console.warn(`Plugin ${pluginName} is not registered.`);
        return false;
      }

      const removedCount = this.#trieManager.remove(pluginName);

      console.log(`Removed ${removedCount} handlers for plugin: ${pluginName}`);

      this.#registeredPluginNames.delete(pluginName);
      console.log(`Unregistered plugin: ${pluginName}`);

      return true;
    }

    /**
     * Emits a plugin event asynchronously, invoking all registered handlers for the specified event.
     *
     * @typeParam T - The type of the plugin event to emit.
     * @typeParam TData - The type of the metadata associated with the event. Defaults to an empty object.
     * @param event - The event to emit.
     * @param data - Optional metadata to pass to the event handlers.
     *
     * @remarks
     * Each handler is executed asynchronously using `queueMicrotask` to avoid blocking the main thread.
     * Any errors thrown by handlers are caught and logged to the console.
     *
     * @example
     * emit('onSave', { userId: 123 });
     */
    emit<T extends EventNames, TData = {}>(event: T, data: TData) {
      const contextWithMeta: PluginContext = {
        ...this.#context,
        meta: data,
      };

      const { handlers } = this.#trieManager.getNode(event);

      console.log(
        `Emitting event: ${event} to ${handlers.length} handlers`,
        handlers
      );

      for (const { handler } of handlers) {
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
  pluginEngine.emit("user.onStart", {
    disableLogging: false,
    name: "MyCodeEditor",
  } satisfies SamplePluginMeta);
  pluginEngine.emit("user.onSave", {
    name: "Document1",
    label: "Initial Save",
  });
  pluginEngine.emit("user.onShutdown", { reason: "Editor closed" });

  console.log("This is a TypeScript plugin.");
}
