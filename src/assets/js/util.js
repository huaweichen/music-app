export function shuffle(arr) {
  const arrCopy = arr.slice()

  for (let i = 0; i < arrCopy.length; i++) {
    const j = getRandomInt(0, i)
    const t = arrCopy[i]
    arrCopy[i] = arrCopy[j]
    arrCopy[j] = t
  }

  return arrCopy
}

/**
 * Get an int between min and max (inclusive max)
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Util debounce for search.
 *
 * @param func
 * @param delay
 * @returns {function(...[*]=): void}
 */
export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
