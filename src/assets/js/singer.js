// Singer object
export default class Singer {
  constructor({ id, mid, name, avatar, key }) {
    this.id = id
    this.mid = mid
    this.name = name
    this.avatar = getHighResolution(avatar)
    this.key = key
  }
}

function getHighResolution(avatar) {
  return avatar.replace(/150x150/i, '300x300')
}
