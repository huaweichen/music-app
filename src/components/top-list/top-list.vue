<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songList" :rank="true"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { songFactory } from 'common/js/song'
import { getRankSongList } from '@/api/rank'

export default {
  data() {
    return {
      songList: []
    }
  },
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
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    if (!this.topList.topId) {
      this.$router.push('/rank')
      return
    }

    getRankSongList(this.topList.topId).then((res) => {
      if (typeof res.data !== 'undefined' && res.data.length > 0) {
        this.songList = this.normalizeSongList(res.data)
      }
    })
  },
  methods: {
    normalizeSongList(songList) {
      const ret = []

      songList.forEach((item, index) => {
        const publicSongList = ['bu-ai-wo.mp3', 'chou-ba-guai.mp3', 'yan-yuan.mp3', 'yellow.mp3']
        const publicSongIndex = index % 4
        item.url = publicSongList[publicSongIndex]
        ret.push(songFactory(item))
      })

      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
