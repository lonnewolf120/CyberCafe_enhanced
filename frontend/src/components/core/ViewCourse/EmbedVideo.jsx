import React from "react";
import PropTypes from "prop-types";

const EmbedVideo = ({ video_url }) => (
  <div className="relative overflow-hidden pb-[56.25%] h-0">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src={video_url}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

EmbedVideo.propTypes = {
  video_url: PropTypes.string.isRequired
};

export default EmbedVideo;
