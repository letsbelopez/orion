if (!process.browser) global.fetch = require("isomorphic-unfetch");

const express = require("express");
const next = require("next");

const request = require("request");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, quiet: true });
const handle = app.getRequestHandler();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

app.prepare().then(() => {
  const server = express();

  server.use(cors());

  server.use(cookieParser());

  server.get("/get_spotify_uri", function(req, res) {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "playlist-read-collaborative"
    ];

    const spotify_uri =
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        show_dialog: true,
        response_type: "token",
        client_id: CLIENT_ID,
        scope: scopes.join(" "),
        redirect_uri: REDIRECT_URI
      });

    res.send({ spotify_uri });
  });

  server.get("/refresh_token", function(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          access_token: access_token
        });
      }
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
