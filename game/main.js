// Entry file
const game = game_create([
  document.getElementById('root')
])

game_loadSprites(game, sprites)
game_loadSounds(game, [])
game_addLayer(game, [
  game[GAME_CAMERA_WIDTH],
  game[GAME_CAMERA_HEIGHT],
  game_createRenderer([
    game[GAME_CONTAINER],
    game[GAME_CAMERA_WIDTH],
    game[GAME_CAMERA_HEIGHT],
  ])
])

// renderer
const [
  RENDERER_CONTAINER,
  RENDERER_KEY,
  RENDERER_CANVAS,
  RENDERER_CONTEXT
] = [0, 1, 2, 3]
