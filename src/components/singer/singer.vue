<template>
  <div class="singer">
    <list-view :data="orderedSingerList"></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from '@/api/singer'
import pinyin from 'js-pinyin'
import Singer from 'common/js/singer'
import ListView from '@/base/listview/listview'

const HOT_SINGERS_TITLE = '热门'
const HOT_SIGNERS_COUNT = 10

export default {
  name: 'singer',
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
    _getSingerList: function () {
      getSingerList().then((response) => {
        const normalizedSingerList = this._normalizeSingerData(response.singerList)
        this.orderedSingerList = this._sortSingerList(normalizedSingerList)
        console.log(this.orderedSingerList)
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
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
