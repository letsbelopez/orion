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
  return fetch("/get_spotify_uri")
    .then(response => response.json())
    .then(json => json.spotify_uri);
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
