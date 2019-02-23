import React from "react";

class Track extends React.Component {
  render() {
    const track = this.props.track;

    return (
      <button
        className="bg-green hover:bg-green-light text-white font-bold py-2 px-4 border-b-4 border-green-dark hover:border-green rounded"
        onClick={() => this.props.search(track.name)}
      >
        <h4>{track.name}</h4>
        <p>{track.artists[0].name}</p>
      </button>
    );
  }
}

export default Track;
