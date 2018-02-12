const crypto = require('crypto');

module.exports = function (secret) {

  const algorithm = 'aes-256-ctr';
  const charset = 'utf8';
  const bin = 'hex';

  const encrypt = (text) => {
    var cipher = crypto.createCipher(algorithm, secret);
    var crypted = cipher.update(text, charset, bin);
    crypted += cipher.final(bin);
    return crypted;
  };

  const decrypt = (text) => {
    var decipher = crypto.createDecipher(algorithm, secret);
    var decrypted = decipher.update(text, bin, charset);
    decrypted += decipher.final(charset);
    return decrypted;
  };

  return { encrypt, decrypt };
};
