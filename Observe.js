class Observe {
  constructor(data) {
    this.observer(data)
  }

  observer(data) {
    if (typeof data != 'object') {
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReActive(data, key, data[key])

      this.observer(data[key])
    })
  }

  defineReActive(data, key, value) {
    let dep = new Dep()
    let that = this
    Object.defineProperty(data, key, {

      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if (value === newValue) {
          return
        }

        value = newValue
        that.observer(newValue)
        dep.notify(newValue)
      }
    })

  }
}