import { Quadtree } from './game/Quadtree.js';
import { Point } from './game/Point.js';

window.onload = () => {
  const canvas = document.querySelector('canvas')
  canvas.width  = 500
  canvas.height = 500

  const context = canvas.getContext('2d')
  const quadtree = new Quadtree(canvas.width, canvas.height, 1)
  const points = new Set()

  while (points.size < 2) {
    const x = Math.floor(Math.random() * canvas.width)
    const y = Math.floor(Math.random() * canvas.height)
    points.add(new Point(x, y))
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  for (const point of points) {
    context.beginPath()
    context.rect(point.x, point.y, 5, 5)
    context.fill()
    context.closePath()
  }

  quadtree.build(points)
  quadtree.root.debugRender(context)

  canvas.onmousedown = (event) => {
    points.add(new Point(event.offsetX, event.offsetY))
    quadtree.build(points)
    quadtree.root.debugRender(context)
    return
  }

  function loop() {

    for (const point of points) {
      context.beginPath()
      context.rect(point.x, point.y, 5, 5)
      context.fill()
      context.closePath()
    }

    requestAnimationFrame(loop)
  }

  loop()
}
