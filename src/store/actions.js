import * as types from './mutation-types'

export const playSongAction = function ({ commit, state }, { songList, index }) {
  commit(types.SET_SEQUENCE_LIST, songList)
  commit(types.SET_PLAYLIST, songList)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLS_CREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
