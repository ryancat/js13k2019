import { createCastleHall } from '../maps/castle/createCastleHall';
import { Group, Sprite } from '../engine/engine';

const flag = {
  finished: false,
  initState: false,
}

let castleHallMapGroup;

export function castleHallGameStart(game, dt) {
  if (flag.finished) {
    return true;
  }

  // init or update incident
  if (!flag.initState) {
    initMapGroup(game);
    flag.initState = true;
  }
  else {
    update(game, dt);
  }

  // render layers
  flag.layerDirtyArr.forEach((isLayerDirty, layerIndex) => {
    if (isLayerDirty) {
      castleHallMapGroup.children[layerIndex].render();
    }
  });

  // flag.finished = true;
}

function initMapGroup(game) {
  const castleHallMap = createCastleHall({
    tileWidth: game.pixelWidth / game.width,
    tileHeight: game.pixelHeight / game.height
  });

  // init map group
  castleHallMapGroup = new Group({
    width: castleHallMap.width,
    height: castleHallMap.height,
    pixelWidth: game.pixelWidth,
    pixelHeight: game.pixelHeight,
    tileWidthScale: castleHallMap.tileWidthScale,
    tileHeightScale: castleHallMap.tileHeightScale,
    tileSpriteMap: castleHallMap.tileSpriteMap,
    objectSpriteMap: castleHallMap.objectSpriteMap,
    layers: castleHallMap.layers,
    renderer: game.layerMap['main'],
    type: 'map'
  });

  // init layers in map
  castleHallMapGroup.layers.forEach((layer) => {
    // for each layer, we need to create layer group to hold sprites
    const castleHallLayerGroup = new Group({
      width: castleHallMapGroup.width,
      height: castleHallMapGroup.height,
      pixelWidth: castleHallMapGroup.pixelWidth,
      pixelHeight: castleHallMapGroup.pixelHeight,
      type: 'layer'
    });

    const pixelWidth = castleHallLayerGroup.pixelWidth / castleHallLayerGroup.width;
    const pixelHeight = castleHallLayerGroup.pixelHeight / castleHallLayerGroup.height;

    switch (layer.type) {
      case 'tilelayer':
        // for tiled layer, we will draw them as is
        // create sprites for the current layer
        layer.data.forEach((tileId, tileIndex) => {
          castleHallLayerGroup.add(game.createSprite(castleHallMapGroup.tileSpriteMap[tileId], {
            x: (tileIndex % castleHallLayerGroup.width) * pixelWidth,
            y: Math.floor(tileIndex / castleHallLayerGroup.width) * pixelHeight,
            pixelWidth,
            pixelHeight
          }));
        });
        break;

      case 'objectgroup':
        // for object layer, we need to put object at given location
        layer.objects.forEach(gameObject => {
          castleHallLayerGroup.add(game.createSprite(castleHallMapGroup.objectSpriteMap[gameObject.id], {
            x: gameObject.x * castleHallMapGroup.tileWidthScale,
            y: gameObject.y * castleHallMapGroup.tileHeightScale,
            pixelWidth: gameObject.width * castleHallMapGroup.tileWidthScale,
            pixelHeight: gameObject.height * castleHallMapGroup.tileHeightScale,
            name: gameObject.name
          }));
        });
        break;
    }

    // add layer group to map group
    castleHallMapGroup.add(castleHallLayerGroup);

    // for debug
    if (IS_DEV_MODE) {
      window.castleHallMapGroup = castleHallMapGroup;
    }
  });

  flag.layerDirtyArr = castleHallMapGroup.layers.map(() => true);
}

function update(game, dt) {
  if (game.keyMap.up.isDown) {
    // up key is pressed
    const playerSprite = castleHallMapGroup.getSpriteByName('player')
    playerSprite.y -= 0.15 * dt;
  }

  if (game.keyMap.down.isDown) {
    // up key is pressed
    const playerSprite = castleHallMapGroup.getSpriteByName('player')
    playerSprite.y += 0.15 * dt;
  }

  if (game.keyMap.left.isDown) {
    // up key is pressed
    const playerSprite = castleHallMapGroup.getSpriteByName('player')
    playerSprite.x -= 0.15 * dt;
  }

  if (game.keyMap.right.isDown) {
    // up key is pressed
    const playerSprite = castleHallMapGroup.getSpriteByName('player')
    playerSprite.x += 0.15 * dt;
  }
}