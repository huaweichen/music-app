import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export function saveSearchHistory (query) {
  const currentSearches = storage.get(SEARCH_KEY, [])
  insertArray(currentSearches, query, (item) => {
    // given item is in array already
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, currentSearches)
  return currentSearches
}

export function loadSearchHistory () {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearchHistory (query) {
  const currentSearches = storage.get(SEARCH_KEY, [])
  deleteFromArray(currentSearches, (searchItem) => {
    return searchItem === query
  })
  storage.set(SEARCH_KEY, currentSearches)

  return currentSearches
}

export function clearAllSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

/**
 * Add into an array. Consider existing value.
 * @param arr
 * @param val
 * @param compare Compare current array has current search value.
 * @param maxLength
 */
function insertArray(arr, val, compare, maxLength) {
  const index = arr.findIndex(compare)
  // given value is first record
  if (index === 0) {
    return
  }

  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)

  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

/**
 * Delete from an array
 * @param arr
 * @param compare Compare current array has current search value.
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
