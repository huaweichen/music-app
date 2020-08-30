/**
 * Dom manipulator
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(element, name, value) {
  const dataName = 'data-' + name
  return element.getAttribute(dataName)
}

export function setData(element, name, value) {
  const dataName = 'data-' + name
  if (value) {
    return element.setAttribute(dataName, value)
  }
}

// Browser capability check
const elementStyle = document.createElement('div').style
const vendor = (() => {
  const transformVendorNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (const key in transformVendorNames) {
    if (elementStyle[transformVendorNames[key]] !== undefined) {
      return key
    }
  }

  // unknown browser
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
