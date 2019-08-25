const DEFAULT_NUM_TILE_WIDTH = 32
const DEFAULT_NUM_TILE_HEIGHT = 32

export class Group {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        x: 0,
        y: 0,
        width: DEFAULT_NUM_TILE_WIDTH,
        height: DEFAULT_NUM_TILE_HEIGHT,
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

  render() {
    this.children.forEach(child => child.render(this.renderer))
  }

  update(dt) {
    this.children.forEach(child => child.update(dt))
  }

  getSpriteByName(spriteName) {
    return this.getSprite('name', spriteName)
  }

  getSprite(key, value) {
    let sprite

    for (let i = 0; i < this.children.length; i++) {
      const item = this.children[i]
      if (item instanceof Group) {
        sprite = item.getSprite(key, value)
      } else if (item.type === 'sprite' && item[key] === value) {
        sprite = item
      }

      if (sprite) {
        return sprite
      }
    }

    return null
  }
}
