import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EVENTS } from "../const/EVENTS";
import { VideoChatContext } from "../context/VideoChatContextProvider";
import socket from "../controllers/SocketController";
import { TextField, Button, Typography } from "@mui/material";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 300px;
  height: 100%;
  margin: 0 auto;
  align-items: stretch;
  justify-content: center;
`;

export default function LoginScreen() {
  const [isFull, setIsFull] = useState(false);
  const navigate = useNavigate();

  const {
    state: { name },
    actions: { setName }
  } = useContext(VideoChatContext);

  useEffect(() => {
    socket.on(EVENTS.ROOM_IS_FULL, () => {
      setIsFull(true);
    });

    socket.on(EVENTS.USER_JOINED, () => {
      navigate("/chat");
    });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    name && socket.emit(EVENTS.USER_JOIN);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <Container>
      {isFull ? (
        <Typography textAlign={"center"} variant="h3">
          Room is full
        </Typography>
      ) : (
        <>
          <TextField
            label="Username"
            autoFocus
            value={name}
            onChange={handleNameChange}
            onSubmit={handleSubmit}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Login
          </Button>
        </>
      )}
    </Container>
  );
}
