class Compile {

  constructor(mvvm) {
    this.el = document.querySelector(mvvm.$el)
    this.vm = mvvm.$data
    // Step 1. Put all the dom into internal storage with fragment
    let fragment = this.node2fragement(this.el)

    // Step 2.
    this.compile(fragment)

    // Step 3. Set value
    this.el.appendChild(fragment)
  }

  node2fragement(domTree) {
    let fragment = document.createDocumentFragment()

    while (domTree.firstChild) {
      fragment.appendChild(domTree.firstChild)
    }

    return fragment
  }

  compile(fragment) {
    let fragmentItem = fragment.childNodes
    fragmentItem.forEach( element => {

      if (this.isElementNode(element)) {
        this.compileAttributes(element)
        this.compile(element)
      } else {
        this.compileText(element)
      }

    })
  }

  compileText(node) {
    let text = node.textContent
    let reg = /\{\{([^}]+)\}\}/g

    if (reg.test(text)) {
      CompileUtil['text'](node, text , this.vm)
    }

  }

  compileAttributes(node) {
    let attrs = node.attributes

    Array.from(attrs).forEach( element => {
      let attrName = element.name
      let attrValue = element.value

      if (this.isVueAttribute(attrName)) {
        let [, type] = attrName.split('-')
        //compile the value
        CompileUtil[type](node, attrValue, this.vm)
      }

    })
  }

  isVueAttribute(nodeAttribute) {
    return nodeAttribute.includes('v-')
  }

  isElementNode(node) {
    return node.nodeType === 1
  }
}

CompileUtil = {
  /**
   * Get the value of vm
   */
  getValue: function (name, vm) {
    name = name.split('.')
    let value = name.reduce(function (prev, next) {
      return prev[next]
    }, vm)

    return value
  },

  getTextValue: function (text, vm) {
    value = text.replace(/\{\{([^}]+)\}\}/g, (...arguement) => {
      return this.getValue(arguement[1], vm)
    })

    return value
  },

  /**
   * Compile 'v-model'
   */
  model: function (node, attrValue, vm) {
    let value = this.getValue(attrValue, vm)
    node.value = value
  },

  text: function(node, text, vm) {
    let value = this.getTextValue(text, vm)
    node.textContent = value
  }
}
