<template>
  <div class="progress-bar" ref="progressBar" @click="progressBarClickHandler">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import { prefixStyle } from '../../assets/js/dom'

const PROGRESS_BTN_WIDTH = 16
const TRANSFORM = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {
      initialized: false
    }
  },
  methods: {
    progressBarClickHandler(event) {
      this.calculateOffsetX(event.offsetX)
      this.changePercent()
    },
    progressTouchStart(event) {
      this.touch.initialized = true
      this.touch.startX = event.touches[0].pageX // touch start point
      this.touch.leftX = this.$refs.progress.clientWidth // progress width
    },
    progressTouchMove(event) {
      if (this.touch.initialized === false) {
        return
      }

      const deltaX = event.touches[0].pageX - this.touch.startX // X width of dragged
      const newProgressX = Math.min(Math.max(0, this.touch.leftX + deltaX), this.progressBarWidth)
      this.calculateOffsetX(newProgressX)
    },
    progressTouchEnd() {
      this.touch.initialized = false
      this.changePercent()
    },
    calculateOffsetX(widthX) {
      this.$refs.progress.style.width = `${widthX}px`
      this.$refs.progressBtn.style[TRANSFORM] = `translate3d(${widthX}px, 0, 0)`
    },
    changePercent() {
      const newAudioPercent = this.$refs.progress.clientWidth / this.progressBarWidth
      this.$emit('percentChange', newAudioPercent)
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && this.touch.initialized === false) {
        this.progressBarWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
        const offsetLeftWidth = newPercent * this.progressBarWidth
        this.calculateOffsetX(offsetLeftWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
