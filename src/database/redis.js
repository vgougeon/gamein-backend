const log = require('../services/logging');

const redis = require("redis");

const client = redis.createClient();
client.auth("Cd3uNOUCJdAJnZ48ixzoLtwmj+2lOTXm/QNycEn5pgZUPvgqQSSdUXpjVsBthO8zOPbTrjn832bhDNQJ");

module.exports = client;

log.info("INIT", "Connecting to Redis")