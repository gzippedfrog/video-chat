module.exports = {
  port: process.env.PORT || 3001,
  kurentoUrl: process.env.KURENTO_URL || "ws://localhost:8888/kurento",
  stun: {
    ip: "stun1.l.google.com",
    port: "19302"
  },
  turn: "kurentoturn:kurentoturnpassword@78.46.107.230:3486"
};
