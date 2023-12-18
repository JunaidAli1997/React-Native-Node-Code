const bcrypt = require("bcrypt");

// hash function
exports.hashPassword = (passwrod) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(passwrod, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

// compare || decrypt
exports.comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};
