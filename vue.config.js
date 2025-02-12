const path = require('path')
const axios = require('axios')

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.join(__dirname, './src/'))
    config.resolve.alias.set('common', path.join(__dirname, './src/assets'))
  },

  devServer: {
    before(app) {
      // QQ Music rank list
      app.get('/api/getRankList', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          console.log(response.data)
          if (response.data.code === 0 && response.data.toplist.code === 0) {
            res.json(response.data.toplist.data.group)
          } else {
            res.json(response.data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getRankList')
          console.log(e)
        })
      })

      // QQ Music play list details (Disc)
      app.get('/api/getSongList', (req, res) => {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios.get(url, {
          headers: {
            referer: `https://y.qq.com/n/yqq/playlist/${req.query.disstid}.html`,
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          console.log(response.data)
          if (response.data.code === 0) {
            const songlist = response.data.cdlist[0].songlist
            res.json(songlist)
          } else {
            res.json(response.data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getSongList')
          console.log(e)
        })
      })

      // QQ Music get lyrics
      app.get('/api/lyrics', (req, res) => {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          console.log(response.data)
          res.json(response.data)
        }).catch((e) => {
          console.log('Fail to load /api/lyrics')
          console.log(e)
        })
      })

      // QQ Music get recommend tracks
      app.get('/api/getQQRecommendTracks', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        // Jump to different URL based on "jumptype"
        const jumpTypeUrlMapper = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }

        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          response = response.data
          console.log(response)

          // Err OK === 0
          if (response.code === 0) {
            const sliders = []
            const hasContent = (response.focus.code === 0) && (response.focus.data && response.focus.data.shelf.v_niche[0].v_card)
            if (hasContent) {
              const vCards = response.focus.data.shelf.v_niche[0].v_card
              for (let i = 0; i < vCards.length; i++) {
                const item = vCards[i]
                const jumpUrlPrefix = jumpTypeUrlMapper[item.jumptype || 10002]
                const slider = {
                  id: item.id,
                  linkUrl: jumpUrlPrefix + item.subid + '.html',
                  picUrl: item.cover,
                  name: item.title
                }

                sliders.push(slider)
              }
            }
            res.json({
              sliders
            })
          } else {
            res.json(response)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getQQRecommendTracks')
          console.log(e)
        })
      })

      // QQ Music get play list
      app.get('/api/getPlaylist', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        axios.get(url, {
          headers: {
            origin: 'https://y.qq.com',
            referer: 'https://y.qq.com',
            host: 'y.qq.com'
          },
          params: req.query
        }).then((response) => {
          const data = response.data
          console.log(data)

          if (data.code === 0 && data.data.list.length > 0) {
            res.json({ list: data.data.list })
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getPlaylist')
          console.log(e)
        })
      })

      // QQ Music get singers
      app.get('/api/getSingerList', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          params: req.query
        }).then((response) => {
          const data = response.data

          console.log(data)
          // ERR_OK is 0
          if (data.code === 0) {
            res.json({ singerList: data.singerList.data.singerlist })
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getSingerList')
          console.log(e)
        })
      })

      // QQ Music get singer detail
      app.get('/api/getSingerDetail', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        axios.get(url, {
          params: req.query
        }).then((response) => {
          const data = response.data
          console.log(data)
          if (
            data.code === 0 &&
            data.singerSongList.code === 0 &&
            data.singerSongList.data.songList.length > 0
          ) {
            res.json({ data: data.singerSongList.data })
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getSingerDetail')
          console.log(e)
        })
      })

      // QQ Music get singer detail
      app.get('/api/getRankSongList', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        axios.get(url, {
          params: req.query
        }).then((response) => {
          const data = response.data
          console.log(data)
          if (
            data.code === 0 &&
            data.detail.code === 0 &&
            data.detail.data.songInfoList.length > 0
          ) {
            res.json({ data: data.detail.data.songInfoList })
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getSingerDetail')
          console.log(e)
        })
      })

      app.get('/api/getHotKey', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          const data = response.data
          console.log(data)
          if (
            data.code === 0 &&
            typeof data.hotkey !== 'undefined' &&
            data.hotkey.length > 0
          ) {
            res.json(data.hotkey)
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/getHotKey')
          console.log(e)
        })
      })

      app.get('/api/search', (req, res) => {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          const data = response.data
          console.log(data)
          if (data.code === 0) {
            res.json({ code: data.code, song: data.data.song, zhida: data.data.zhida })
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log('Fail to load /api/search')
          console.log(e)
        })
      })
    }
  }
}
