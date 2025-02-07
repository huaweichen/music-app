<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playRandomBtn" @click="playRandom">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @selectSong="selectSong" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import Loading from '@/base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import { playlistMixin } from '@/assets/js/mixin'

const TITLE_HEIGHT = 40

const PREFIXED_TRANSFORM = prefixStyle('transform')

export default {
  mixins: [
    playlistMixin
  ],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    },
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  methods: {
    handlePlayList(playlist) {
      this.$refs.list.$el.style.bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.refreshScroll()
    },
    playRandom() {
      this.randomPlay({ songList: this.songs })
    },
    selectSong(song, index) {
      this.playSongAction({
        songList: this.songs,
        index
      })
    },
    ...mapActions([
      'playSongAction',
      'randomPlay'
    ]),
    back() {
      this.$router.back()
    },
    scroll(position) {
      this.scrollY = position.y
    }
  },
  watch: {
    scrollY(newScrollY) {
      const translateY = Math.max(this.minTranslateY, newScrollY)
      let zIndex = 0
      let scale = 1
      let blur = 0

      this.$refs.layer.style[PREFIXED_TRANSFORM] = `translate3d(0, ${translateY}px, 0)`

      // Drag down
      const percent = Math.abs(newScrollY / this.imageHeight)
      if (newScrollY > 0) {
        scale = 1 + percent
        zIndex = 10
      }

      // drag down blur image
      if (newScrollY <= 0) {
        blur = Math.min(10 * percent, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`

      // Scroll up to title
      if (newScrollY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
        this.$refs.playRandomBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playRandomBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[PREFIXED_TRANSFORM] = `scale(${scale})`
    }
  },
  computed: {
    bgStyle() {
      return 'background-image:url(' + this.bgImage + ')'
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.$refs.bgImage.clientHeight + TITLE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
