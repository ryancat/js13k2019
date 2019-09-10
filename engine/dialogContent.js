const [
  DIALOG_CONTENT_FROM_SPRITE_ID,
  DIALOG_CONTENT_CONTENT,
  DIALOG_CONTENT_CALLBACK,
  DIALOG_CONTENT_COLOR,
] = [0, 1, 2, 3]

function dialogContent_factory(props = []) {
  util_assignArr([-1, '', EMPTY_FN, PALETTE_GUNMETAL[4]], props)
}
