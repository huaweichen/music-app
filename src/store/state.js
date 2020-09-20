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
  currentIndex: -1, // currently playing in playList

  // disc song list
  disc: {},

  // TOP rank list
  topList: {}
}

export default state
