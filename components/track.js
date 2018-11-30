import React from "react";

class Track extends React.Component {
  render() {
    const track = this.props.track;

    return (
      <button onClick={() => this.props.search(track.name)}>
        <h4>{track.name}</h4>
        <p>{track.artists[0].name}</p>
      </button>
    );
  }
}

export default Track;
