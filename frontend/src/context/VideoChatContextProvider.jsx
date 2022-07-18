import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import WebRtcController from "../controllers/WebRtcController";
import socket from "../controllers/SocketController";
import { EVENTS } from "../const/EVENTS";

export const VideoChatContext = React.createContext({});

const VideoChatContextProvider = ({ children }) => {
  const [streams, setStreams] = useState([]);
  const [name, setName] = useState("");

  const publishStream = async () => {
    const callId = uuid();
    await WebRtcController.createPublishConnection({
      callId,
      onGotOffer: (callId, offer) => {
        socket.emit(EVENTS.PUBLISH, { callId, offer }, ({ answer }) => {
          WebRtcController.addAnswer({ answer, callId });
        });
      },
      onGotCandidate: (callId, candidate) =>
        socket.emit(EVENTS.ICE_CANDIDATE, { callId, candidate }),
      onGotLocalStream: (stream) =>
        setStreams((state) => [
          ...state.filter((s) => s.callId !== callId),
          { stream, callId }
        ])
    });
  };

  const viewStream = async (publishCallId) => {
    const callId = uuid();
    await WebRtcController.createViewConnection({
      callId,
      publishCallId,
      onGotOffer: (callId, offer) =>
        socket.emit(
          EVENTS.VIEW,
          { callId, offer, publishCallId },
          ({ answer }) => WebRtcController.addAnswer({ answer, callId })
        ),
      onGotCandidate: (callId, candidate) =>
        socket.emit(EVENTS.ICE_CANDIDATE, { callId, candidate }),
      onGotRemoteStream: (stream) => {
        setStreams((state) => [
          ...state.filter((s) => s.callId !== callId),
          { stream, callId, publishCallId }
        ]);
      }
    });
  };

  useEffect(() => {
    socket.on(EVENTS.ICE_CANDIDATE, async ({ callId, candidate }) => {
      await WebRtcController.addIceCandidate({ callId, candidate });
    });

    socket.on(EVENTS.USER_JOINED, async ({ streamIds }) => {
      await publishStream();
      for (let i = 0; i < streamIds.length; i++) {
        await viewStream(streamIds[i]);
      }
    });

    socket.on(EVENTS.STATE, async ({ callId }) => {
      await viewStream(callId);
    });

    socket.on(EVENTS.USER_LEFT, (id) => {
      const connections = Object.values(WebRtcController.connections);

      const connection = connections.find((c) => c.publishCallId === id);
      connection.peerConnection.close();
      delete WebRtcController.connections[connection.callId];
      console.log("CLOSED", WebRtcController.connections);

      setStreams((state) => [...state.filter((s) => s.publishCallId !== id)]);
    });
  }, []);

  const state = { streams, name };
  const actions = { setName };

  return (
    <VideoChatContext.Provider value={{ state, actions }}>
      {children}
    </VideoChatContext.Provider>
  );
};

export default VideoChatContextProvider;
