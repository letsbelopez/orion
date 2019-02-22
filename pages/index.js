import React from "react";
import Link from "next/link";
import {
  getCurrentUser,
  getSpotifyLoginURL,
  getHashParam
} from "../SpotifyHelper";

class Page extends React.Component {
  state = {
    access_token: false,
    loading: true,
    loginUrl: "",
    playlists: null,
    user: null
  };

  componentDidMount() {
    getSpotifyLoginURL()
      .then(loginUrl => {
        const access_token = getHashParam("access_token");
        this.setState({ access_token, loginUrl });

        if (access_token) {
          this.getUser(access_token);
        }
      })
      .catch(err => console.error(err));
  }

  getPlaylists = () => {
    const fetchOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      }
    };

    fetch("https://api.spotify.com/v1/me/playlists", fetchOptions)
      .then(response => response.json())
      .then(playlists => this.setState({ playlists }));
  };

  getUser = access_token => {
    if (access_token) {
      getCurrentUser(access_token).then(user =>
        this.setState({ user, loading: false })
      );
    }
  };

  renderPlaylists = () => {
    return (
      <React.Fragment>
        <h2>Playlists</h2>
        <ul>
          {this.state.playlists.items.map(playlist => {
            return (
              <li key={playlist.id}>
                <Link
                  href={{
                    pathname: "/playlist",
                    query: {
                      access_token: this.state.access_token,
                      id: playlist.id,
                      playlist: playlist.name
                    }
                  }}
                >
                  <a>{playlist.name}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  };

  render() {
    const { loading, playlists, user } = this.state;
    const isLoggedIn = this.state.access_token;
    const loginUrl = this.state.loginUrl;

    if (!isLoggedIn) {
      return (
        <nav>
          <Link href={loginUrl}>
            <a>Login first</a>
          </Link>
        </nav>
      );
    }

    if (loading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <nav>
          <Link href={loginUrl}>
            <a>Logout</a>
          </Link>
        </nav>
        <ul>
          <li>
            <p>Welcome {user.display_name}</p>
          </li>
          <li>
            <button onClick={this.getPlaylists} disabled={!isLoggedIn}>
              Get your playlists
            </button>
          </li>
        </ul>
        <div>{playlists && this.renderPlaylists()}</div>
      </div>
    );
  }
}

export default Page;
