// @flow
import 'isomorphic-fetch';
import Hawk from 'hawk';
import Globals from './Globals';

export type HawkCredentials = {
  id: string,
  key: string,
  algorithm: 'sha256'
}

type FetchMethods = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
export type Environment = 'live' | 'devt';

export default class Client {

  basePath: string;
  credentials: HawkCredentials;
  environment: Environment;

  constructor(basePath: string, credentials: HawkCredentials, environment: Environment = 'devt') {
    this.basePath = basePath;
    this.credentials = credentials;
    this.environment = environment;
  }

  getAuthHeader(url: string, method: string, credentials: HawkCredentials): string {
    return Hawk.client.header(url, method, { credentials: credentials, ext: 'aq-miniapp-core' }).field;
  }

  checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(response.statusText);
    }
  }

  parseJSON(response: Response): Promise<any> {
    return response.json()
    .then(result => {
      if (this.isDevt()) {
        console.log(`${JSON.stringify(result)}`);
      } 
      return result;
    });
  }

  isDevt(): boolean {
    return this.environment === 'devt';
  }

  getFullUrl(url: string): string {
    if (this.isDevt())
      return `${Globals.DEV_BASE_URL}/${this.basePath}${url}`;
    else
      return `${Globals.LIVE_BASE_URL}/${this.basePath}${url}`;
  }

  jsonize(promise: Promise<any>): Promise<Object> {
    return promise.then(this.checkStatus).then(this.parseJSON);
  }

  request(method: FetchMethods, relativeUrl: string, body: Object = {}): Promise<Object> {
    const fullUrl = this.getFullUrl(relativeUrl);
    if (this.isDevt()) {
      console.log(`${method} ${fullUrl}`);
    }
    let params = {
      method: method,
      headers: {
        'Authorization': this.getAuthHeader(fullUrl, method, this.credentials),
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }

    if (this.isDevt()){
      // console.log(`${JSON.stringify(params)}`);
    }

    if (method !== 'GET' && method !== 'HEAD') {
      // $FlowFixMe
      params.body = JSON.stringify(body);
    }
    return fetch(fullUrl, params)
      .then(this.checkStatus)
      .then(this.parseJSON.bind(this));
  }
  
}
