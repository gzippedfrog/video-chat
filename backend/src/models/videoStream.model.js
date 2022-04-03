const kurentoClient = require("kurento-client");
const IceCandidate = kurentoClient.getComplexType("IceCandidate");

class VideoStream {
  constructor({ endpoint, callId, publishCallId, onIceCandidate }) {
    this.endpoint = endpoint;
    this.callId = callId;
    if (publishCallId) {
      this.publishCallId = publishCallId;
    }
    this.endpoint.on("OnIceCandidate", (event) =>
      onIceCandidate(IceCandidate(event.candidate))
    );
  }

  async processOffer(offer) {
    return this.endpoint.processOffer(offer);
  }

  async addCandidate(candidate) {
    await this.endpoint.addIceCandidate(IceCandidate(candidate));
  }

  async addCandidates(candidates) {
    await Promise.all(candidates.map(async (c) => this.addCandidate(c)));
  }

  async gatherCandidates() {
    await this.endpoint.gatherCandidates();
  }

  async configureEndpoint() {
    await this.endpoint.setStunServerAddress("stun1.l.google.com");
    await this.endpoint.setStunServerPort("19302");
    await this.endpoint.setTurnUrl(
      "kurentoturn:kurentoturnpassword@78.46.107.230:3486"
    );
  }
}

module.exports = VideoStream;
