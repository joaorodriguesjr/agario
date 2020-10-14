import { Vector } from './game/Vector.js'
import { Renderer } from './game/Renderer.js'
import { World } from './game/World.js'
import { Spawner } from './game/Spawner.js'
import { Input } from './game/Input.js'

window.onload = () => {
  const canvas = document.querySelector('canvas')
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight

  const world = new World(new Vector(5000, 5000))
  const spawner = new Spawner(world)
  const renderer = new Renderer(canvas)
  const player = spawner.spawnPlayer()
  const input = new Input(player.controller)

  const gameLoop = () => {
    spawner.spawnBots()
    spawner.spawnFood()
    world.update()
    renderer.render(world, player)

    requestAnimationFrame(gameLoop)
  }

  setInterval(() => {
    blobs.innerText = world.blobs.size
    players.innerText = world.players.size
  }, 1000)

  canvas.onmousemove = input.createMouseMoveListener(canvas)
  gameLoop()
}
