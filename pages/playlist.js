import React, { Component } from "react";
import Link from "next/link";
import Track from "../components/track";
import { searchByTerm, createiTunesLink } from "../iTunesHelper";

class Playlist extends Component {
  state = {
    tracks: null,
    results: null
  };

  static async getInitialProps({ query: { access_token, id, playlist } }) {
    return { access_token, id, playlist };
  }

  componentDidMount() {
    const playlistId = this.props.id;
    if (playlistId) {
      this.getTracks(this.props.id).then(tracks => this.setState({ tracks }));
    }
  }

  getTracks = id => {
    const access_token = this.props.access_token;

    const fetchOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token
      }
    };

    return fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      fetchOptions
    )
      .then(response => response.json())
      .then(json => json);
  };

  renderResults = () => {
    const results = this.state.results;
    if (results) {
      return results.results.map(result => {
        return (
          <div className="results-item" key={result.trackId}>
            <img src={result.artworkUrl100} />
            <h4>{result.collectionName}</h4>
            <p>{result.artistName}</p>
            <audio controls>
              <source src={result.previewUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <Link href={createiTunesLink(result.trackViewUrl)}>
              <a>Buy on iTunes {result.trackPrice}</a>
            </Link>
            {/* <Link href="itunes://geo.itunes.apple.com/us/album/taylor-swift-holiday-collection/id296552366?mt=1&app=itunes">
              <a>iTunes test</a>
            </Link> */}
          </div>
        );
      });
    }
  };

  search = trackName => {
    this.setState({ results: null });
    searchByTerm(trackName)
      .then(data => data.json())
      .then(results => this.setState({ results }));
  };

  render() {
    const { tracks, results } = this.state;

    if (tracks) {
      return (
        <React.Fragment>
          <div>
            <h2>Tracks for {this.props.playlist} Playlist</h2>
            <p>Click on a track to search iTunes</p>
            <ul>
              {tracks.items.map(track => {
                return (
                  <Track
                    key={track.track.id}
                    track={track.track}
                    search={this.search}
                  />
                );
              })}
            </ul>
          </div>
          <div className="results">{results && this.renderResults()}</div>
        </React.Fragment>
      );
    }

    return <div>Loading...</div>;
  }
}

export default Playlist;
