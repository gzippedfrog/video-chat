class Room {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
    console.log("added user", user.id);
  }

  removeUser(user) {
    this.users = this.users.filter((u) => u.id !== user.id);
  }
}

module.exports = Room;
