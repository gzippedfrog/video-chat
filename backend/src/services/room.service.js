const Room = require("../models/room.model");
const User = require("../models/user.model");

const room = new Room();

exports.getRoom = () => room;

exports.createUser = (id) => {
  console.log("created user", id);
  const user = new User(id);
  room.addUser(user);
  return user;
};
