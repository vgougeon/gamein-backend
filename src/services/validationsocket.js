
const jwt = require('jsonwebtoken');
module.exports = function() {
  this.socketValidation = function(auth) {
    if(auth === undefined){
      return false
    }
    let u
    try {
      u = jwt.verify(auth, 'temp_key');
    } catch(err) {
      return false
    }
    return u
  }
}