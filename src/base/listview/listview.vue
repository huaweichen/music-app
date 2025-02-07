<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType"
  >
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(singer, index) in group.items" class="list-group-item" :key="index" @click="selectSinger(singer)">
            <img class="avatar" v-lazy="singer.avatar" alt="singer.name">
            <span class="name">{{singer.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(shortcut, index) in shortcutList"
            :key="index"
            class="item"
            :class="{'current': parseInt(currentIndex) === index}"
            :data-index="index"
        >
          {{shortcut}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle !== ''" ref="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from '@/base/loading/loading'

/**
 * Anchor's height
 * @type {number}
 */
const ANCHOR_HEIGHT = 18

const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      // current highlighted list item
      currentIndex: 0,
      titleOffset: -1
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight

      if (newY > 0) {
        this.currentIndex = 0
        return
      }

      for (let i = 0; i < listHeight.length; i++) {
        const heightTop = listHeight[i]
        const heightBottom = listHeight[i + 1]

        if ((heightTop && !heightBottom) || (-newY >= heightTop && -newY < heightBottom)) {
          this.currentIndex = i
          this.titleOffset = heightBottom + newY
          return
        }
      }

      this.currentIndex = 0
    },
    titleOffset(offsetValue) {
      const fixedTop = (offsetValue > 0 && offsetValue < TITLE_HEIGHT) ? offsetValue - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    refreshListView() {
      this.$refs.listview.refreshScroll()
    },
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
      const anchorIndex = parseInt(this.touch.anchorIndex) + Math.floor(touchDelta / ANCHOR_HEIGHT)
      this.scrollToAnchor(anchorIndex)
    },
    scrollToAnchor(index) {
      // Skip top and bottom extra div
      if (!index && index !== 0) {
        return
      }

      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },

    /**
     * Listview link with shortcut
     * @param position
     */
    scroll (position) {
      this.scrollY = position.y
    },

    /**
     * Calculate listview items (in group) height
     */
    calculateHeight() {
      this.listHeight = []
      const listgroup = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < listgroup.length; i++) {
        const item = listgroup[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },

    selectSinger(singer) {
      this.$emit('select', singer)
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
