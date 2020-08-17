const path = require('path')
const axios = require('axios')

const LAST_FM_API_KEY = '77e87f4fc3b0fa3b2ea29999acab6f04'
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.join(__dirname, './src/'))
    config.resolve.alias.set('common', path.join(__dirname, './src/assets'))
  },

  devServer: {
    before(app) {
      // QQ Music get recommend tracks
      app.get('/api/getQQRecommendTracks', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
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
          console.log(e)
        })
      })

      // QQ Music Get play list
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

          if (data.code === 0 && data.data.list.length > 0) {
            res.json({ list: data.data.list })
          } else {
            res.json(data)
          }
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  }
}
