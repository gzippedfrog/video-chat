import styled from "@emotion/styled";
import React, { useContext } from "react";
import { VideoChatContext } from "../context/VideoChatContextProvider";
import VideoStream from "./VideoStream";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  justify-items: left;
  gap: 10px;
  flex: 1;
  max-height: 100%;
`;
export default function VideoChat() {
  const {
    state: { streams }
  } = useContext(VideoChatContext);

  return (
    <Container>
      {streams.map(({ stream, callId, publishCallId }) => (
        <VideoStream key={callId} stream={stream} isMyStream={!publishCallId} />
      ))}
    </Container>
  );
}
