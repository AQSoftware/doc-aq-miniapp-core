// @flow
import { CloudStorage } from '../src/core/CloudStorage';

const creds = {
  id: 'DinJsI75EeeoXOa-qMgFZg',
  key: 'QXUnLbDizrRXQKrvhvCyipoWdLrziUuX',
  algorithm: 'sha256'
}

const client = new CloudStorage(creds);
const id = 'tpVKoBCcEeicEgJCrBEACQ';


test('insert on object', () => {
  const param = {
    string: 'string',
    int: 1,
    object: {
      string: 'string',
      int: 2
    }
  };
  return client.insert(param);
});

test('update on object', () => {
  const param = {
    string: 'string',
    int: 1,
    object: {
      string: 'string',
      int: 2
    }
  };
  const param2 = {
    string: 'stringz',
    int: 3,
    object: {
      string: 'stringz',
      int: 4
    }
  };
  return client.update(id, param2)
    .then(client.update(id, param));

});


test('get on object', () => {
  return client.get(id);
});

