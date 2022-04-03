import SocketIO from "socket.io-client";
import { socketUrl } from "../config/vars";

class SocketController {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect = () => {
    this.socket?.disconnect();
    this.socket = SocketIO(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });
  };

  on = (event, handler) => {
    this.socket?.on(event, handler);
  };

  off = (event, handler) => {
    this.socket?.off(event, handler);
  };

  emit = (event, data, cb) => {
    this.socket?.emit(event, data, cb);
  };

  isConnected = () => this.socket?.connected;

  disconnect = () => {
    this.socket?.disconnect();
  };
}

export default new SocketController();
