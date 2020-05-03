const pool = require('../database/db')
const sass = require('node-sass')
const moment = require('moment')

const getTheme = async function(req, res){
    if(req.query.id === undefined || isNaN(req.query.id)) return res.status(403).send("no-id-specified")
    const [{0: theme}] = await pool.execute(`
    SELECT module, bg, header, color, theme, invert FROM themes
    WHERE id = ?`,
    [req.query.id])
    if(theme === undefined) return res.status(403).send("no-theme-found")
    let variables = Object.keys(theme).map(function(key, index) {
        return "$" + key + ": " + theme[key] + ";"
    });
    let result = sass.renderSync({
        includePaths: ["src/config/"],
        data: 
        `${variables.join("\n")} 
        @import "./theme.scss"
        `,
        outputStyle: 'compressed',
    }).css.toString();
    res.status(200).send(result)
}

module.exports = getTheme