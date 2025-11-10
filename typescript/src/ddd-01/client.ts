import { ID } from "./types";
import { appendIdToUrl } from "./util";

export class Client {
  static async get<T>(endpoint: string): Promise<T | null> {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error("Resource not found.");
    }

    if (!response.ok) {
      throw new Error(`Failed to GET resource ${endpoint}`);
    }

    return (await response.json()) as T;
  }

  static async post<T>(endpoint: string, data: unknown) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to POST resource ${endpoint}`);
    }

    return (await response.json()) as T;
  }

  static async patch<T>(endpoint: string, data: unknown, id?: string) {
    const url = appendIdToUrl(endpoint, id);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to PATCH resource ${endpoint}`);
    }

    return (await response.json()) as T;
  }

  static async delete(endpoint: string, id?: ID): Promise<boolean> {
    const url = appendIdToUrl(endpoint, id);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  }
}
