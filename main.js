import Phaser from 'phaser'
import Game from './src/game'

let width = 1600
let height = 900

const config = {
  width: 320,
  height: 240,
  type: Phaser.WEBGL,
  fps: {
    forceSetTimeOut: true,
    // panicMax: 0,
    // smoothStep: false,
    target: 60
  },
  physics: {
    default:'arcade',
    arcade: {
      gravity: { y: 100 },
      debug: true
    }
  },
  scale: {
    parent: 'game',
    autoCentre:Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
}

const game = new Phaser.Game(config)

game.scene.add('game', Game)

game.scene.start('game')