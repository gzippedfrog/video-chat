const kurentoClient = require("kurento-client");
const { kurentoUrl } = require("../config/vars");

let kurentoConnection = null;
const getKurentoConnection = async () => {
  if (!kurentoConnection) {
    kurentoConnection = await kurentoClient(kurentoUrl);
  }
  return kurentoConnection;
};
exports.getKurentoConnection = getKurentoConnection;

let pipeline = null;
const getOrCreatePipeline = async () => {
  if (!pipeline) {
    const connection = await getKurentoConnection();
    pipeline = connection.create("MediaPipeline");
  }
  return pipeline;
};
exports.getOrCreatePipeline = getOrCreatePipeline;

exports.createEndpoint = async () => {
  const pipeline = await getOrCreatePipeline();
  const endpoint = pipeline.create("WebRtcEndpoint");
  return endpoint;
};
