import originJSONP from 'jsonp'

/**
 * @deprecated
 *
 * Customized JSONP wrapper with Promise
 * @param url
 * @param param
 * @param options
 */
export default function jsonp(url, param, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + buildUrlWithParam(param)

  return new Promise((resolve, reject) => {
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function buildUrlWithParam(param) {
  let url = ''
  for (var i in param) {
    const value = param[i] !== undefined ? param[i] : ''
    url += `&${i}=${value}`
  }

  return url ? url.substring(1) : ''
}
