import axios from 'axios'
import { commonParams } from './config'

export function getHotKey() {
  const params = Object.assign({}, commonParams, {
    g_tk: 5381,
    needNewCode: 0
  })
  return axios.get('/api/getHotKey', {
    params
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}

/**
 * @param query query string
 * @param page page for loading
 * @param showSinger jump to song or singer
 * @returns {Promise<*>}
 */
export function search(query, page, showSinger) {
  const params = Object.assign({}, commonParams, {
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.center',
    searchid: 37031646194721207,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: showSinger ? 1 : 0,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: 10,
    w: query
  })
  return axios.get('/api/search', {
    params
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}
