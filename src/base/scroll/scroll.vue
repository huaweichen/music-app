<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    /**
     * Whether or not listen to scroll event
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullUpRefresh: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        const that = this
        this.scroll.on('scroll', (position) => {
          that.$emit('scroll', position)
        })
      }

      if (this.pullUpRefresh) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    enableScroll() {
      this.scroll && this.scroll.enable()
    },
    disableScroll() {
      this.scroll && this.scroll.disable()
    },
    refreshScroll() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data: function () {
      setTimeout(() => {
        this.refreshScroll()
      }, 20)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
