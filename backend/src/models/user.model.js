class User {
  constructor(id) {
    this.publishStream = null;
    this.viewStreams = [];
    this.id = id;
  }

  setPublishStream(stream) {
    this.publishStream = stream;
  }

  addViewStream(stream) {
    this.viewStreams.push(stream);
  }
}

module.exports = User;
