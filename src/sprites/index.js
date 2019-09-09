import { RectSprite } from '../engine/sprites/RectSprite'
// import { FrameSprite } from '../engine/sprites/FrameSprite'
import { palette } from '../utils/colors'

// Color for sprites
const playerColor = palette.brown[2]
const kingColor = palette.blue[2]
const npcJohnColor = palette.green[1]
const npcFireDragonColor = palette.red[2]

function createRectSprite({
  backgroundColor = palette.red[3],
  opacity = 1,
  name = 'placeholder',
  hitType = 'pass',
  showName = false,
  render,
  callback = () => {},
}) {
  return class extends RectSprite {
    constructor(options = {}) {
      super(
        Object.assign(
          {
            opacity,
            backgroundColor,
            name,
            hitType,
            showName,
          },
          options
        )
      )

      if (render) {
        this.render = render
      }

      callback.call(this)
    }
  }
}

export const EmptySprite = createRectSprite({
  opacity: 0,
  name: 'empty',
  render: () => {},
})

export const GroundSprite = createRectSprite({
  name: 'ground',
  backgroundColor: palette.gunmetal[3],
})

export const WallSprite = createRectSprite({
  name: 'wall',
  backgroundColor: palette.brown[3],
  hitType: 'stop',
})

export const CastleDoorSprite = createRectSprite({
  name: 'castleDoorSprite',
  backgroundColor: palette.green[3],
})

export const TopDoorSprite = createRectSprite({
  name: 'topDoorSprite',
  backgroundColor: palette.green[3],
})

export const BottomDoorSprite = createRectSprite({
  name: 'bottomDoorSprite',
  backgroundColor: palette.green[3],
})

export const LeftDoorSprite = createRectSprite({
  name: 'leftDoorSprite',
  backgroundColor: palette.green[3],
})

export const RightDoorSprite = createRectSprite({
  name: 'rightDoorSprite',
  backgroundColor: palette.green[3],
})

export const WallTopSprite = createRectSprite({
  name: 'wallTopSprite',
  backgroundColor: palette.brown[1],
})

export const BackgroundSprite = createRectSprite({
  name: 'backgroundSprite',
  backgroundColor: palette.gunmetal[4],
  opacity: 0,
})

export const KingSprite = createRectSprite({
  name: 'king',
  backgroundColor: kingColor,
  hitType: 'stop',
  showName: true,
})

export const PlayerSprite = createRectSprite({
  name: 'player',
  backgroundColor: playerColor,
  showName: true,
  callback: function() {
    // set velocity
    this.vx = 0
    this.vy = 0
    // sqrt rule applies here
    // pixel per 1 ms
    this.vMax = this.width / 4

    this.setHitArea({
      localX: 0,
      localY: this.height / 2,
      localWidth: this.width,
      localHeight: this.height / 2,
    })
  },
})

// const PlayerSprite2 = createRectSprite({
//   name: 'playerSprite2',
//   backgroundColor: palette.red[4],
//   showName: true,
// })

// TODO: add factory code for creating RectSprite for player
// export class PlayerSprite extends FrameSprite {
//   constructor(options = {}) {
//     // construct sprite using base sprite
//     super({
//       ...options,
//       frameMap: {
//         stand1: new PlayerSprite1({ ...options }),
//         stand2: new PlayerSprite2({ ...options }),
//       },
//     })

//     // set velocity
//     this.vx = 0
//     this.vy = 0
//     // sqrt rule applies here
//     // pixel per 1 ms
//     this.vMax = this.width / 4

//     this.setHitArea({
//       localX: 0,
//       localY: this.height / 2,
//       localWidth: this.width,
//       localHeight: this.height / 2,
//     })
//   }
// }

export const JohnSprite = createRectSprite({
  name: 'john',
  backgroundColor: npcJohnColor,
  hitType: 'stop',
  showName: true,
})

export const FireDragonSprite = createRectSprite({
  name: 'john',
  backgroundColor: npcFireDragonColor,
  hitType: 'stop',
  showName: true,
})

// Dialog Sprites
export const KingDialogSprite = createRectSprite({
  name: 'kingDialogSprite',
  backgroundColor: kingColor,
})

export const PlayerDialogSprite = createRectSprite({
  name: 'playerDialogSprite',
  backgroundColor: playerColor,
})

export const NpcJohnDialogSprite = createRectSprite({
  name: 'npcJohnDialogSprite',
  backgroundColor: npcJohnColor,
})

export const NpcFireDragonDialogSprite = createRectSprite({
  name: 'npcFireDragonDialogSprite',
  backgroundColor: npcFireDragonColor,
})
