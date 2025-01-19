/*
 * used for IDE only
 */

const dotenv = require('dotenv-safe');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config({
  path: '../.env',
  example: '../.env.example',
  allowEmptyValues: true,
});

dotenvExpand.expand(myEnv);

const schemaEndpoint = process.env.WORDPRESS_API_URL;

module.exports = {
  schema: schemaEndpoint,
};
