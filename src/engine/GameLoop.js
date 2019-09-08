const DEFAULT_FPS = 60

export class GameLoop {
  constructor(options = {}) {
    Object.assign(
      this,
      {
        fps: DEFAULT_FPS,
        callbacks: [],
        isPaused: true,
        timeoutId: null,
      },
      options
    )

    this.run()
    this.lastRun = Date.now()
  }

  add(...callbacks) {
    callbacks.forEach(callback => {
      if (this.callbacks.indexOf(callback) === -1) {
        this.callbacks.push(callback)
      }
    })
  }

  remove(callback) {
    const index = this.callbacks.indexOf(callback)
    if (index >= 0) {
      this.callbacks.splice(index, 1)
    }
  }

  removeAll() {
    this.callbacks = []
  }

  run() {
    this.timeoutId = window.requestAnimationFrame(this.run.bind(this))

    const now = Date.now()
    const lastRun = this.lastRun
    this.lastRun = now

    if (this.isPaused) {
      return
    }

    const dt = now - lastRun
    if (dt >= 1000 / this.fps) {
      // We need to check game fps to decide if we should run registered callbacks
      this.callbacks.forEach(callback => callback(dt))
    }
  }

  start() {
    this.isPaused = false
  }

  stop() {
    this.isPaused = true
    this.lastRun = null
  }

  destroy() {
    this.callbacks = []
    window.cancelAnimationFrame(this.timeoutId)
  }
}
