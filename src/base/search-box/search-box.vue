<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="searchBox"/>
    <i @click="clearSearchBox" class="icon-dismiss" v-show="query.length > 0"></i>
  </div>
</template>

<script type="text/ecmascript-6">

import { debounce } from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲或歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    blur() {
      this.$refs.searchBox.blur()
    },
    clearSearchBox() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('queryUpdate', newQuery)
    }, 200))
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px

  .icon-search
    font-size: 24px
    color: $color-background

  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium

    &::placeholder
      color: $color-text-d

  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>
