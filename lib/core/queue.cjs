//define links queue class & methods for it
//the class is used to store all the links that are going to be crawled
//the methods are used to add, remove and check if the link is in the queue

class Queue {
  constructor() {
    this.urls = [];
  }

  add(url) {
    this.urls.push(url);
  }

  remove(url) {
    this.urls.splice(this.urls.indexOf(url), 1);
  }

  isEmpty() {
    return this.urls.length === 0;
  }
}

module.exports = Queue;
