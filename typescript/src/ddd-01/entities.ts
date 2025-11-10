export interface Item {
  id: string;
  name: string;
}

export interface Workspace {
  beds: unknown[];
  name: string;
}

export type Entities = Item | Workspace;
