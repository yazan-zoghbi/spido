//define links queue class & methods for it
//the class is used to store all the links that are going to be crawled
//the methods are used to add, remove and check if the link is in the queue

export default class Queue {
  urls: any[];
  constructor() {
    this.urls = [];
  }

  add(url: string) {
    this.urls.push(url);
  }

  remove(url: string) {
    this.urls.splice(this.urls.indexOf(url), 1);
  }

  isEmpty() {
    return this.urls.length === 0;
  }
}
