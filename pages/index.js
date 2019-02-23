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

    // Log in screen
    if (!isLoggedIn) {
      return (
        <div className="flex justify-center items-center h-screen bg-black">
          <div className="bg-grey-darkest shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center justify-center flex-col">
            <h1 className="text-2xl text-white mb-6">Log in to Spotify</h1>
            <Link href={loginUrl}>
              <a className="no-underline bg-green hover:bg-green-light text-white font-bold py-2 px-4 border-b-4 border-green-dark hover:border-green rounded">
                LOG IN
              </a>
            </Link>
          </div>
        </div>
      );
    }

    if (loading) {
      return <p>Loading...</p>;
    }

    // Dashboard
    return (
      <div className="">
        <nav className="bg-black p-6 border-b-1 border-grey-dark shadow">
          <ul className="list-reset flex justify-between">
            <li>
              <h1 className="text-white">Welcome {user.display_name}</h1>
            </li>
            <li className="mr-6">
              <Link href={loginUrl}>
                <a className="inline-block no-underline bg-green hover:bg-green-light text-white font-bold py-2 px-4 border-b-4 border-green-dark hover:border-green rounded uppercase">
                  Logout
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div />
        <ul className="list-reset">
          <li>
            <button
              className="bg-green hover:bg-green-light text-white font-bold py-2 px-4 border-b-4 border-green-dark hover:border-green rounded"
              onClick={this.getPlaylists}
              disabled={!isLoggedIn}
            >
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
