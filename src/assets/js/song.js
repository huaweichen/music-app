import { getLyrics } from '@/api/song'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyrics() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyrics(this.mid).then((res) => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('No lyric for this song.'))
        }
      })
    })
  }
}

export function songFactory(songInfo) {
  console.log(songInfo)
  return new Song({
    id: songInfo.id,
    mid: songInfo.mid,
    singer: concatenateSingerName(songInfo.singer),
    name: songInfo.subtitle ? songInfo.title + ' - ' + songInfo.subtitle : songInfo.title,
    album: songInfo.album ? songInfo.album.title : songInfo.title,
    duration: songInfo.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.album ? songInfo.album.mid : songInfo.albumMid}.jpg?max_age=2592000`,
    url: `/songs/${songInfo.url}`
  })
}

function concatenateSingerName (singer) {
  if (!singer) {
    return 'Anonymous'
  }

  const ret = []
  singer.forEach((item) => {
    ret.push(item.name)
  })

  return ret.join(' & ')
}
