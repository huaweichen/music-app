import { playMode } from 'common/js/config'

const state = {
  // singer
  singer: {},

  // player
  playing: false,
  fullScreen: false,
  playList: [], // play list
  sequenceList: [], // origin list sequence
  mode: playMode.sequence,
  currentIndex: -1 // currently playing in playList
}

export default state
