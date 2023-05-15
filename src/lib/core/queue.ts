//define links queue class & methods for it
//the class is used to store all the links that are going to be crawled
//the methods are used to add, remove and check if the link is in the queue

export class Queue {
  urls: string[] = [];

  enqueue(url: string) {
    console.log("adding link to queue: " + url);
    return this.urls.push(url);
  }

  dequeue() {
    return this.urls.unshift();
  }

  peek() {
    return this.urls[0];
  }

  remove() {
    return this.urls.shift();
  }
}

module.exports = { Queue };
