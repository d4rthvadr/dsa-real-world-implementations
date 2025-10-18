/**
 * name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v5
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."

 */

interface KeyValue {
  [key: string]: any;
}
interface Steps {
  name?: string;
  run?: string;
  with?: KeyValue;
  uses?: string;
}

interface Job {
  "runs-on": string;
  name?: string;
  steps: Steps[];
}

interface IJobContext {
  [key: string]: any;
}

interface IApp {
  name: string;
  exec: (context: IJobContext, cb: (c: IJobContext) => void) => Promise<void>;
}

interface EnvironmentShell {
  run(
    command: string,
    context: IJobContext,
    cb: (context: IJobContext) => void
  ): Promise<void>;
}

function Shell(): EnvironmentShell {
  return {
    async run(
      command: string,
      context: IJobContext,
      cb: (context: IJobContext) => void
    ): Promise<void> {
      console.log(`Executing command: ${command}`);
      // Simulate command execution
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
  };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AmazonECRLogin implements IApp {
  name: string = "AmazonECRLogin";
  async exec(
    context: IJobContext,
    cb: (context: IJobContext) => void
  ): Promise<void> {
    console.log("Logging into Amazon ECR...");
    // simulate async operation
    await wait(4000);
    console.log("Logged into Amazon ECR successfully.");
    return Promise.resolve().then(() => cb({ ecrLogin: true }));
  }
}

class CheckoutCode implements IApp {
  name: string = "CheckoutCode";
  async exec(
    context: IJobContext,
    cb: (context: IJobContext) => void
  ): Promise<void> {
    console.log("Checking out code...");

    const repo = {
      name: "example-repo",
      url: "https://github.com/user/example-repo.git",
      branch: "main",
      files: ["index.js", "README.md", "package.json"],
    };
    // simulate async operation
    await wait(2000);
    console.log("Code checked out successfully.");
    return Promise.resolve().then(() =>
      cb({ codeCheckedOut: true, repo2: repo })
    );
  }
}

class BuildPushDockerImage implements IApp {
  name: string = "BuildPushDockerImage";
  async exec(
    context: IJobContext,
    cb: (context: IJobContext) => void
  ): Promise<void> {
    console.log("Building Docker image...");

    const { repo, ..._ } = context;

    if (!repo) {
      console.error("No repository information found in context.");
      throw new Error("Cannot build Docker image without repo info.");
      // return Promise.reject().catch(() => cb({ dockerImagePushed: false }));
    }

    // simulate async operation
    await wait(3000);
    console.log("Docker image built successfully.");
    console.log("Pushing Docker image to registry...");
    await wait(3000);
    console.log("Docker image pushed successfully.");
    return Promise.resolve().then(() => cb({ dockerImagePushed: true }));
  }
}

class AppStore {
  apps: Map<string, IApp> = new Map();

  getApp(name: string): IApp | undefined {
    return this.apps.get(name);
  }

  registerApp(app: IApp) {
    if (this.apps.has(app.name)) {
      console.warn(`App ${app.name} is already registered.`);
      return;
    }
    this.apps.set(app.name, app);
  }
}

class GitHubActionWorkflow {
  jobs: { [key: string]: Job } = {};
  #context: IJobContext = {};
  #appStore: AppStore;
  #shell: EnvironmentShell;

  constructor(appStore: AppStore, shell: EnvironmentShell) {
    this.#appStore = appStore;
    this.#shell = shell;
  }

  updateContext(newContext: IJobContext): IJobContext {
    this.#context = { ...this.#context, ...newContext };
    return this.#context;
  }

  addJob(jobName: string, job: Job) {
    this.jobs[jobName] = job;
    return this;
  }

  async handleStepUses(step: Steps): Promise<void> {
    if (!step.uses) return;

    const app = this.#appStore.getApp(step.uses);
    if (!app) {
      console.warn(
        `Step "${step.name}" is using an unknown action: ${step.uses}. Did you forget to register it?`
      );
      return;
    }
    console.log(`Step "${step.name}" is using a custom action: ${step.uses}`);
    await app
      .exec(this.#context, (c) => this.updateContext(c))
      .catch((err) => {
        console.log(`Action ${app.name} failed to execute.`);
        throw err;
      });
  }

  async handleStepRun(step: Steps): Promise<void> {
    if (!step.run) return;
    console.log(`Also executing additional command: ${step.run}`);
    await this.#shell
      .run(step.run, this.#context, this.updateContext)
      .catch((err) => {
        console.log(`Command "${step.run}" failed to execute.`);
        throw new Error(`Command "${step.run}" failed to execute.`);
      });
  }

  async execute() {
    try {
      for (const [jobName, job] of Object.entries(this.jobs)) {
        console.log(`Executing job: ${jobName}`);
        for (const step of job.steps) {
          await this.handleStepUses(step);
          await this.handleStepRun(step);
        }
      }

      console.log("Final context after all jobs:", this.#context);
    } catch (e) {
      throw new Error(`Error executing`);
    }
  }
}

// usage
const appStore = new AppStore();
appStore.registerApp(new AmazonECRLogin());
appStore.registerApp(new CheckoutCode());
appStore.registerApp(new BuildPushDockerImage());
const shell = Shell();
const workflow = new GitHubActionWorkflow(appStore, shell);
workflow
  .addJob("Explore-GitHub-Actions", {
    "runs-on": "ubuntu-latest",
    steps: [
      { run: 'echo "Hello World"' },
      { name: "Checkout Code", uses: "CheckoutCode" },
      { name: "Build and Push Docker Image", uses: "BuildPushDockerImage" },
      { name: "Login to ECR", uses: "AmazonECRLogin" },
    ],
  })
  .execute()
  .catch((e) => console.error(e));
