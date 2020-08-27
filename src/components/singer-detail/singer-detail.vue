<template>
  <transition appear name="slide">
    <div>Test</div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'

export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      console.log(this.singer)
      if (!this.singer.mid) {
        this.$router.push('/singer')
        return
      }

      getSingerDetail().then((response) => {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
