<template>
  <scroll class="suggest" :data="result" :pull-up-refresh="pullUpRefresh" @scrollToEnd="searchMore" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, key) in result" :key="key">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMoreToLoad" title=""></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from '@/api/search'
import { concatenateSingerName } from 'common/js/song'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

const TYPE_SINGER = 'singer'
const PER_PAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      page: 1,
      result: [],
      pullUpRefresh: true,
      hasMoreToLoad: true
    }
  },
  methods: {
    searchMore() {
      if (!this.hasMoreToLoad) {
        return
      }

      this.page++
      search(this.query, this.page, this.showSinger, PER_PAGE).then((response) => {
        console.log(response)
        this.result = this.result.concat(this.getResult(response))
        this.checkHasMore(response.song)
      })
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${concatenateSingerName(item.singer)}`
      }
    },
    getIconClass(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    search() {
      this.page = 1
      this.hasMoreToLoad = true
      this.$refs.suggest.scrollTo(0, 0) // first load scroll to end.
      search(this.query, this.page, this.showSinger, PER_PAGE).then((response) => {
        if (response.code !== 0) {
          this.result = []
        }

        this.checkHasMore(response.song)
        this.result = this.getResult(response)
      })
    },
    getResult(data) {
      let ret = []
      if (data.zhida && typeof data.zhida.zhida_singer !== 'undefined') {
        ret.push({ ...data.zhida.zhida_singer, ...{ type: TYPE_SINGER } })
      }
      if (data.song && data.song.list.length > 0) {
        ret = ret.concat(data.song.list)
      }

      console.log(ret)
      return ret
    },
    checkHasMore(songs) {
      if (!songs.list.length || (songs.curnum + songs.curpage * PER_PAGE) > songs.totalnum) {
        this.hasMoreToLoad = false
      }
    }
  },
  watch: {
    query(newQuery) {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
  height: 100%
  overflow: hidden

  .suggest-list
    padding: 0 30px

    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px

    .icon
      flex: 0 0 30px
      width: 30px

      [class^="icon-"]
        font-size: 14px
        color: $color-text-d

    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden

      .text
        no-wrap()

  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
