import React, { useEffect, useState } from "react";
import socket from "../controllers/SocketController";
import { EVENTS } from "../const/EVENTS";
import { Button, TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";

export default function TextChat({ name }) {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const newMessage = { user: name, text: message, date: Date.now() };
    socket.emit(EVENTS.SEND_MESSAGE, newMessage);
    setData([...data, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    socket.emit(EVENTS.GET_DATA);
  }, []);

  const handleReceiveMessage = (newMessage) => {
    setData([...data, newMessage]);
  };

  const handleGetData = (data) => {
    setData(data);
  };

  useEffect(() => {
    socket.on(EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on(EVENTS.GET_DATA, handleGetData);

    return () => {
      socket.off(EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(EVENTS.GET_DATA, handleGetData);
    };
  }, [setData, data]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    flex: 0.5;
    max-width: 400px;
  `;

  const MessagesContainer = styled.div`
    overflow-y: auto;
  `;

  return (
    <Container>
      <Typography>Username: {name}</Typography>
      <TextField
        placeholder="Message"
        value={message}
        autoFocus
        onChange={handleMessageChange}
      />
      <Button onClick={handleSubmit} variant="contained">
        Send
      </Button>
      <Typography>Messages:</Typography>
      {data.length ? (
        <MessagesContainer>
          {data.map((msg) => (
            <Typography key={msg.date}>
              {msg.user} says: <br />
              {msg.text}
            </Typography>
          ))}
        </MessagesContainer>
      ) : (
        <Typography>No messages yet</Typography>
      )}
    </Container>
  );
}
