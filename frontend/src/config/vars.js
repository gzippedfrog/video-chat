export const socketUrl =
  process.env.REACT_APP_SOCKET_URL || "ws://localhost:3001";

export const stun = { url: "stun:stun1.l.google.com:19302" };

export const turn = {
  url: "turn:78.46.107.230:3486",
  username: "kurentoturn",
  password: "kurentoturnpassword"
};
