const moment = require('moment');
const chalk = require('chalk')
module.exports = {
  info: (from, message, user) => {
    let date = chalk.gray(moment().format("DD/MM/YYYY HH:mm:ss - "))
    from = chalk.cyan("[" + from + "]")
    if(user){
      user = chalk.green(" <" + user + "> ")
      console.log(date + chalk.cyan(from) + user + message)
    }
    else {
      console.log(date + from + " : " + message)
    }
  }
}