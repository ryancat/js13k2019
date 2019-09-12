// // renderer
// const [
//   RENDERER_KEY,
//   RENDERER_CONTAINER,
//   RENDERER_WIDTH,
//   RENDERER_HEIGHT,
//   RENDERER_CANVAS,
//   RENDERER_CONTEXT,
//   RENDERER_DOM
// ] = [0, 1, 2, 3, 4, 5]

function dom_renderer_factory(props = []) {
  const wrapper = document.createElement('div')
  const renderer = util_assignArr(
    ['', document.createElement('div'), 500, 500, null, null, wrapper],
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
    renderer[RENDERER_WIDTH],
    renderer[RENDERER_HEIGHT]
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
  const container = renderer[RENDERER_CONTAINER]
  wrapper.style.top = top
  wrapper.style.left = left
  wrapper.style.right = container.offsetWidth - (left + width)
  wrapper.style.bottom = container.offsetHeight - (top + height)
}

function dom_renderer_drawText(
  renderer,
  [
    text = 'PLACE_HOLDER',
    top = 0,
    left = 0,
    width = 500,
    height = 500,
    align = 'left',
    fontSize = 16,
    fontWeight = 400,
    color = PALETTE_GUNMETAL[4],
  ]
) {
  const wrapper = renderer[RENDERER_DOM]
  dom_renderer_setBounds(renderer, top, left, width, height)
  wrapper.innerText = text
  wrapper.style.fontSize = fontSize + 'px'
  wrapper.style.fontWeight = fontWeight
  wrapper.style.color = color
  wrapper.style.textAlign = align
}

function dom_renderer_clear(renderer) {
  const wrapper = renderer[RENDERER_DOM]
  wrapper.innerText = ''
}
