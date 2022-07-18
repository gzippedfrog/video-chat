const { createEndpoint } = require("./kurento.service");
const VideoStream = require("../models/videoStream.model");

const streams = {};
exports.createVideoStream = async ({
  callId,
  publishCallId,
  offer,
  onIceCandidate
}) => {
  const endpoint = await createEndpoint();
  const videoStream = new VideoStream({
    endpoint,
    callId,
    publishCallId,
    onIceCandidate
  });
  await videoStream.configureEndpoint();
  const answer = await videoStream.processOffer(offer);
  await flushCandidateQueueToStream(videoStream);
  await videoStream.gatherCandidates();
  streams[callId] = videoStream;

  return { answer, videoStream };
};

exports.getVideoStream = ({ callId }) => streams[callId];
exports.getStreams = () => streams;

exports.releaseStreams = ({ publishStream, viewStreams }) => {
  if (publishStream) {
    publishStream.endpoint.release();
    delete streams[publishStream.callId];
  }

  viewStreams.forEach((s) => {
    s.endpoint.release();
    delete streams[s.callId];
  });

  Object.values(streams).forEach((s) => {
    if (s.publishCallId === publishStream.callId) {
      s.endpoint.release();
      delete streams[s.callId];
    }
  });
};

const candidateQueue = {};
const addToCandidateQueue = ({ candidate, callId }) => {
  candidateQueue[callId] = candidateQueue[callId] || [];
  candidateQueue[callId].push(candidate);
};
exports.addToCandidateQueue = addToCandidateQueue;

const flushCandidateQueueToStream = async (stream) => {
  if (candidateQueue[stream.callId]) {
    await stream.addCandidates(candidateQueue[stream.callId]);
  }
};
