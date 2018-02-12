const assert = require('assert');
const app = require('../../src/app');

describe('\'Clients\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/clients');

    assert.ok(service, 'Registered the service');
  });
});
