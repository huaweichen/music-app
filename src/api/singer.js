import { commonParams } from './config'
import axios from 'axios'

export function getSingerList() {
  const url = '/api/getSingerList'

  const params = Object.assign({}, commonParams, {
    sign: 'zzam7bavikilbfk2f3fef04bda3a286eeb40136f6b80f4a',
    data: {
      comm: {
        ct: 24,
        cv: 0
      },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area: -100,
          sex: -100,
          genre: -100,
          index: -100,
          sin: 0,
          cur_page: 1
        }
      }
    }
  })

  return axios.get(url, {
    params
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}

export function getSingerDetail(singerMid) {
  const url = '/api/getSingerDetail'
  const params = Object.assign({}, commonParams, {
    '-': 'getSingerSong' + (Math.random() + '').replace('0.', ''),
    sign: 'zzaxr2n8ltiire41p8233b7874c9282a885a43924ce2e62e1',
    data: { comm: { ct: 24, cv: 0 }, singerSongList: { method: 'GetSingerSongList', param: { order: 1, singerMid: '00067r4p0wBDDN', begin: 0, num: 10 }, module: 'musichall.song_list_server' } }
  })

  return axios.get(url, {
    params
  }).then((response) => {
    return Promise.resolve(response.data)
  })
}
