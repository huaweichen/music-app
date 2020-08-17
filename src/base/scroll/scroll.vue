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
    },
    enableScroll() {
      this.scroll && this.scroll.enable()
    },
    disableScroll() {
      this.scroll && this.scroll.disable()
    },
    refreshScroll() {
      this.scroll && this.scroll.refresh()
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
