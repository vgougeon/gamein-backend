
const jwt = require('jsonwebtoken');
module.exports = function() {
  this.validation = function(req) {
    if(req.get('authorization') === undefined){
      return false
    }
    let u
    try {
      u = jwt.verify(req.get('authorization'), 'temp_key');
    } catch(err) {
      return false
    }
    return u
  }
}