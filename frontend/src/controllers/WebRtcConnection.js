import { CONNECTION_TYPES } from "../const/CONNECTION_TYPES";
import { getConstraints, getUserMedia } from "../utils/mediaDevices";

const configuration = {
  iceServers: [
    {
      urls: "stun:stun1.l.google.com:19302"
    },
    {
      urls: "turn:78.46.107.230:3486",
      username: "kurentoturn",
      credential: "kurentoturnpassword"
    }
  ]
};

export class WebRtcConnection {
  constructor(data) {
    this.callId = data.callId;
    this.type = data.type;
    this.onGotOffer = data.onGotOffer;
    this.onGotCandidate = data.onGotCandidate;
    this.onGotLocalStream = data.onGotLocalStream;
    this.onGotRemoteStream = data.onGotRemoteStream;

    if (data.type === CONNECTION_TYPES.VIEW) {
      this.publishCallId = data.publishCallId;
    }
  }

  generateLocalStream = async () => {
    const constraints = getConstraints();
    this.localStream = await getUserMedia(constraints);
    this.onGotLocalStream?.(this.localStream);
  };

  createPeerConnection = async () => {
    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.onicecandidate = (e) =>
      e.candidate && this.onGotCandidate(this.callId, e.candidate);

    this.peerConnection.oniceconnectionstatechange = () => {
      const iceConnectionState = this.peerConnection.iceConnectionState;
      console.log(`Ice changed: ${iceConnectionState}`);
    };

    if (this.type === CONNECTION_TYPES.VIEW) {
      this.peerConnection.ontrack = (e) => {
        this.remoteStream = this.remoteStream || new MediaStream();
        this.remoteStream.addTrack(e.track);
        this.onGotRemoteStream?.(this.remoteStream);
      };
    }
  };

  createOffer = async () => {
    const isPublish = this.type === CONNECTION_TYPES.PUBLISH;
    if (this.localStream) {
      this.peerConnection.addStream(
        new MediaStream(this.localStream.getTracks())
      );
    }

    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: !isPublish,
      offerToReceiveVideo: !isPublish
    });
    await this.peerConnection.setLocalDescription(offer);
    this.onGotOffer(this.callId, offer.sdp);
  };

  addIceCandidate = async (candidate) => {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  addAnswer = async (sdp) => {
    await this.peerConnection.setRemoteDescription({ type: "answer", sdp });
    this.sdpAnswerSet = true;
  };
}
