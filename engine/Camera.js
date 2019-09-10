// const [
//   CAMERA_GAME,
//   CAMERA_X,
//   CAMERA_Y,
//   CAMERA_WIDTH,
//   CAMERA_HEIGHT,
//   CAMERA_FOLLOWING_SPRITE,
//   CAMERA_FOLLOWING_CALLBACK,
// ] = [0, 1, 2, 3, 4, 5, 6]

function camera_factory(props = []) {
  return util_assignArr([null, 0, 0, 640, 640, null, null], props)
}

function camera_follow(camera, sprite = []) {
  camera[CAMERA_FOLLOWING_SPRITE] = sprite

  if (camera[CAMERA_FOLLOWING_CALLBACK]) {
    loop_remove(camera[CAMERA_GAME][GAME_LOOP])
  }

  camera[CAMERA_FOLLOWING_CALLBACK] = camera_updateCameraByFollow.bind(
    null,
    camera
  )
  loop_add(camera[CAMERA_GAME][GAME_LOOP], camera[CAMERA_FOLLOWING_CALLBACK])

  camera_updateCameraByFollow(camera)
}

function camera_updateCameraByFollow(camera) {
  const leftMargin =
    (camera[CAMERA_WIDTH] - camera[CAMERA_FOLLOWING_SPRITE][SPRITE_WIDTH]) / 2
  const topMargin =
    (camera[CAMERA_HEIGHT] - camera[CAMERA_FOLLOWING_SPRITE][SPRITE_HEIGHT]) / 2

  camera[CAMERA_X] = camera[CAMERA_FOLLOWING_SPRITE][SPRITE_X] - leftMargin
  camera[CAMERA_Y] = camera[CAMERA_FOLLOWING_SPRITE][SPRITE_Y] - topMargin
}
