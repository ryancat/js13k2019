export class Sprite {
  constructor({
    id = -1,
    width = 1,
    height = 1,
    parent,
    currentFilmIndex = 0,
    fps = 0,
    render = () => {},
    update = () => {},
  }) {
    Object.assign(this, {
      id,
      width,
      height,
      parent,
      fps,
      currentFilmIndex,
      render,
      update,
    })
  }
}
