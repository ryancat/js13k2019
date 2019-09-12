// // renderer
// const [
//   RENDERER_KEY,
//   RENDERER_CONTAINER,
//   RENDERER_WIDTH,
//   RENDERER_HEIGHT,
//   RENDERER_CANVAS,
//   RENDERER_CONTEXT,
//   RENDERER_DOM,
//   RENDERER_DOM_WIDTH,
//   RENDERER_DOM_HEIGHT,
// ] = [0, 1, 2, 3, 4, 5, 6, 7, 8]

function dom_renderer_factory(props = []) {
  const wrapper = document.createElement('div')
  const renderer = util_assignArr(
    ['', document.createElement('div'), 500, 500, null, null, wrapper, 0, 0],
    props
  )

  // set style
  renderer[RENDERER_DOM].style.position = 'absolute'
  renderer[RENDERER_DOM].setAttribute('data-key', renderer[RENDERER_KEY])

  // append to container
  renderer[RENDERER_CONTAINER].appendChild(renderer[RENDERER_DOM])

  // init canvas size
  dom_renderer_setBounds(
    renderer,
    0,
    0,
    renderer[RENDERER_DOM_WIDTH],
    renderer[RENDERER_DOM_HEIGHT]
  )

  return renderer
}

function dom_renderer_setBounds(
  renderer,
  top = 0,
  left = 0,
  width = 500,
  height = 500
) {
  const wrapper = renderer[RENDERER_DOM]
  wrapper.style.top = Math.round(top) + 'px'
  wrapper.style.left = Math.round(left) + 'px'
  wrapper.style.right =
    Math.round(renderer[RENDERER_WIDTH] - (left + width)) + 'px'
  wrapper.style.bottom =
    Math.round(renderer[RENDERER_HEIGHT] - (top + height)) + 'px'
}

function dom_renderer_drawText(
  renderer,
  [
    text = 'PLACE_HOLDER',
    top = 0,
    left = 0,
    width = 500,
    height = 500,
    paddings = [0, 0],
    color = PALETTE_GUNMETAL[4],
    fontSize = 24,
    fontWeight = 400,
    fontFamily = 'fantasy sans-serif serif',
    align = 'left',
  ]
) {
  const wrapper = renderer[RENDERER_DOM]
  dom_renderer_setBounds(renderer, top, left, width, height)
  wrapper.innerText = text
  wrapper.style.fontSize = fontSize + 'px'
  wrapper.style.fontWeight = fontWeight
  wrapper.style.fontFamily = fontFamily
  wrapper.style.color = color
  wrapper.style.padding = paddings.map(padding => padding + 'px').join(' ')
  wrapper.style.textAlign = align
}

function dom_renderer_clear(renderer) {
  const wrapper = renderer[RENDERER_DOM]
  wrapper.innerText = ''
}
