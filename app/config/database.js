const _ = process.env,
  { Client, Pool } = require('pg')

const config = {
  host: _.DB_HOST,
  database: _.DB_NAME,
  port: _.DB_PORT,
  user: _.DB_USER,
  password: Buffer.from(_.DB_PWD, 'base64').toString('utf-8'),
}
const pg_client = new Client(config)
const pg_pool = new Pool(config)

pg_client.connect((err) => {
  if (err) {
    console.error("Can't connect to database")
    err.status = err.message
    throw err
  } else {
    console.log('# Database connection established')
  }
})

module.exports = { config, pg_client, pg_pool }
