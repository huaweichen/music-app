<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image"/>
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle"
           @touchstart.prevent="middleTouchStart"
           @touchmove.prevent="middleTouchMove"
           @touchend="middleTouchEnd"
      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="cdRotate">
              <img class="image" :src="currentSong.image"/>
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="currentLyrics && currentLyrics.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyrics">
              <p ref="lyricLine" class="text" :class="{'current': currentLineNumber === index}" v-for="(line, index) in currentLyrics.lines" :key="index">
                {{ line.txt }}
              </p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
          <span class="dot" :class="{'active': currentShow === 'lyrics'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @percentChange="changeAudioCurrentTime"></progress-bar>
          </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class="iconPlayMode" @click="changePlayMode"></i>
          </div>
          <div class="icon i-left" :class="disableClass">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableClass">
            <i :class="normalPlayerIcon" @click="togglePlaying"></i>
          </div>
          <div class="icon i-right" :class="disableClass">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdRotate"/>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniPlayerIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="canplay" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import LyricParser from 'lyric-parser'
import Scroll from '@/base/scroll/scroll'

const PREFIXED_TRANSFORM = prefixStyle('transform')

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyrics: null,
      currentLineNumber: 0,
      currentShow: 'cd', // cd or lyrics
      playingLyric: ''
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  computed: {
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    iconPlayMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    normalPlayerIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayerIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass() {
      return this.songReady ? '' : 'disable'
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    middleTouchStart(e) {
      this.touch.initialized = true
      const oneTouch = e.touches[0]
      this.touch.startX = oneTouch.pageX
      this.touch.startY = oneTouch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initialized) {
        return
      }

      const oneTouch = e.touches[0]
      const deltaX = oneTouch.pageX - this.touch.startX
      const deltaY = oneTouch.pageY - this.touch.startY

      // check it's a scroll or swipe
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }

      const leftX = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, leftX + deltaX))

      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[PREFIXED_TRANSFORM] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = '0ms'
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style.transitionDuration = '0ms'
    },
    middleTouchEnd(e) {
      let offsetWidth
      let middleLOpacity

      // swipe right -> left
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyrics'
          middleLOpacity = 0
        } else {
          offsetWidth = 0
          middleLOpacity = 1
        }
      } else {
        // swipe left -> right
        if (this.touch.percent < 0.8) {
          offsetWidth = 0
          this.currentShow = 'cd'
          middleLOpacity = 1
        } else {
          offsetWidth = -window.innerWidth
          middleLOpacity = 0
        }
      }

      this.$refs.lyricList.$el.style[PREFIXED_TRANSFORM] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = '300ms'
      this.$refs.middleL.style.opacity = middleLOpacity
      this.$refs.middleL.style.transitionDuration = '300ms'
    },
    handleLyrics(lineObject) {
      this.currentLineNumber = lineObject.lineNum
      if (lineObject.lineNum > 5) {
        const currentLine = this.$refs.lyricLine[lineObject.lineNum - 5]
        this.$refs.lyricList.scrollToElement(currentLine, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = lineObject.txt
    },
    getLyrics() {
      this.currentSong.getLyrics()
        .then((lyric) => {
          this.currentLyrics = new LyricParser(lyric, this.handleLyrics)
          if (this.playing) {
            this.currentLyrics.play()
          }
        }).catch(() => {
          this.currentLyrics = null
          this.playingLyric = ''
          this.currentLineNumber = 0
        })
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyrics) {
        this.currentLyrics.seek(0)
      }
    },
    changePlayMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }

      const currentSongIndex = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(currentSongIndex) // Need to keep current song's index

      this.setPlaySequence(list)
    },
    changeAudioCurrentTime(percent) {
      const currentTime = percent * this.currentSong.duration

      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyrics) {
        this.currentLyrics.seek(currentTime * 1000)
      }
    },
    updateTime(event) {
      this.currentTime = event.target.currentTime
    },
    formatTime(timestamp) {
      timestamp = timestamp | 0
      const minute = timestamp / 60 | 0
      const second = timestamp % 60

      return `${this.pad(minute)}:${this.pad(second)}`
    },
    pad(number) {
      const length = number.toString().length
      if (length < 2) {
        return `0${number}`
      }
      return number
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(element, done) {
      const { x, y, scale } = this.getPositionAndScale()

      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 500,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(element, done) {
      const { x, y, scale } = this.getPositionAndScale()
      this.$refs.cdWrapper.style.transition = 'all 0.5s'
      this.$refs.cdWrapper.style[PREFIXED_TRANSFORM] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[PREFIXED_TRANSFORM] = ''
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaySequence: 'SET_SEQUENCE_LIST'
    }),
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyrics) {
        this.currentLyrics.togglePlay()
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }

      if (this.playList.length === 1) {
        this.loop()
        return
      }

      let nextIndex = this.currentIndex - 1
      if (nextIndex === -1) {
        nextIndex = this.playList.length - 1
      }
      this.setCurrentIndex(nextIndex)
      if (!this.playing) {
        this.togglePlaying()
      }

      this.songReady = false
    },
    next() {
      if (!this.songReady) {
        return
      }

      if (this.playList.length === 1) {
        this.loop()
        return
      }

      let nextIndex = this.currentIndex + 1
      if (nextIndex === this.playList.length) {
        nextIndex = 0
      }
      this.setCurrentIndex(nextIndex)
      if (!this.playing) {
        this.togglePlaying()
      }

      this.songReady = false
    },
    canplay() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },

    // Get mini-player's position and scale compare to player's CD middle point.
    getPositionAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

      return {
        x, y, scale
      }
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      // make sure do not play music when change play mode
      if (newSong.id === oldSong.id) {
        return
      }

      if (this.currentLyrics) {
        this.currentLyrics.stop()
      }

      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyrics()
      })
    },
    playing(newState) {
      const audioElm = this.$refs.audio
      this.$nextTick(() => {
        newState ? audioElm.play() : audioElm.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
