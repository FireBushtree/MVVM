class Compile {
  constructor(el, data) {
    this.el = el ? document.querySelector(el) : null
    this.data = data

    // 1. 递归遍历dom树，在fragment中存放所有节点
    let fragment = this.ergodicDomTree(this.el)

    // 2. 编译数据
    this.compile(fragment)

    // 3. 返回数据
    this.el.appendChild(fragment)
  }

  ergodicDomTree(domTree) {
    let fragment = document.createDocumentFragment()

    while (domTree.firstChild) {
      fragment.appendChild(domTree.firstChild)
    }

    return fragment
  }

  compile(fragment) {
    // 遍历每一个元素
    Array.from(fragment.childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        this.compileElement(node)
        this.compile(node)
      } else {
        this.compileText(node)
      }
    })
  }

  compileElement(node) {
    Array.from(node.attributes).forEach(attribute => {
      let attributeName = attribute.name

      if (!this.isKeyAttribute(attributeName)) {
        return
      }

      let attributeValue = attribute.value
      let [,type] = attributeName.split('-')
      CompileUtil[type](node, attributeValue, this.data)
    })
  }

  compileText(node) {
    let text = node.textContent
    let reg = /\{\{([^}]+)\}\}/g

    if (reg.test(text)) {
      CompileUtil['text'](node, text, this.data)
    }

  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isKeyAttribute(attributeVlue) {
    let keyWord = 'v-'
    return attributeVlue.includes(keyWord)
  }
}

/**
 * Get and set the value
 */
CompileUtil = {
  getValue: function(data, value) {
    value = value.split('.')
    return value.reduce((prev, next) => {
      return prev[next]
    }, data)
  },

  getTextValue: function(data, text) {
    text = text.replace(/\{\{([^}]+)\}\}/g, (...arguement) => {
      return arguement[1]
    })

    return text
  },

  setValue: function (data, value, newValue) {
    value = value.split('.')
    value.reduce((prev, next, index) => {
      if (index === value.length - 1) {
        prev[next] = newValue
      }

      return prev[next]
    }, data)
  },

  model: function(node, attributeValue, data) {
    let valueInData = this.getValue(data, attributeValue)

    node.addEventListener('input', event => {
      this.setValue(data, attributeValue ,event.target.value)
    })

    new Watcher(data, attributeValue, newValue => {
      node.value = newValue
    })

    node.value = valueInData
  },

  text: function(node, text, data) {
    let textValue = this.getTextValue(data, text)
    new Watcher(data, textValue, newValue => {
      node.textContent = newValue
    })

    let valueInData = this.getValue(data, textValue)
    node.textContent = valueInData
  }
}