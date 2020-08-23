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
