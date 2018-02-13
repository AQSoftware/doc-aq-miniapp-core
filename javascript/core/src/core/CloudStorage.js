// @flow
import Client from './Client';
import type { HawkCredentials, Environment } from './Client';
import type { MiniAppCredentials } from './Types';

const BASE_PATH = "miniApp";

export class CloudStorage extends Client {

  constructor(credentials: MiniAppCredentials, environment: Environment = 'devt'){
    super(BASE_PATH, { 'id': credentials.id, 'key': credentials.key, 'algorithm': 'sha256' }, environment);
  }

  insert(data: Object): Promise<Object> {
    return this.request('POST', '', data);
  }

  update(id: string, data: Object): Promise<Object> {
    return this.request('PUT', `/${id}`, data);
  }

  get(id: string): Promise<Object> {
    return this.request('GET', `/${id}`);
  }
}
