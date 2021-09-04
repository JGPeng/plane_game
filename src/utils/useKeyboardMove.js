import { ref, onMounted, onUnmounted } from '@vue/runtime-core'
import { game } from '../Game'

const commandType = {
    upAndDown: 'upAndDown',
    leftAndRight: 'leftAndRight'
}

// 监听方向键控制飞机移动 - 上下为一组、左右为一组
export const useKeyboardMove = ({ x = 0, y = 0, speed = 1 }) => {
    let moveX = ref(x)
    let moveY = ref(y)

    // 命令集
    const moveCommands = []

    // keycode对应的命令
    const upCommand = {
        type: commandType.upAndDown,
        dir: -1,
        id: 1
    }
    const downCommand = {
        type: commandType.upAndDown,
        dir: 1,
        id: 2
    }
    const leftCommand = {
        type: commandType.leftAndRight,
        dir: -1,
        id: 3
    }
    const rightCommand = {
        type: commandType.leftAndRight,
        dir: 1,
        id: 4
    }

    // 判断是否已加入命令集
    const isExistCommand = (command) => {
        const id = command.id
        const result = moveCommands.find((c) => c.id === id)
        if (result) return true
        return false
    }

    // 从命令集中移除命令
    const moveCommand = (command) => {
        const id = command.id
        const index = moveCommands.findIndex((c) => c.id === id)
        moveCommands.splice(index, 1)
    }

    // 将 keycode 映射到对应的命令
    const commandMap = {
        ArrowLeft: leftCommand,
        ArrowRight: rightCommand,
        ArrowUp: upCommand,
        ArrowDown: downCommand
    }

    // 返回命令集中首个控制上下键的命令
    const findUpAndDownCommand = () => moveCommands.find((command) => command.type === commandType.upAndDown)

    // 返回命令集中首个控制左右键的命令
    const findLeftAndRightCommand = () => moveCommands.find((command) => command.type === commandType.leftAndRight)

    // 定时器事件: 移动
    const handleTicker = () => {
        const upAndDownCommand = findUpAndDownCommand()
        const leftAndRightCommand = findLeftAndRightCommand()
        if (upAndDownCommand) {
            moveY.value += upAndDownCommand.dir * speed
        }
        if (leftAndRightCommand) {
            moveX.value += leftAndRightCommand.dir * speed
        }
    }

    // 监听按下按钮: 确认是否有效且未收入命令集中 -> 加入命令集头部
    const handleKeyDown = (e) => {
        const command = commandMap[e.code]
        if (command && !isExistCommand(command)) {
            moveCommands.unshift(command)
        }
    }

    // 监听弹出按钮: 确认是否有效 -> 从命令集中移除
    const handleKeyUp = (e) => {
        const command = commandMap[e.code]
        if (command) {
            moveCommand(command)
        }
    }

    // 完成挂载后: 设置定时器、监听方向键
    onMounted(() => {
        game.ticker.add(handleTicker)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
    })

    // 卸载后进行移除
    onUnmounted(() => {
        game.ticker.remove(handleTicker)
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
    })

    return {
        x: moveX,
        y: moveY
    }
}