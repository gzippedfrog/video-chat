const kurentoClient = require("kurento-client");
const { stun, turn } = require("../config/vars");
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
    await this.endpoint.setStunServerAddress(stun.ip);
    await this.endpoint.setStunServerPort(stun.port);
    await this.endpoint.setTurnUrl(turn);
  }
}

module.exports = VideoStream;
