<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="rankList.toplist" ref="toplist">
      <ul>
        <li class="item" v-for="(item, index) in rankList.toplist" :key="index" @click="selectTopList(item)">
          <div class="icon">
            <img v-lazy="item.mbHeadPicUrl" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.song" :key="index">
              <span>{{ song.rank}}</span>
              <span>{{ song.title }} - {{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="typeof rankList.toplist === 'undefined'">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRankList } from '@/api/rank'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { playlistMixin } from '@/assets/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [
    playlistMixin
  ],
  methods: {
    handlePlayList(playlist) {
      this.$refs.rank.style.bottom = playlist.length ? '60px' : ''
      this.$refs.toplist.refreshScroll()
    },
    selectTopList(item) {
      this.setTopList(item)
      this.$router.push({
        path: `/rank/${item.topId}`
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  data() {
    return {
      rankList: {}
    }
  },
  created() {
    getRankList().then((response) => {
      this.rankList = response
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
