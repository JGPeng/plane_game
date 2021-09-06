import { defineComponent, h, reactive, toRefs, watch, onMounted, onUnmounted } from '@vue/runtime-core'
import planeImg from '../assets/plane.png'
import { game } from '../Game'

export const PlaneInfo = {
    width: 97,
    height: 124
}

export default defineComponent({
    props: ['x', 'y'],
    setup(props, ctx) {
        // 方案一
        let point = reactive({ x: props.x, y: props.y })
        watch(props, (value) => {
            point.x = value.x
            point.y = value.y
        })

        // 方案二
        // let { x, y } = toRefs(props)

        useAttack(ctx, point)

        return {
            // x, y
            ...toRefs(point)
        }
    },
    render(ctx) {
        return h('Container', [
            h('Sprite', { texture: planeImg, x: ctx.x, y: ctx.y })
        ])
    }
})

// 发射子弹
const useAttack = (ctx, point) => {
    /**
     * 飞机发射子弹
     *   @attack: 是否发射子弹
     *   @ATTACK_INTERVAL: 攻击间隔
     *   @count: 计数变量
     */
    let attack = false
    const ATTACK_INTERVAL = 5
    let count = 0
    // 按下空格后开始发射子弹
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            attack = true
            count = 100
        }
    })
    // 释放空格则停止发射子弹
    window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            attack = false
        }
    })
    // 每累加到一定数添加一子弹
    const handleTicker = () => {
        if (attack) {
            count++
            if (count > ATTACK_INTERVAL) {
                ctx.emit('attack', { x: point.x + PlaneInfo.width / 2, y: point.y })
                count = 0
            }
        }
    }
    onMounted(() => {
        // 定时器 - 检测是否发射子弹
        game.ticker.add(handleTicker)
    })
    onUnmounted(() => {
        game.ticker.remove(handleTicker)
    })
}