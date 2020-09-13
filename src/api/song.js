import { commonParams } from './config'
import axios from 'axios'

export function getLyrics(mid) {
  const url = '/api/lyrics'

  const params = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    g_tk: 67232076
  })

  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
