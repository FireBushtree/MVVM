class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify(newValue) {
    this.subs.forEach(watcher => {
      watcher.update(newValue)
    })
  }
}