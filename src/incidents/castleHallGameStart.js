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

  if (!flag.initState) {
    initMapGroup(game);
    flag.initState = true;
  }

  flag.layerDirtyArr.forEach((isLayerDirty, layerIndex) => {
    if (isLayerDirty) {
      castleHallMapGroup.children[layerIndex].render();
    }
  });

  console.log('start castleHallGameStart', game, dt);

  flag.finished = true;
}

function initMapGroup(game) {
  const castleHallMap = createCastleHall();

  // init map group
  castleHallMapGroup = new Group({
    width: castleHallMap.width,
    height: castleHallMap.height,
    pixelWidth: game.pixelWidth,
    pixelHeight: game.pixelHeight,
    spriteMap: castleHallMap.spriteMap,
    layers: castleHallMap.layers,
    renderer: game.layerMap['main']
  });

  // init layers in map
  castleHallMapGroup.layers.forEach((layer) => {
    // for each layer, we need to create layer group to hold sprites
    const castleHallLayerGroup = new Group({
      width: castleHallMapGroup.width,
      height: castleHallMapGroup.height,
      pixelWidth: castleHallMapGroup.pixelWidth,
      pixelHeight: castleHallMapGroup.pixelHeight
    });

    switch (layer.type) {
      case 'tilelayer':
        // for tiled layer, we will draw them as is
        // create sprites for the current layer
        layer.data.forEach((tileId, tileIndex) => {
          const pixelWidth = castleHallLayerGroup.pixelWidth / castleHallLayerGroup.width;
          const pixelHeight = castleHallLayerGroup.pixelHeight / castleHallLayerGroup.height;

          castleHallLayerGroup.add(game.createSprite(castleHallMapGroup.spriteMap[tileId], {
            x: (tileIndex % castleHallLayerGroup.width) * pixelWidth,
            y: Math.floor(tileIndex / castleHallLayerGroup.width) * pixelHeight,
            pixelWidth,
            pixelHeight
          }));
        });
        break;

      case 'objectgroup':
        // for object layer, we need to put object at given location
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