import { ID } from "./types";

export function appendIdToUrl(endpoint: string, id?: ID) {
  return id ? `${endpoint}/${id}` : endpoint;
}
