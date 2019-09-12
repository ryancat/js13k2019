function dialog_factory(props = []) {
  const dialog = util_assignArr(
    [[], null, [], null, -1, false, 0, EMPTY_FN],
    props
  )
  dialog[DIALOG_UPDATE_LOOP_CALLBACK] = dialog_update.bind(null, dialog)
  loop_add(dialog[DIALOG_GAME][GAME_LOOP], dialog[DIALOG_UPDATE_LOOP_CALLBACK])
  return dialog
}

function dialog_start(dialog, autoHide) {
  if (autoHide) {
    // automatically hide dialog after 1.5 seconds
    setTimeout(() => {
      dialog_end(dialog)
    }, 1500)
  } else {
    // pause game when dialog starts
    game_pause(dialog[DIALOG_GAME])
  }
}

function dialog_update(dialog, dt) {
  let activeContent =
    dialog[DIALOG_CONTENTS][dialog[DIALOG_ACTIVE_CONTENT_INDEX]]

  if (typeof activeContent === 'string') {
    const dialogContentProp = []
    dialogContentProp[DIALOG_CONTENT_CONTENT] = activeContent
    activeContent = dialogContent_factory(dialogContentProp)
  }

  dialog_clear(dialog)

  const camera = dialog[DIALOG_GAME][GAME_CAMERA]
  const cameraWidth = camera[CAMERA_WIDTH]
  const cameraHeight = camera[CAMERA_HEIGHT]
  const game = dialog[DIALOG_GAME]
  const gameObjectWidths = game[GAME_OBJECT_WIDTHS]
  const gameObjectHeights = game[GAME_OBJECT_HEIGHTS]

  // draw dialog box
  renderer_drawRect(dialog[DIALOG_RENDERER], [
    0,
    cameraHeight * 0.8,
    cameraWidth,
    cameraHeight * 0.2,
    0.95,
    true,
    false,
    PALETTE_BLUE[3],
  ])

  // draw dialog from character sprite
  sprite_render(
    // create sprite for dialog
    // SPRITE_ID,
    //   SPRITE_X,
    //   SPRITE_Y,
    //   SPRITE_WIDTH,
    //   SPRITE_HEIGHT,
    //   SPRITE_NAME,
    //   SPRITE_HITTYPE,
    //   SPRITE_SHOW_NAME,
    //   SPRITE_DISABLE_HIT,
    //   SPRITE_BACKGROUND_COLOR,
    //   SPRITE_BORDER_COLOR,
    //   SPRITE_OPACITY,
    //   SPRITE_TILE_INDEX,
    //   SPRITE_COL,
    //   SPRITE_ROW,
    //   SPRITE_VX,
    //   SPRITE_VY,
    //   SPRITE_VMAX,
    //   SPRITE_TYPE,
    //   SPRITE_MAP_GROUP,
    //   SPRITE_HIT_CALLBACK,
    //   SPRITE_CONVERSATION_STATES
    game_getSpriteFactory(game, activeContent[DIALOG_CONTENT_FROM_SPRITE_ID])([
      activeContent[DIALOG_CONTENT_FROM_SPRITE_ID],
      camera[CAMERA_X] + gameObjectWidths[GAME_OBJ_WIDTH_XS],
      camera[CAMERA_Y] +
        cameraHeight * 0.8 -
        gameObjectHeights[GAME_OBJ_HEIGHT_XS],
      camera[CAMERA_WIDTH] * 0.2,
      camera[CAMERA_HEIGHT] * 0.2 - gameObjectHeights[GAME_OBJ_HEIGHT_XS],
    ]),
    dt,
    game[GAME_CAMERA],
    dialog[DIALOG_RENDERER]
  )

  // draw text content
  // todo: use DOM text

  // handle keystroke states
  const keyInteraction = game[GAME_KEY_INTERACTIONS][dialog[DIALOG_NEXTKEY_ID]]
  if (keyInteraction[INTERACTION_IS_DOWN]) {
    dialog[DIALOG_NEXTKEY_ACTIVE] = true
  } else if (dialog[DIALOG_NEXTKEY_ACTIVE]) {
    dialog[DIALOG_NEXTKEY_ACTIVE] = false
    dialog[DIALOG_ACTIVE_CONTENT_INDEX]++
    activeContent[DIALOG_CONTENT_CALLBACK]()

    if (dialog[DIALOG_ACTIVE_CONTENT_INDEX] >= dialog[DIALOG_CONTENTS].length) {
      // reach the end of conversation
      dialog_end(dialog)
    }
  }
}

function dialog_clear(dialog) {
  renderer_clearRect(dialog[DIALOG_RENDERER])
}

function dialog_end(dialog) {
  dialog_clear(dialog)
  dialog[DIALOG_END_CALLBACKS].forEach(callback => callback())
  loop_remove(
    dialog[DIALOG_GAME][GAME_LOOP],
    dialog[DIALOG_UPDATE_LOOP_CALLBACK]
  )
  game_resume(dialog[DIALOG_GAME])
}
