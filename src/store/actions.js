import * as types from './mutation-types'
import { playMode } from '../assets/js/config'
import { shuffle } from '../assets/js/util'

export const playSongAction = function ({ commit, state }, { songList, index }) {
  // Overwrite if it is random
  if (state.mode === playMode.random) {
    const randomList = shuffle(songList)
    commit(types.SET_PLAYLIST, randomList)
    // Overwrite current index as well.
    index = randomList.findIndex((item) => {
      return item.id === songList[index].id
    })
  } else {
    commit(types.SET_PLAYLIST, songList)
  }

  commit(types.SET_SEQUENCE_LIST, songList)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { songList }) {
  const randomList = shuffle(songList)

  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, songList)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
