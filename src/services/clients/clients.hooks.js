const { authenticate } = require('@feathersjs/authentication').hooks;

const setTimestamp = name => {
  return async context => {
    context.data[name] = new Date();

    return context;
  };
};


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ setTimestamp('created_at') ],
    update: [ setTimestamp('updated_at') ],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
