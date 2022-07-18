const EVENTS = require("../const/EVENTS");
const { getRoom, createUser } = require("../services/room.service");
const {
  createVideoStream,
  getVideoStream,
  addToCandidateQueue,
  getStreams,
  releaseStreams
} = require("../services/video.service");

exports.publish = async (io, socket, user, data, cb) => {
  const { offer, callId } = data;
  const { answer, videoStream } = await createVideoStream({
    callId,
    offer,
    onIceCandidate: (candidate) =>
      socket.emit(EVENTS.ICE_CANDIDATE, { candidate, callId })
  });
  user.setPublishStream(videoStream);
  socket.broadcast.emit(EVENTS.STATE, { callId });
  cb({ answer });
};

exports.view = async (io, socket, user, data, cb) => {
  const { offer, callId, publishCallId } = data;
  const publishStream = getVideoStream({ callId: publishCallId });
  if (!publishStream) {
    console.log("Wrong callId");
    return;
  }
  const { answer, videoStream } = await createVideoStream({
    callId,
    publishCallId,
    offer,
    onIceCandidate: (candidate) =>
      socket.emit(EVENTS.ICE_CANDIDATE, { candidate, callId })
  });
  user.addViewStream(videoStream);
  publishStream.endpoint.connect(videoStream.endpoint);
  cb({ answer });
};

exports.iceCandidate = async (io, socket, user, data, cb) => {
  const { callId, candidate } = data;
  const videoStream = getVideoStream({ callId });
  if (!videoStream) {
    addToCandidateQueue({ candidate, callId });
    return;
  }
  await videoStream.addCandidate(candidate);
};

exports.disconnect = async (io, socket, user, data) => {
  const { id, room, users } = data;
  console.log("disconnected", socket.id);
  if (!id) return;

  logUsers(users);

  console.log("streams before:", Object.keys(getStreams()));
  releaseStreams(user);
  console.log("streams after:", Object.keys(getStreams()));

  room.removeUser(user);
  console.log(
    "users:",
    getRoom().users.map((u) => u.id)
  );

  socket.broadcast.emit(EVENTS.USER_LEFT, user.publishStream?.callId);
};

function logUsers(users) {
  users.forEach((u) => {
    console.log("--user:", u.id);
    console.log("----p stream:", u.publishStream?.callId);
    console.log(
      "----v streams:",
      u.viewStreams?.map((s) => s.callId)
    );
  });
  console.log("\n");
}
