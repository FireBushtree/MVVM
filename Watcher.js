class Watcher {
  constructor(data, key, cb) {
    this.data = data
    this.key = key
    this.cb = cb
    this.value = this.get()
  }

  get() {
    Dep.target = this
    let value = this.data[this.key]
    Dep.target = null

    return value
  }

  update(newValue) {
    this.cb(newValue)
  }
}