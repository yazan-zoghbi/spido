//define links queue class & methods for it
//the class is used to store all the links that are going to be crawled
//the methods are used to add, remove and check if the link is in the queue

export class Queue {
  urls: string[];

  constructor() {
    this.urls = [];
  }

  enqueue(url: string) {
    return this.urls.push(url);
  }

  dequeue() {
    return this.urls.shift();
  }

  isEmpty() {
    return this.urls.length === 0;
  }

  isURLInQueue(url: string): boolean {
    if (this.urls.includes(url)) return true;
    else return false;
  }
}

module.exports = { Queue };
