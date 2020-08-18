<template>
  <div>
    歌手页面
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from '@/api/singer'

export default {
  name: 'singer',
  data () {
    return {
      singerList: {
        type: Array,
        default: []
      }
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList: function () {
      getSingerList().then((response) => {
        this.singerList = this._normalizeSingerData(response.singerList)
      })
    },
    _normalizeSingerData: function (singerList) {

    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
