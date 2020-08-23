<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(singer, index) in group.items" class="list-group-item" :key="index">
            <img class="avatar" v-lazy="singer.avatar" alt="singer.name">
            <span class="name">{{singer.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(shortcut, index) in shortcutList" :key="index" class="item" data-index="index">
          {{shortcut}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import { getData } from 'common/js/dom'

/**
 * Anchor's height
 * @type {number}
 */
const ANCHOR_HEIGHT = 18

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Scroll
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    onShortcutTouchStart(element) {
      const anchorIndex = getData(element.target, 'index')
      const firstTouch = element.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      this.scrollToAnchor(anchorIndex)
    },
    onShortcutTouchMove(element) {
      const firstTouch = element.touches[0]
      this.touch.y2 = firstTouch.pageY
      const touchDelta = this.touch.y2 - this.touch.y1
      const anchorIndex = this.touch.anchorIndex + Math.floor(touchDelta / ANCHOR_HEIGHT)

      this.scrollToAnchor(anchorIndex)
    },
    scrollToAnchor(index) {
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
