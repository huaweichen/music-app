import axios from 'axios'
import { commonParams } from './config'

/**
 * Get recommend data via JSONP.
 */
export function getRecommend() {
  const params = Object.assign({}, commonParams, {
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

  return axios.get('/api/getQQRecommendTracks', {
    params
  }).then((res) => {
    return res
  })
}

export function getPlaylist () {
  const url = '/api/getPlaylist'

  const params = Object.assign({}, commonParams, {
    rnd: Math.random(),
    picmid: 1,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19
  })

  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
