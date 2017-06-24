/* @flow */
import Utils from './utils';
import Crypto from './crypto';
// import urlParse from 'url-parse';
import Url from 'url';

type HawkCredentials = {
  id: string,
  key: string,
  algorithm: string
}

type HawkOptions = {
  credentials: HawkCredentials,
  ext: string
}

type ParsedUri = {
  protocol?: string;
  slashes?: boolean;
  auth?: string;
  host?: string;
  port?: string;
  hostname?: string;
  hash?: string;
  search?: string;
  query?: any; // null | string | Object
  pathname?: string;
  path?: string;
  href: string;
}

export function generateClientHeader(uri: string, method: string, options: HawkOptions){

  const result = {
    field: '',
    artifacts: {},
    err: ''
  };

  // Validate inputs

  if (!uri || (typeof uri !== 'string' && typeof uri !== 'object') ||
    !method || typeof method !== 'string' ||
    !options || typeof options !== 'object') {

    result.err = 'Invalid argument type';
    return result;
  }

  // Application time

  const timestamp = options.timestamp || Utils.nowSecs();

  // Validate credentials

  const credentials = options.credentials;
  if (!credentials ||
    !credentials.id ||
    !credentials.key ||
    !credentials.algorithm) {

    result.err = 'Invalid credential object';
    return result;
  }

  if (Crypto.algorithms.indexOf(credentials.algorithm) === -1) {
    result.err = 'Unknown algorithm';
    return result;
  }

  // Parse URI
  let parsed: ParsedUri;
  if (typeof uri === 'string') {
    parsed = Url.parse(uri);
  }

  // Calculate signature

  const artifacts = {
    ts: timestamp,
    nonce: options.nonce || Crypto.randomString(6),
    method,
    resource: parsed.pathname + (parsed.search || ''),                            // Maintain trailing '?'
    host: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'http:' ? 80 : 443),
    hash: options.hash,
    ext: options.ext,
    app: options.app,
    dlg: options.dlg
  };

  result.artifacts = artifacts;

  // Calculate payload hash

  if (!artifacts.hash &&
    (options.payload || options.payload === '')) {

    artifacts.hash = Crypto.calculatePayloadHash(options.payload, credentials.algorithm, options.contentType);
  }

  const mac = Crypto.calculateMac('header', credentials, artifacts);

  // Construct header

  const hasExt = artifacts.ext !== null && artifacts.ext !== undefined && artifacts.ext !== '';       // Other falsey values allowed
  let header = 'Hawk id="' + credentials.id +
               '", ts="' + artifacts.ts +
               '", nonce="' + artifacts.nonce +
               (artifacts.hash ? '", hash="' + artifacts.hash : '') +
               (hasExt ? '", ext="' + Utils.escapeHeaderAttribute(artifacts.ext) : '') +
               '", mac="' + mac + '"';
  if (artifacts.app) {
      header = header + ', app="' + artifacts.app +
                (artifacts.dlg ? '", dlg="' + artifacts.dlg : '') + '"';
  }

  result.field = header;

  return result;
}
