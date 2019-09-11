// const [
//   LOOP_FPS,
//   LOOP_IS_PAUSED,
//   LOOP_TIMEOUT_ID,
//   LOOP_CALLBACKS,
//   LOOP_LAST_RUN
// ] = [0, 1, 2, 3, 4]

function loop_factory(props = []) {
  const loop = util_assignArr([60, true, null, [], Date.now()], props)
  loop_run(loop)
  loop[LOOP_LAST_RUN] = Date.now()

  return loop
}

function loop_add(loop, ...callbacks) {
  const loopCallbacks = loop[LOOP_CALLBACKS]
  callbacks.forEach(callback => {
    if (loopCallbacks.indexOf(callback) === -1) {
      loopCallbacks.push(callback)
    }
  })
}

function loop_remove(loop, callback) {
  const loopCallbacks = loop[LOOP_CALLBACKS]
  const index = loopCallbacks.indexOf(callback)
  if (index >= 0) {
    loopCallbacks.splice(index, 1)
  }
}

function loop_removeAll(loop) {
  loop[LOOP_CALLBACKS] = []
}

function loop_run(loop) {
  loop[LOOP_TIMEOUT_ID] = requestAnimationFrame(loop_run.bind(null, loop))

  const now = Date.now()
  const lastRun = loop[LOOP_LAST_RUN]
  loop[LOOP_LAST_RUN] = now

  if (loop[LOOP_IS_PAUSED]) {
    return
  }

  const dt = now - lastRun
  if (dt >= 1000 / loop[LOOP_FPS]) {
    // We need to check game fps to decide if we should run registered callbacks
    loop[LOOP_CALLBACKS].forEach(callback => callback(dt))
  }
}

function loop_start(loop) {
  loop[LOOP_IS_PAUSED] = false
}

function loop_stop(loop) {
  loop[LOOP_IS_PAUSED] = false
}

function destroy(loop) {
  loop[LOOP_CALLBACKS] = []
  cancelAnimationFrame(loop[LOOP_TIMEOUT_ID])
}
