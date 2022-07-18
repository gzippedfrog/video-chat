import React, { useContext, useEffect } from "react";
import { VideoChatContext } from "../context/VideoChatContextProvider";
import { useNavigate } from "react-router-dom";
import VideoChat from "../components/VideoChat";
import TextChat from "../components/TextChat";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  height: 100%;
`;
export default function ChatScreen() {
  const {
    state: { name, streams }
  } = useContext(VideoChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) navigate("/");
  }, [name, navigate]);

  useEffect(() => {
    console.log("streams:", streams.length, streams);
  }, [streams]);

  return (
    <Container>
      <VideoChat />
      <TextChat />
    </Container>
  );
}
