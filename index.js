import { Vector } from './game/Vector.js'
import { Renderer } from './game/Renderer.js'
import { World } from './game/World.js'
import { Spawner } from './game/Spawner.js'
import { Input } from './game/Input.js'

window.onload = () => {

  const config = {
    world: { width: 2500, height: 2500 },
    spawn: {
      players: 25, blobs: 75,
      player: { radius: 25 }, bot: { radius: 10 },
      blob: { radius: { min: 5, max: 10 } }
    },
  }

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
