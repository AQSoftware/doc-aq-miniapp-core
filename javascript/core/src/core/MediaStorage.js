// @flow
import 'whatwg-fetch';
import Base64JS from 'base64-js';
import Globals from './Globals';

type FetchMethods = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
type Environment = 'live' | 'devt';
type Media = { data: Uint8Array, contentType: string};

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

// const DEV_BASE_URL = "http://v2.dev.api.bengga.com/2.0/media";
// const LIVE_BASE_URL = "http://v2.dev.api.bengga.com/2.0/media";


export class MediaStorage {

  environment: Environment;

  constructor(environment: Environment = 'devt'){
    this.environment = environment;
  }

  _getFullUrl(url: string): string {
    if (this.environment === 'devt')
      return `${Globals.DEV_BASE_URL}/media${url}`;
    else
      return `${Globals.LIVE_BASE_URL}/media${url}`;
  }

  _jsonize(promise: Promise<any>): Promise<Object> {
    return promise.then(checkStatus).then(parseJSON);
  }

  _request(method: FetchMethods, relativeUrl: string, media: ?Media): Promise<Object> {
    const fullUrl = this._getFullUrl(relativeUrl);

    let params = {
      method: method,
      mode: 'cors'
    }
    if(method !== 'GET' && method !== 'HEAD') {
      // $FlowFixMe
      params.body = media.data;
      // $FlowFixMe
      params.headers = {
        // $FlowFixMe
        'Content-Type': media.contentType
      }
    }
    return fetch(fullUrl, params)
    .then(checkStatus)
    .then(parseJSON);
  }

  upload(media: Media): Promise<Object> {
    return this._request('POST', '', media);
  }

  get(id: string): Promise<Object> {
    return this._request('GET', `/${id}`);
  }


  /**
  Extracts Content-Type from a data URI and converts its Base64 data to byte array
  */
  base64DataUrlToByteArray(dataUrl: string): ?{ data: Uint8Array, contentType: string} {
    var regex = /data:(.*);base64,(.*)/ig;
    var match = regex.exec(dataUrl); // Regex should produce 3 capture groups
    if (match.length == 3) {
      const data = Base64JS.toByteArray(match[2]);
      const contentType = match[1];
      return {data: data, contentType: contentType};
    }
    else return null;
  }
}
