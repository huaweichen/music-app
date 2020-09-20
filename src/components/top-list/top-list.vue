<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { songFactory } from 'common/js/song'

export default {
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.topList.title
    },
    bgImage() {
      return this.topList.mbHeadPicUrl
    },
    songs() {
      const ret = []
      this.topList.song.forEach((item, index) => {
        const publicSongList = ['bu-ai-wo.mp3', 'chou-ba-guai.mp3', 'yan-yuan.mp3', 'yellow.mp3']
        const publicSongIndex = index % 4
        item.url = publicSongList[publicSongIndex]
        ret.push(songFactory(item))
      })
      return ret
    },
    ...mapGetters([
      'topList'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
