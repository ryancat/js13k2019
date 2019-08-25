import { generateMapData } from '../maps/emptyMap'
import { Group } from '../sprites/Group'

export class BaseIncident {
  constructor(options = {}) {
    const { game, key } = options

    Object.assign(this, {
      game,
      key,
      flag: {
        finished: false,
        initState: false,
      },
    })
  }

  play(dt) {
    if (this.flag.finished) {
      return true
    }

    // init or update incident
    if (!this.flag.initState) {
      this.initMapGroup()
      this.flag.initState = true
    } else {
      this.update(dt)
    }

    // render layers
    this.flag.layerDirtyArr.forEach((isLayerDirty, layerIndex) => {
      if (isLayerDirty) {
        this.mapGroup.children[layerIndex].render()
      }
    })
  }

  terminate() {
    this.flag.finished = true
  }

  createMapData() {
    this.mapData = generateMapData(
      this.game.width,
      this.game.height,
      this.game.pixelWidth,
      this.game.pixelHeight
    )
  }

  initMapGroup() {
    this.createMapData()

    // init map group
    this.mapGroup = new Group({
      width: this.mapData.width,
      height: this.mapData.height,
      pixelWidth: this.game.pixelWidth,
      pixelHeight: this.game.pixelHeight,
      tileWidthScale: this.mapData.tileWidthScale,
      tileHeightScale: this.mapData.tileHeightScale,
      tileSpriteMap: this.mapData.tileSpriteMap,
      objectSpriteMap: this.mapData.objectSpriteMap,
      layers: this.mapData.layers,
      renderer: this.game.layerMap['main'],
      type: 'map',
    })

    // init layers in map
    this.mapGroup.layers.forEach(layer => {
      // for each layer, we need to create layer group to hold sprites
      const layerGroup = new Group({
        width: this.mapGroup.width,
        height: this.mapGroup.height,
        pixelWidth: this.mapGroup.pixelWidth,
        pixelHeight: this.mapGroup.pixelHeight,
        type: 'layer',
      })

      const pixelWidth = layerGroup.pixelWidth / layerGroup.width
      const pixelHeight = layerGroup.pixelHeight / layerGroup.height

      switch (layer.type) {
        case 'tilelayer':
          // for tiled layer, we will draw them as is
          // create sprites for the current layer
          layer.data.forEach((tileId, tileIndex) => {
            layerGroup.add(
              this.game.createSprite(this.mapGroup.tileSpriteMap[tileId], {
                x: (tileIndex % layerGroup.width) * pixelWidth,
                y: Math.floor(tileIndex / layerGroup.width) * pixelHeight,
                pixelWidth,
                pixelHeight,
              })
            )
          })
          break

        case 'objectgroup':
          // for object layer, we need to put object at given location
          layer.objects.forEach(gameObject => {
            layerGroup.add(
              this.game.createSprite(
                this.mapGroup.objectSpriteMap[gameObject.id],
                {
                  x: gameObject.x * this.mapGroup.tileWidthScale,
                  y: gameObject.y * this.mapGroup.tileHeightScale,
                  pixelWidth: gameObject.width * this.mapGroup.tileWidthScale,
                  pixelHeight:
                    gameObject.height * this.mapGroup.tileHeightScale,
                  name: gameObject.name,
                }
              )
            )
          })
          break
      }

      // add layer group to map group
      this.mapGroup.add(layerGroup)

      // for debug
      if (IS_DEV_MODE) {
        window[`${this.constructor.name}-mapGroup`] = this.mapGroup
      }
    })

    this.flag.layerDirtyArr = this.mapGroup.layers.map(() => true)
  }

  update(dt) {}
}
