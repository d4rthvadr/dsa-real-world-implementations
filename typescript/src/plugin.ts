// plugin
interface EditorPlugin {
  name: string;
  events: {
    onStart?: (data: PluginContext) => void;
    onSave?: (data: PluginContext) => void;
    onShutdown?: (data: PluginContext) => void;
  };
}

const getDefaultName = (key?: string, pluginName = "DefaultPlugin"): string =>
  key ?? pluginName;

// concrete plugin implementation
const samplePlugin: EditorPlugin = {
  name: "SamplePlugin",
  events: {
    onStart: (data) => {
      console.log(`Starting up! ${data.name} | meta: ${JSON.stringify(data)}`);
    },
    onSave: (data) => {
      console.log(
        `Document saved. ${data.name}  | meta: ${JSON.stringify(data)}`
      );
    },
    onShutdown: (data) => {
      console.log(
        `Shutting down. ${data.name} | meta: ${JSON.stringify(data)}`
      );
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
  private plugins: EditorPlugin[] = [];

  private context: PluginContext = {
    editorName: "MyCodeEditor",
  };

  register(plugin: EditorPlugin) {
    this.plugins.push(plugin);
  }

  emit<T extends PluginEvent, TData = {}>(event: T, data: TData) {
    for (const plugin of this.plugins) {
      const contextWithMeta: PluginContext = {
        ...this.context,
        ...data,
      };

      // Ensure asynchronous execution
      queueMicrotask(() => {
        plugin.events?.[event]?.(contextWithMeta);
      });
    }
  }
}

// usage
const pluginEngine = new EditorPluginEngine();
pluginEngine.register(samplePlugin);

// Simulate editor lifecycle
pluginEngine.emit("onStart", { disableLogging: false, name: "MyCodeEditor" });
pluginEngine.emit("onSave", { name: "Document1", label: "Initial Save" });
pluginEngine.emit("onShutdown", { reason: "Editor closed" });

console.log("This is a TypeScript plugin.");
