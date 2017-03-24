// @flow
import 'whatwg-fetch';
import Hawk from 'hawk';

type FunTypeCredentials = {
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

const DEV_BASE_URL = "http://dev.api.aqsoftwareinc.com/2.0/funType";
const LIVE_BASE_URL = "http://live.api.aqsoftwareinc.com/2.0/funType";

export class CloudStorage {

  credentials: HawkCredentials;
  environment: Environment;

  constructor(credentials: FunTypeCredentials, environment: Environment = 'devt'){
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

    return fetch(fullUrl, {
      method: method,
      headers: {
        'Authorization': getAuthHeader(fullUrl, method, this.credentials),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
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
