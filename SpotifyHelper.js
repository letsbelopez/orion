import querystring from "querystring";

export function getCurrentUser(access_token) {
  const path = "https://api.spotify.com/v1/me";
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token
    }
  };

  return fetch(path, options)
    .then(response => response.json())
    .then(json => json);
}

export function getHashParam(name) {
  var regex = new RegExp("(#)(" + name + ")(=)([^#]*)"),
    matches = [];
  matches = regex.exec(window.location.hash);
  if (matches !== null && matches.length > 4 && matches[4] !== null) {
    return matches[4];
  } else {
    return false;
  }
}

export function getSpotifyLoginURL() {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative"
  ];
  const state = generateRandomString(16);

  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id: "7cda84722c9f4ec495d30859dcefbf00",
      scope: scopes.join(" "),
      redirect_uri: "http://localhost:3000",
      state: state
    })
  );
}

function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
