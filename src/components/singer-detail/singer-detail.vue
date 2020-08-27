<template>
  <transition name="slide">
    <div class="music-list">
      <ul>
        <li v-for="(song, key) in songs" :key="key">
          <label>{{song.name}}</label>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { songFactory } from '../../assets/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
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
      if (!this.singer.mid) {
        this.$router.push('/singer')
        return
      }

      getSingerDetail().then((response) => {
        if (response.data.songList.length > 0) {
          this.songs = this.normalizeSong(response.data.songList)
          console.log(this.songs)
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

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
</style>
