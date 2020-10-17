import { Vector } from './game/Vector.js'
import { Renderer } from './game/Renderer.js'
import { World } from './game/World.js'
import { Spawner } from './game/Spawner.js'
import { Input } from './game/Input.js'

window.config = {
  world: { width: 7500, height: 5000 },
  spawn: {
    players: 50, blobs: 500,
    player: { radius: 25 }, bot: { radius: 10 },
    blob: { radius: { min: 0.5, max: 12.5 } }
  },
}

window.onload = () => {
  const canvas = document.querySelector('canvas')
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight

  const spawner = new Spawner(config)
  const world = new World(config, spawner)
  const renderer = new Renderer(canvas)
  const player = spawner.spawnPlayer(world)
  const input = new Input(player)

  canvas.onmousemove = input.createMouseMoveListener(canvas)

  function gameLoop() {
    world.update()
    renderer.render(world, player)
    requestAnimationFrame(gameLoop)
  }

  gameLoop()
}
