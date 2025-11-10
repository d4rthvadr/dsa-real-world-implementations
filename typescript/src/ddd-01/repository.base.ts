import { Client } from "./client";
import { BASE_API_URL } from "./consts";
import { Entities } from "./entities";

export default abstract class Repository<
  T extends Entities,
  ID extends string | number
> {
  constructor(protected baseApi = BASE_API_URL) {}

  abstract get path(): string;

  get #resourceUrl(): string {
    return `${this.baseApi}/${this.path}`;
  }

  toDomainEntity<E>(entity: E) {
    return entity;
  }

  abstract toResource<E>(entity: unknown): E;

  async findById(id: ID): Promise<T> {
    const endpoint = `${this.#resourceUrl}/${id}`;

    try {
      const resource: T | null = await Client.get<T>(endpoint);

      if (!resource) {
        throw new Error("Reource not found");
      }

      return this.toDomainEntity(resource);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const resource: T[] | null = await Client.get<T[]>(this.#resourceUrl);

      if (!resource) {
        return [];
      }

      return Array.isArray(resource) ? resource.map(this.toDomainEntity) : [];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async save(data: unknown, id?: ID): Promise<T> {
    try {
      let resource: T | null;
      if (id) {
        resource = await Client.patch<T>(this.#resourceUrl, data, String(id));
      } else {
        resource = await Client.post<T>(this.#resourceUrl, data);
      }

      return this.toDomainEntity(resource);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async delete(id: ID): Promise<unknown> {
    return Client.delete(this.#resourceUrl, String(id));
  }
}
