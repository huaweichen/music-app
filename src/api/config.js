/**
 * Common parameters for JSONP load from recommend list.
 *
 * @type {{outCharset: string, format: string, g_tk: number, inCharset: string, notice: number}}
 */
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'json',
  loginUin: 0,
  hostUin: 0,
  platform: 'yqq.json',
  needNewCode: 0
}

/**
 * Common options for JSONP.
 *
 * https://github.com/webmodules/jsonp#api
 * @type {{param: string}}
 */
export const options = {
  param: 'jsonpCallback'
}

/**
 * Error code when no error.
 * @type {number}
 */
export const ERR_OK = 0
