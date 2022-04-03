import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

const VideoStream = ({ stream, isMyStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
  }, [stream, videoRef]);

  const Video = styled.video`
    border-radius: 10px;
    width: 100%;
    height: 100%;
  `;

  return <Video autoPlay playsInline ref={videoRef} />;
};

export default VideoStream;
