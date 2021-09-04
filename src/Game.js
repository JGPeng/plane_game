// 导入 Canvas 库
// Application: 创建渲染器、根容器
import { Application } from 'pixi.js'
import {stage} from './config'

export const game = new Application({
    width: stage.width,
    height: stage.height
})

document.body.append(game.view)
document.body.style.background = "#343434"
document.body.style.textAlign = "center"

export function getRootContainer() {
    return game.stage
}