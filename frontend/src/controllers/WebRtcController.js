import { WebRtcConnection } from "./WebRtcConnection";
import { CONNECTION_TYPES } from "../const/CONNECTION_TYPES";

class WebRtcController {
  constructor() {
    this.connections = {};
    this.candidateQueue = {};
  }

  createPublishConnection = async (data) => {
    const connection = new WebRtcConnection({
      ...data,
      type: CONNECTION_TYPES.PUBLISH
    });

    await connection.generateLocalStream();
    await connection.createPeerConnection();
    await connection.createOffer();

    this.connections[connection.callId] = connection;
    console.log("__CREATE_PUBLISH_CONNECTION", this.connections);
  };

  createViewConnection = async (data) => {
    const connection = new WebRtcConnection({
      ...data,
      type: CONNECTION_TYPES.VIEW
    });

    await connection.createPeerConnection();
    await connection.createOffer();

    this.connections[connection.callId] = connection;
    console.log("__CREATE_VIEW_CONNECTION", this.connections);
  };

  addAnswer = async ({ answer, callId }) => {
    const connection = this.connections[callId];
    await connection.addAnswer(answer);
    const candidateQueue = this.candidateQueue[callId];
    if (candidateQueue) {
      for (let i = 0; i < candidateQueue.length; i++) {
        await connection.addIceCandidate(candidateQueue[i]);
      }
      delete this.candidateQueue[callId];
    }
  };

  addIceCandidate = async ({ callId, candidate }) => {
    const connection = this.connections[callId];
    if (connection && connection.sdpAnswerSet) {
      return await connection.addIceCandidate(candidate);
    }
    this.candidateQueue[callId] = this.candidateQueue[callId] || [];
    this.candidateQueue[callId].push(candidate);
  };

  flushCandidateQueueToStream = async (stream) => {
    if (candidateQueue[stream.callId]) {
      await stream.addCandidates(candidateQueue[stream.callId]);
    }
  };

  getConnection = (userId, type) => {};

  clearConnection = async (connection) => {};

  stopViewConnection = async (userId) => {
    const connection = this.getConnection(userId, CONNECTION_TYPES.VIEW);
    if (connection) {
      await this.clearConnection(connection);
      return connection.callId;
    }
  };

  stopPublishConnection = async (userId) => {
    const connection = this.getConnection(userId, CONNECTION_TYPES.PUBLISH);
    if (connection) {
      await this.clearConnection(connection);
      return connection.callId;
    }
  };
}

export default new WebRtcController();
