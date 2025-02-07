<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, key) in dots" :class="{active: key === currentDotIndex}" :key="key"></span>
    </div>
  </div>
</template>

<script>
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    // loop play
    loop: {
      type: Boolean,
      default: true
    },

    // auto play
    auto: {
      type: Boolean,
      default: true
    },

    // Loop interval (ms)
    interval: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      dots: [],
      currentDotIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this.setSliderWidth()
      this.initDots()
      this.initSlider()

      if (this.auto === true) {
        this.autoPlay()
      }
    }, 20)

    // Recalculate slider size if screen size changed
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }

      this.setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        momentum: false
      })

      this.slider.on('scrollEnd', () => {
        this.currentDotIndex = this.slider.getCurrentPage().pageX
        if (this.auto === true) {
          this.autoPlay()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.auto) {
          clearTimeout(this.timer)
        }
      })
    },
    setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      const sliderWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    initDots() {
      this.dots = new Array(this.children.length)
    },
    autoPlay() {
      let nextPageIndex = this.currentDotIndex
      let mod = this.children.length

      // Remove the two extra pic
      if (this.loop) {
        nextPageIndex += 1
        mod = this.children.length - 2
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(nextPageIndex % mod, 0, 200)
      }, this.interval)
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: relative
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
