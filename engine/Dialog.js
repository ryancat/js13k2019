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

  // if (typeof activeContent === 'string') {
  //   const dialogContentProp = []
  //   dialogContentProp[DIALOG_CONTENT_CONTENT] = activeContent
  //   activeContent = dialogContent_factory(dialogContentProp)
  // }

  dialog_clear(dialog)

  const camera = dialog[DIALOG_GAME][GAME_CAMERA]
  const cameraWidth = camera[CAMERA_WIDTH]
  const cameraHeight = camera[CAMERA_HEIGHT]
  const game = dialog[DIALOG_GAME]
  const gameObjectWidths = game[GAME_OBJECT_WIDTHS]
  const gameObjectHeights = game[GAME_OBJECT_HEIGHTS]
  const dialogX = 0
  const dialogY = cameraHeight * 0.8
  const dialogWidth = cameraWidth
  const dialogHeight = cameraHeight * 0.2

  // draw dialog box
  renderer_drawRect(dialog[DIALOG_RENDERER], [
    dialogX,
    dialogY,
    dialogWidth,
    dialogHeight,
    0.95,
    true,
    false,
    PALETTE_BLUE[3],
  ])

  // draw dialog from character sprite
  const dialogSpriteProps = [
    activeContent[DIALOG_CONTENT_SPRITE][SPRITE_ID],
    camera[CAMERA_X] + dialogX + gameObjectWidths[GAME_OBJ_WIDTH_S],
    camera[CAMERA_Y] + dialogY - gameObjectHeights[GAME_OBJ_HEIGHT_S],
    dialogWidth * 0.2,
    dialogHeight - gameObjectHeights[GAME_OBJ_HEIGHT_XS],
  ]
  dialogSpriteProps[SPRITE_NAME] =
    activeContent[DIALOG_CONTENT_SPRITE][SPRITE_NAME]
  sprite_render(
    // create sprite for dialog
    game_getSpriteFactory(
      game,
      activeContent[DIALOG_CONTENT_SPRITE][SPRITE_ID]
    )(dialogSpriteProps),
    dt,
    game[GAME_CAMERA],
    dialog[DIALOG_RENDERER]
  )

  // draw text content
  dom_renderer_drawText(game[GAME_LAYERS][RENDERER_LAYER_TEXT], [
    activeContent[DIALOG_CONTENT_CONTENT],
    dialogY,
    dialogX + dialogWidth * 0.3,
    dialogWidth - (dialogX + dialogWidth * 0.3),
    dialogHeight,
    [gameObjectWidths[GAME_OBJ_WIDTH_S], gameObjectWidths[GAME_OBJ_WIDTH_S]],
    activeContent[DIALOG_CONTENT_COLOR],
  ])

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
  dom_renderer_clear(game[GAME_LAYERS][RENDERER_LAYER_TEXT])
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
