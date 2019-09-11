const [
  DIALOG_GAME,
  DIALOG_END_CALLBACKS,
  DIALOG_RENDERER,
  DIALOG_NEXTKEY_ID,
  DIALOG_NEXTKEY_ACTIVE,
  DIALOG_ACTIVE_CONTENT_INDEX,
  DIALOG_CONTENTS,
] = [0, 1, 2, 3, 4, 5, 6, 7]

const PADDING = 0.05
const RATIO_Y = 0.8
const CONTENT_START_RATIO_X = 0.2
const FONT_SIZE = 20

function dialog_factory(props = []) {
  const dialog = util_assignArr([null, [], null, -1, false, 0, []], props)

  loop_add(dialog_update.bind(null, dialog))
  return dialog
}

function dialog_start(dialog) {
  // pause game when dialog starts
  game_pause(dialog[DIALOG_GAME])
}

function dialog_update(dialog, dt) {
  let activeContent =
    dialog[DIALOG_CONTENTS][dialog[DIALOG_ACTIVE_CONTENT_INDEX]]

  if (typeof activeContent === 'string') {
    const dialogContentProp = []
    dialogContentProp[DIALOG_CONTENT_CONTENT] = activeContent
    activeContent = dialogContent_factory(dialogContentProp)
  }

  dialog_clear()

  const camera = dialog[DIALOG_GAME][GAME_CAMERA]
  const cameraWidth = camera[CAMERA_WIDTH]
  const cameraHeight = camera[CAMERA_HEIGHT]
  const game = dialog[DIALOG_GAME]

  // draw dialog box
  renderer_drawRect(dialog[DIALOG_RENDERER], [
    0,
    cameraHeight * 0.8,
    cameraWidth,
    Math.floor(cameraHeight * 0.2),
    0.95,
    true,
    false,
    PALETTE_BLUE[3],
  ])

  // draw dialog from character sprite
  sprite_render(
    // create sprite for dialog
    game[GAME_SPRITE_FACTORIES][activeContent[DIALOG_CONTENT_FROM_SPRITE_ID]]([
      ,
      Math.floor(camera[CAMERA_WIDTH] * 0.2),
      Math.floor(camera[CAMERA_HEIGHT] * 0.2),
      ,
      ,
      ,
      ,
      ,
      ,
    ]),
    dt,
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
    activeContent[DIALOG_CONTENT_CONTENT]()

    if (dialog[DIALOG_ACTIVE_CONTENT_INDEX] >= dialog[DIALOG_CONTENTS].length) {
      // reach the end of conversation
      dialog_end()
    }
  }
}

function dialog_clear(dialog) {
  renderer_clearRect(dialog[DIALOG_RENDERER])
}

function dialog_end(dialog) {
  dialog_clear(dialog)
  dialog[DIALOG_END_CALLBACKS].forEach(callback => callback())
  game_resume(dialog[DIALOG_GAME])
}
