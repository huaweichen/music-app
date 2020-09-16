<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { getSongList } from '@/api/recommend'
import { mapGetters } from 'vuex'
import { songFactory } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  methods: {
    init() {
      if (!this.disc.dissid) {
        console.log(this.disc)
        this.$router.push('/recommend')
        return
      }

      getSongList(this.disc.dissid)
        .then((response) => {
          this.songs = this.normalizeSongs(response)
          console.log(this.songs)
        })
    },
    normalizeSongs(list) {
      const ret = list.map((song, index) => {
        // Get static music due to copyright in China mainland.
        const publicSongList = ['bu-ai-wo.mp3', 'chou-ba-guai.mp3', 'yan-yuan.mp3', 'yellow.mp3']
        const publicSongIndex = index % 4
        song.url = publicSongList[publicSongIndex]

        if (song.mid) {
          return songFactory(song)
        }
      })
      return ret
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
