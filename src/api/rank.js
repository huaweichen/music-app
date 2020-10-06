import { commonParams } from './config'
import axios from 'axios'
import moment from 'moment'

export function getRankList() {
  const url = '/api/getRankList'
  // sign and singerMid are bind together, not possible to list dynamically.
  const params = Object.assign({}, commonParams, {
    '-': 'recom5843519863443307',
    sign: 'zzafcwkh6soiyx2wycff15c4441255ee9ef959d8dacccc3f88',
    data: {
      comm: { ct: 24 },
      category: { method: 'get_hot_category', param: { qq: '' }, module: 'music.web_category_svr' },
      recomPlaylist: { method: 'get_hot_recommend', param: { async: 1, cmd: 2 }, module: 'playlist.HotRecommendServer' },
      playlist: {
        method: 'get_playlist_by_category',
        param: { id: 8, curPage: 1, size: 40, order: 5, titleid: 8 },
        module: 'playlist.PlayListPlazaServer'
      },
      new_song: { module: 'newsong.NewSongServer', method: 'get_new_song_info', param: { type: 5 } },
      new_album: { module: 'newalbum.NewAlbumServer', method: 'get_new_album_info', param: { area: 1, sin: 0, num: 20 } },
      new_album_tag: { module: 'newalbum.NewAlbumServer', method: 'get_new_album_area', param: {} },
      toplist: { module: 'musicToplist.ToplistInfoServer', method: 'GetAll', param: {} },
      focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
    }
  })

  return axios.get(url, {
    params
  }).then((response) => {
    // Only return 'TOP' rank list
    return Promise.resolve(response.data[0])
  })
}

export function getRankSongList(rankId) {
  const url = '/api/getRankSongList'
  // sign and singerMid are bind together, not possible to list dynamically.
  const params = Object.assign({}, commonParams, {
    '-': 'getUCGI18929558212760966',
    sign: 'zzaqrkqbxrdwpz637327304f04b6ae75c225c5ee81ed46',
    data: {
      detail: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetDetail',
        param: {
          topId: rankId,
          offset: 0,
          num: 20,
          period: moment().format('YYYY-MM-DD')
        }
      },
      comm: {
        ct: 24,
        cv: 0
      }
    }
  })

  return axios.get(url, {
    params
  }).then((response) => {
    // Only return 'TOP' rank list
    return Promise.resolve(response.data)
  })
}
