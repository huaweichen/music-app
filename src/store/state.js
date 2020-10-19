import { playMode } from 'common/js/config'
import { loadSearchHistory } from 'common/js/storage'

const state = {
  // singer
  singer: {},

  // player
  playing: false,
  fullScreen: false,
  playList: [], // play list
  sequenceList: [], // origin list sequence
  mode: playMode.sequence,
  currentIndex: -1, // currently playing in playList

  // disc song list
  disc: {},

  // TOP rank list
  topList: {},

  searchHistory: loadSearchHistory()
}

export default state
