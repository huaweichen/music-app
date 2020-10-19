import * as types from './mutation-types'
import { playMode } from '@/assets/js/config'
import { shuffle } from '@/assets/js/util'
import { saveSearchHistory } from '@/assets/js/storage'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

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

export const insertSong = function ({ commit, state }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // Get current playing song
  const currentSong = playList[currentIndex]

  // Check whether or not given song is inside current list.
  const findPlayListIndex = findIndex(playList, song)
  currentIndex++
  playList.splice(currentIndex, 0, song)

  // has current song inside the play list
  if (findPlayListIndex > -1) {
    // has played already
    if (currentIndex > findPlayListIndex) {
      playList.splice(findPlayListIndex, 1)
      currentIndex--
    } else {
      // has not played yet
      playList.splice(findPlayListIndex + 1, 1)
    }
  }

  const currentSequenceIndex = findIndex(sequenceList, currentSong) + 1
  const findSequenceIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSequenceIndex, 0, song)
  if (findSequenceIndex > -1) {
    if (currentSequenceIndex > findSequenceIndex) {
      sequenceList.splice(findSequenceIndex, 1)
    } else {
      sequenceList.splice(findSequenceIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistoryAction = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearchHistory(query))
}
