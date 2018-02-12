//const { authenticate } = require('@feathersjs/authentication').hooks;
const { BadRequest } = require('@feathersjs/errors');
const myCrypto = require('../../mycrypto');

const validate = async context => {
  const { data } = context;

  const fieldsRequired = {email: 'Email address', phone: 'Phone number'};

  Object.keys(fieldsRequired).forEach((field) => {
    const label = fieldsRequired[field];
    if(!(field in data)) {
      throw new BadRequest(label + ' is required');
    }

    // make sure it is string and whitespace
    if(typeof data[field] !== 'string') {
      throw new BadRequest(label + ' is invalid');
    }

    data[field] = data[field].trim();

    if(data[field] === '') {
      throw new BadRequest(label + ' is invalid');
    }
  });

  return context;
};


const encryptField = name => {
  return async context => {
    const key = context.app.get('crypto_key');
    context.data[name] = myCrypto(key).encrypt(context.data[name]);

    return context;
  };
};

const decryptField = name => {
  return async context => {
    const key = context.app.get('crypto_key');
    context.result[name] = myCrypto(key).decrypt(context.result[name]);

    return context;
  };
};

const decryptFieldMany = name => {
  return async context => {
    const key = context.app.get('crypto_key');
    const rows = context.result.data;//array
    rows.forEach((row, idx) => {
      row[name] =  myCrypto(key).decrypt(row[name]);
      rows[idx] = row;
    });
    context.result.data = rows;

    return context;
  };
};

const protect = name => {
  return async context => {
    const str = '' + context.result[name];
    context.result[name] = '****' + str.substr(-4, 4);

    return context;
  };
};

const protectMany = name => {
  return async context => {
    const rows = context.result.data;//array
    rows.forEach((row, idx) => {
      const str = '' + row[name];
      row[name] = '****' + str.substr(-4, 4);
      rows[idx] = row;
    });
    context.result.data = rows;

    return context;
  };
};

const setTimestamp = name => {
  return async context => {
    context.data[name] = new Date();

    return context;
  };
};


module.exports = {
  before: {
    all: [ /*authenticate('jwt')*/ ],
    find: [],
    get: [],
    create: [ setTimestamp('created_at'), validate, encryptField('phone') ],
    update: [ setTimestamp('updated_at'), validate, encryptField('phone') ],
    patch: [ validate, encryptField('phone') ],
    remove: []
  },

  after: {
    all: [],
    find: [ decryptFieldMany('phone'), protectMany('phone') ],
    get: [ decryptField('phone'), protect('phone') ],
    create: [ decryptField('phone'), protect('phone') ],
    update: [ decryptField('phone'), protect('phone') ],
    patch: [ decryptField('phone'), protect('phone') ],
    remove: [ decryptField('phone'), protect('phone') ]
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
