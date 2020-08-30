<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { songFactory } from '../../assets/js/song'
import MusicList from '@/components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      if (!this.singer.mid) {
        this.$router.push('/singer')
        return
      }

      getSingerDetail(this.singer.mid).then((response) => {
        if (response.data.songList.length > 0) {
          this.songs = this.normalizeSong(response.data.songList)
        }
      })
    },

    normalizeSong (list) {
      const ret = []
      list.forEach((song) => {
        if (song.songInfo.id && song.songInfo.album.id) {
          ret.push(songFactory(song.songInfo))
        }
      })

      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
