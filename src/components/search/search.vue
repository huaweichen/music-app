<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryUpdate="onQueryUpdate"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              @click="addToSearchQuery(item.k)"
              class="item"
              v-for="(item, key) in hotkey"
              :key="key">
              <span>{{ item.k }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @hideKeypad="blurInput" @selectedSongFromSearch="saveSearchRecord"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import { getHotKey } from '@/api/search'
import { mapActions, mapGetters } from 'vuex'
import SearchList from '@/base/search-list/search-list'

export default {
  data() {
    return {
      hotkey: [],
      query: ''
    }
  },
  created() {
    getHotKey().then((response) => {
      const hotkey = response.data.hotkey
      this.hotkey = hotkey.slice(0, 10)
    })
  },
  components: {
    SearchBox,
    Suggest,
    SearchList
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    saveSearchRecord() {
      this.saveSearchHistoryAction(this.query)
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addToSearchQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryUpdate(query) {
      this.query = query
    },
    ...mapActions([
      'saveSearchHistoryAction'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
