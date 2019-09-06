import { Sprite } from './Sprite'

export class SceneSprite extends Sprite {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          children: [],
          width: 0,
          height: 0,
        },
        options
      )
    )
  }

  get y() {
    return this._y
  }

  set y(yPos) {
    this._y = yPos
    if (this.children) {
      this.children.forEach(sprite => {
        sprite.y = yPos + sprite.offsetY
      })
    }
  }

  get x() {
    return this._x
  }

  set x(xPos) {
    this._x = xPos
    if (this.children) {
      this.children.forEach(sprite => {
        sprite.x = xPos + sprite.offsetX
      })
    }
  }

  get hitType() {
    return this._hitType
  }

  set hitType(hitType = 'pass') {
    this._hitType = hitType
    if (this.children) {
      this.children.forEach(sprite => {
        sprite.hitType = hitType
      })
    }
  }

  get backgroundColor() {
    return this._backgroundColor
  }

  set backgroundColor(backgroundColor = 'red') {
    this._backgroundColor = backgroundColor
    if (this.children) {
      this.children.forEach(sprite => {
        sprite.backgroundColor = backgroundColor
      })
    }
  }

  addSprites(sprites = []) {
    sprites.forEach(sprite => this.addSprite(sprite))
  }

  addSprite(sprite) {
    if (this.children.indexOf(sprite) !== -1) {
      // Already has sprite in scene
      return
    }

    if (this.children.length === 0) {
      // First sprite will set origin
      this.x = sprite.x
      this.y = sprite.y
      this.width = sprite.width
      this.height = sprite.height
      sprite.offsetX = 0
      sprite.offsetY = 0
    } else {
      const dx = Math.max(0, this.x - sprite.x)
      const dy = Math.max(0, this.y - sprite.y)
      if (dx) {
        // We need to move local coordinate origin,
        // and keep other sprite unchanged
        this.children.forEach(childSprite => {
          childSprite.offsetX += dx
        })
        this.x = Math.min(this.x, sprite.x)
      }
      if (dy) {
        // We need to move local coordinate origin,
        // and keep other sprite unchanged
        this.children.forEach(childSprite => {
          childSprite.offsetY += dy
        })
        this.y = Math.min(this.y, sprite.y)
      }

      this.width = Math.max(this.width, sprite.x + sprite.width - this.x)
      this.height = Math.max(this.height, sprite.y + sprite.height - this.y)

      sprite.offsetX = sprite.x - this.x
      sprite.offsetY = sprite.y - this.y
    }

    this.children.push(sprite)
    sprite.scene = this
  }

  removeSprite(sprite) {
    const spriteIndex = this.children.indexOf(sprite)
    if (spriteIndex === -1) {
      // Already has no such sprite in scene
      return
    }

    this.children.splice(spriteIndex, 1)
    sprite.scene = null

    if (this.children.length === 0) {
      // Last sprite will reset origin
      this.x = 0
      this.y = 0
      this.width = 0
      this.height = 0
    } else {
      this.width = Math.min(this.width, sprite.x + sprite.width - this.x)
      this.height = Math.min(this.height, sprite.y + sprite.height - this.y)

      // Check if sprite contributes to current coordinate
      if (sprite.x === this.x) {
        const newX = this.children.reduce((childSprite1, childSprite2) => {
          return Math.min(childSprite1.x, childSprite2.x)
        })
        const dx = newX - sprite.x
        this.children.forEach(childSprite => (childSprite.offsetX += dx))
        this.x = newX
      }
      if (sprite.y === this.y) {
        const newY = this.children.reduce((childSprite1, childSprite2) => {
          return Math.min(childSprite1.y, childSprite2.y)
        })
        const dy = newY - sprite.y
        this.children.forEach(childSprite => (childSprite.offsetY += dy))
        this.y = newY
      }
    }

    // Sprite can only be in one scene
    sprite.offsetX = 0
    sprite.offsetY = 0
  }

  setHitArea({
    localX = 0,
    localY = 0,
    localWidth = this.width,
    localHeight = this.height,
  } = {}) {
    // Set all sprites outside of hit area to not hitable
    this.children
      .filter(
        sprite =>
          sprite.offsetX < localX ||
          sprite.offsetX + sprite.width > localWidth ||
          sprite.offsetY < localY ||
          sprite.offsetY + sprite.height > localHeight
      )
      .forEach(sprite => (sprite.disableHit = true))
  }

  render(dt, renderer) {
    this.children.forEach(child => child.render(dt, renderer))
  }
}
