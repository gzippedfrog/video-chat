import styled from "@emotion/styled";
import React from "react";
import VideoStream from "./VideoStream";

export default function VideoChat({ streams }) {
  const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    justify-items: left;
    gap: 10px;
    flex: 1;
    max-height: 100%;
  `;

  return (
    <Container>
      {streams.map(({ stream, callId, publishCallId }) => (
        <VideoStream key={callId} stream={stream} isMyStream={!publishCallId} />
      ))}
    </Container>
  );
}
