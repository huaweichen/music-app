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
