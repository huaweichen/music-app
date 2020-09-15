<template>
  <div class="singer" ref="singer">
    <list-view :data="orderedSingerList" @select="selectSinger" ref="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from '@/api/singer'
import pinyin from 'js-pinyin'
import Singer from 'common/js/singer'
import ListView from '@/base/listview/listview'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/assets/js/mixin'

const HOT_SINGERS_TITLE = '热门'
const HOT_SIGNERS_COUNT = 10

export default {
  name: 'singer',
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      orderedSingerList: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlayList(playlist) {
      this.$refs.singer.style.bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singerList.refreshListView()
    },
    _getSingerList: function () {
      getSingerList().then((response) => {
        const normalizedSingerList = this._normalizeSingerData(response.singerList)
        this.orderedSingerList = this._sortSingerList(normalizedSingerList)
      })
    },

    _normalizeSingerData: function (singerList) {
      // singers mapper
      const singersMapper = {
        hot: {
          title: HOT_SINGERS_TITLE,
          items: []
        }
      }

      singerList.forEach((item, index) => {
        // init a singer
        const key = pinyin.getCamelChars(item.singer_name).charAt(0)
        const singer = new Singer({
          id: item.singer_id,
          mid: item.singer_mid,
          name: item.singer_name,
          avatar: item.singer_pic,
          key: key
        })

        // Pick the first 10 as hot singers
        if (index < HOT_SIGNERS_COUNT) {
          singersMapper.hot.items.push(singer)
        }

        // alphabetic ordered singers
        if (!singersMapper[key]) {
          singersMapper[key] = {
            title: key,
            items: []
          }
        }
        singersMapper[key].items.push(singer)
      })

      return singersMapper
    },

    // Sort singer list based on alphabetic
    _sortSingerList: function (normalizedSingerList) {
      const hotList = []
      const alphabeticList = []

      for (const key in normalizedSingerList) {
        const singer = normalizedSingerList[key]
        if (singer.title === HOT_SINGERS_TITLE) {
          hotList.push(singer)
          continue
        }
        alphabeticList.push(singer)
      }

      alphabeticList.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hotList.concat(alphabeticList)
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
