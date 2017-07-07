/* @flow */
import Crypto from 'react-native-crypto';
import Url from 'url';

export default class Cryptoez {
  static headerVersion = '1';
  static algorithms = ['sha1', 'sha256'];

  static randomString(size) {

    const buffer = this.randomBits((size + 1) * 6);
    if (buffer instanceof Error) {
        return buffer;
    }

    const string = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    return string.slice(0, size);
  }

  static randomBits(bits) {
    if (!bits ||
        bits < 0) {

        throw new Error('Invalid random bits count');
    }

    const bytes = Math.ceil(bits / 8);
    try {
        return Crypto.randomBytes(bytes);
    }
    catch (err) {
        throw new Error('Failed generating random bits: ' + err.message);
    }
  }

  static calculateMac(type, credentials, options){

    const normalized = this.generateNormalizedString(type, options);
    const hmac = Crypto.createHmac(credentials.algorithm, credentials.key).update(normalized);
    const digest = hmac.digest('base64');
    return digest;
  }

  static generateNormalizedString(type, options){

    let resource = options.resource || '';
    if (resource &&
        resource[0] !== '/') {

        const url = Url.parse(resource, false);
        resource = url.path;                        // Includes query
    }

    let normalized = 'hawk.' + Cryptoez.headerVersion + '.' + type + '\n' +
                     options.ts + '\n' +
                     options.nonce + '\n' +
                     (options.method || '').toUpperCase() + '\n' +
                     resource + '\n' +
                     options.host.toLowerCase() + '\n' +
                     options.port + '\n' +
                     (options.hash || '') + '\n';

    if (options.ext) {
        normalized = normalized + options.ext.replace('\\', '\\\\').replace('\n', '\\n');
    }

    normalized = normalized + '\n';

    if (options.app) {
        normalized = normalized + options.app + '\n' +
                                  (options.dlg || '') + '\n';
    }

    return normalized;
  }

  static calculatePayloadHash(payload, algorithm, contentType){

    const hash = this.initializePayloadHash(algorithm, contentType);
    hash.update(payload || '');
    return this.finalizePayloadHash(hash);
  }

  static initializePayloadHash(algorithm, contentType) {

    const hash = Crypto.createHash(algorithm);
    hash.update('hawk.' + Cryptoez.headerVersion + '.payload\n');
    hash.update(Utils.parseContentType(contentType) + '\n');
    return hash;
  }

  static finalizePayloadHash(hash) {
    hash.update('\n');
    return hash.digest('base64');
  }
}
