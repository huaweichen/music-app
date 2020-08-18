<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="playlist">
      <div>
        <div v-if="recommends.length > 0" class="slide-wrapper">
          <slider>
            <div v-for="(recommend, index) in recommends" :key="index">
              <a :href="recommend.linkUrl">
                <img :src="recommend.picUrl" :alt="recommend.name">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in playlist" class="item" :key="index">
              <div class="icon">
                <img @load="loadImage" v-lazy="item.imgurl" :alt="item.dissname" height="60" width="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!this.playlist.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend, getPlaylist } from '@/api/recommend'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

export default {
  data() {
    return {
      recommends: [],
      playlist: []
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend()
    this._getPlaylist()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        this.recommends = res.data.sliders
      })
    },
    _getPlaylist() {
      getPlaylist().then((res) => {
        this.playlist = res.list
      })
    },
    loadImage() {
      if (!this.hasImageLoaded) {
        this.$refs.scroll.refreshScroll()
        this.hasImageLoaded = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
