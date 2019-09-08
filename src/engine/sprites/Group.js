const DEFAULT_NUM_TILE_WIDTH = 32
const DEFAULT_NUM_TILE_HEIGHT = 32

export class Group {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        colIndex: 0,
        rowIndex: 0,
        colNum: DEFAULT_NUM_TILE_WIDTH,
        rowNum: DEFAULT_NUM_TILE_HEIGHT,
        children: [],
        parent: null,
        type: 'group',
      },
      options
    )
  }

  get renderer() {
    let renderer = this._renderer
    while (!renderer && this.parent) {
      renderer = this.parent.renderer
    }

    return renderer
  }

  set renderer(renderer) {
    this._renderer = renderer
  }

  // Add sprite (or another group) to children
  add(obj) {
    this.children.push(obj)
    obj.parent = this
  }

  clear(dt, renderer = this.renderer) {
    renderer.clearRect()
  }

  render(dt, renderer = this.renderer) {
    this.children.forEach(child => child.render(dt, renderer))
  }

  update(dt) {
    this.children.forEach(child => child.update(dt))
  }

  getSpriteByName(spriteName = '') {
    return this.getSprite('name', spriteName)
  }

  getSpritesByName(spriteName = '') {
    return this.getSprites('name', spriteName)
  }

  getSprite(key, value) {
    let sprite

    for (let i = 0; i < this.children.length; i++) {
      const item = this.children[i]
      if (item instanceof Group) {
        sprite = item.getSprite(key, value)
      } else if (item[key] === value) {
        sprite = item
      }

      if (sprite) {
        return sprite
      }
    }

    return null
  }

  getSprites(key, value) {
    let sprites = []

    for (let i = 0; i < this.children.length; i++) {
      const item = this.children[i]
      if (item instanceof Group) {
        sprites = sprites.concat(item.getSprites(key, value))
      } else if (item[key] === value) {
        sprites.push(item)
      }
    }

    return sprites
  }
}
