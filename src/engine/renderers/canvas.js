import { palette } from '../../utils/colors'

const DEFAULT_RENDERER_WIDTH = 500;
const DEFAULT_RENDERER_HEIGHT = 500;
const DEFAULT_DRAW_WIDTH = 20;
const DEFAULT_DRAW_HEIGHT = 20;
const DEFAULT_DRAW_BACKGROUND_COLOR = palette.red[2];

export class CanvasRenderer {
  constructor(options = {}) {
    const {
      width = DEFAULT_RENDERER_WIDTH,
      height = DEFAULT_RENDERER_HEIGHT,
      container = document.createElement('div'),
      key = 'canvasLayer'
    } = options;

    this.container = container;
    this.key = key;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    
    // Set canvas style
    this._canvas.style.position = 'absolute';
    this._canvas.setAttribute('data-key', this.key);
    this.container.appendChild(this._canvas);

    // Init the canvas size
    this.setSize(width, height);
  }

  setSize(width = 300, height = 150) {
    if (this._canvas.offsetWidth !== width || this._canvas.offsetHeight !== height) {
      this._canvas.style.offsetWidth = width + 'px'
      this._canvas.style.offsetHeight = height + 'px'
    }
    
    this._canvas.width = width
    this._canvas.height = height
  }

  drawRect(options = {}) {
    const {
      x = 0,
      y = 0,
      pixelWidth = DEFAULT_DRAW_WIDTH,
      pixelHeight = DEFAULT_DRAW_HEIGHT,
      backgroundColor = DEFAULT_DRAW_BACKGROUND_COLOR
    } = options;

    this._ctx.save();
    this._ctx.fillStyle = backgroundColor;
    this._ctx.fillRect(x, y, pixelWidth, pixelHeight);
    this._ctx.restore();
  }
}