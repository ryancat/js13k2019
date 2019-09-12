// // renderer
// const [
//   RENDERER_KEY,
//   RENDERER_CONTAINER,
//   RENDERER_WIDTH,
//   RENDERER_HEIGHT,
//   RENDERER_CANVAS,
//   RENDERER_CONTEXT,
//   RENDERER_DOM,
// ] = [0, 1, 2, 3, 4, 5, 6]

function renderer_factory(props = []) {
  const canvas = document.createElement('canvas')
  const renderer = util_assignArr(
    [
      '',
      document.createElement('div'),
      500,
      500,
      canvas,
      canvas.getContext('2d'),
    ],
    props
  )

  // set style
  renderer[RENDERER_CANVAS].style.position = 'absolute'
  renderer[RENDERER_CANVAS].setAttribute('data-key', renderer[RENDERER_KEY])

  // append to container
  renderer[RENDERER_CONTAINER].appendChild(renderer[RENDERER_CANVAS])

  // init canvas size
  renderer_setSize(
    renderer,
    renderer[RENDERER_WIDTH],
    renderer[RENDERER_HEIGHT]
  )

  return renderer
}

function renderer_setSize(renderer, width = 500, height = 500) {
  const canvas = renderer[RENDERER_CANVAS]
  if (canvas.offsetWidth !== width || canvas.offsetHeight !== height) {
    canvas.style.offsetWidth = width + 'px'
    canvas.style.offsetHeight = height + 'px'
  }

  canvas.width = width
  canvas.height = height
}

function renderer_drawRect(renderer, drawProps = []) {
  const [
    x = 0,
    y = 0,
    width = renderer[RENDERER_WIDTH],
    height = renderer[RENDERER_HEIGHT],
    opacity = 1,
    shouldFill = true,
    shouldStroke = false,
    backgroundColor = 'red',
    borderColor = 'black',
  ] = drawProps

  const context = renderer[RENDERER_CONTEXT]
  context.save()
  context.globalAlpha = opacity
  context.fillStyle = backgroundColor
  context.strokeStyle = borderColor

  // Draw rect path
  context.beginPath()
  context.rect(x, y, width, height)

  if (shouldFill) {
    context.fill()
  }

  if (shouldStroke) {
    context.stroke()
  }

  context.restore()
}

function renderer_drawText(renderer, drawProps = []) {
  const [
    x = 0,
    y = 0,
    align = 'left',
    baseline = 'alphabetic',
    text = 'PLACE_HOLDER',
    fontSize = '16',
    color = 'black',
  ] = drawProps

  const context = renderer[RENDERER_CONTEXT]
  context.save()
  context.font = `${fontSize}px serif`
  context.fillStyle = color
  context.textAlign = align
  context.textBaseline = baseline
  context.fillText(text, x, y)

  context.restore()
}

function renderer_clearRect(renderer, drawProps = []) {
  const [
    x = 0,
    y = 0,
    width = renderer[RENDERER_WIDTH],
    height = renderer[RENDERER_HEIGHT],
  ] = drawProps
  renderer[RENDERER_CONTEXT].clearRect(x, y, width, height)
}
