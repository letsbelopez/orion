const nextEnv = require("next-env");
const dotenvLoad = require("dotenv-load");
const withCSS = require("@zeit/next-css");

// load & use dotenv
dotenvLoad();
const withNextEnv = nextEnv({
  // TODO custom config
});

module.exports = withNextEnv(withCSS({}));
