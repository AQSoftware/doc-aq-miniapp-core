// @flow
import 'whatwg-fetch';
import Hawk from 'hawk';

export type MiniAppCredentials = {
  id: string,
  key: string
}

type HawkCredentials = {
  id: string,
  key: string,
  algorithm: 'sha256'
}

type FetchMethods = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
type Environment = 'live' | 'devt';

function getAuthHeader(url: string, method: string, credentials: HawkCredentials): string {
  return Hawk.client.header(url, method, { credentials: credentials, ext: 'funtype-client' }).field;
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

function parseJSON(response: Response): Promise<any> {
  return response.json()
}

// const DEV_BASE_URL = "http://dev.api.aqsoftwareinc.com/2.0/miniApp";
// const LIVE_BASE_URL = "http://live.api.aqsoftwareinc.com/2.0/miniApp";
const DEV_BASE_URL = "http://v2.dev.api.bengga.com/2.0/miniApp";
const LIVE_BASE_URL = "http://v2.dev.api.bengga.com/2.0/miniApp";
// const DEV_BASE_URL = "http://192.168.100.52:38085/2.0/miniApp";
// const LIVE_BASE_URL = "http://192.168.100.52:38085/2.0/miniApp";


export class CloudStorage {

  credentials: HawkCredentials;
  environment: Environment;

  constructor(credentials: MiniAppCredentials, environment: Environment = 'devt'){
    this.credentials = {'id': credentials.id, 'key': credentials.key, 'algorithm': 'sha256'};
    this.environment = environment;
  }

  _getFullUrl(url: string): string {
    if (this.environment === 'devt')
      return `${DEV_BASE_URL}${url}`;
    else
      return `${LIVE_BASE_URL}${url}`;
  }

  _jsonize(promise: Promise<any>): Promise<Object> {
    return promise.then(checkStatus).then(parseJSON);
  }

  _request(method: FetchMethods, relativeUrl: string, body: Object = {}): Promise<Object> {
    const fullUrl = this._getFullUrl(relativeUrl);

    let params = {
      method: method,
      headers: {
        'Authorization': getAuthHeader(fullUrl, method, this.credentials),
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }
    if(method !== 'GET' && method !== 'HEAD') {
      // $FlowFixMe
      params.body = JSON.stringify(body);
    }
    return fetch(fullUrl, params)
    .then(checkStatus)
    .then(parseJSON);
  }

  insert(data: Object): Promise<Object> {
    return this._request('POST', '', data);
  }

  update(id: string, data: Object): Promise<Object> {
    return this._request('PUT', `/${id}`, data);
  }

  get(id: string): Promise<Object> {
    return this._request('GET', `/${id}`);
  }
}
