// const [
//   GROUP_TYPE,
//   GROUP_COL_NUM,
//   GROUP_ROW_NUM,
//   GROUP_WIDTH,
//   GROUP_HEIGHT,
//   GROUP_CHILDREN,
//   GROUP_LAYER_GROUP,
//   GROUP_MAP_GROUP,
//   GROUP_RENDERER,
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function group_factory(props = []) {
  return util_assignArr(['', 32, 32, 0, 0, [], [], [], []], props)
}

function group_addLayerGroup(group, layerGroup) {
  const layerGroups = group[GROUP_LAYER_GROUP]
  if (layerGroups.indexOf(layerGroup) === -1) {
    layerGroups.push(layerGroup)
  }
}

function group_addSprite(group, sprite = []) {
  const children = group[GROUP_CHILDREN]
  if (children.indexOf(sprite) === -1) {
    children.push(sprite)
  }
}

function group_clear(group, dt) {
  renderer_clearRect(group[GROUP_RENDERER])
}

function group_render(group, dt) {
  // TODO: only support one level group here
  group[GROUP_CHILDREN].forEach(child =>
    sprite_render(child, dt, group[GROUP_RENDERER])
  )
}

function group_update(group, dt) {
  // TODO: only support one level group here
  group[GROUP_CHILDREN].forEach(child => sprite_update(child, dt))
}

function group_getSpriteById(group, spriteId) {
  const children = group[GROUP_CHILDREN]
  for (let i = 0; i < children.length; i++) {
    let sprite = children[i]
    if (sprite[SPRITE_ID] === spriteId) {
      return sprite
    }
  }

  return null
}

function group_getSpriteById(group, spriteId) {
  const children = group[GROUP_CHILDREN]
  const sprites = []
  for (let i = 0; i < children.length; i++) {
    let sprite = children[i]
    if (sprite[SPRITE_ID] === spriteId) {
      sprites.push(sprite)
    }
  }

  return sprites
}
