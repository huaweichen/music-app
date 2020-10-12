<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, key) in result" :key="key">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { search } from '@/api/search'
import { concatenateSingerName } from 'common/js/song'

const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: []
    }
  },
  methods: {
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.songname} - ${concatenateSingerName(item.singer)}`
      }
    },
    getIconClass(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    search() {
      search(this.query, this.page, this.showSinger).then((response) => {
        if (response.code !== 0) {
          this.result = []
        }

        let ret = []
        if (response.zhida && typeof response.zhida.zhida_singer.singerID !== 'undefined') {
          ret.push({ ...response.zhida.zhida_singer, ...{ type: TYPE_SINGER } })
        }
        if (response.song && response.song.list.length > 0) {
          ret = ret.concat(response.song.list)
        }
        console.log(ret)
        this.result = ret
      })
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
