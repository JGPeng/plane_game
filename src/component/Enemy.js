import { defineComponent, h, onMounted, onUnmounted, toRefs } from '@vue/runtime-core'
import enemyImg from '../assets/bee.png'

export const EnemyInfo = {
    // width: 60,
    width: 100,
    height: 50,
    life: 3
}

export default defineComponent({
    props: ['x', 'y'],
    setup(props, ctx) {
        let { x, y } = toRefs(props)

        useAttack(ctx, x, y)

        return {
            x,
            y
        }
    },
    render(ctx) {
        return h('Sprite', {
            x: ctx.x,
            y: ctx.y,
            texture: enemyImg
        })
    }
})

// 发射子弹
const useAttack = (ctx, x, y) => {
    const attackInterval = 2000
    let intervalId
    onMounted(() => {
        intervalId = setInterval(() => {
            ctx.emit('attack', {
                x: x.value + EnemyInfo.width / 2,
                y: y.value + EnemyInfo.height
            })
        }, attackInterval)
    })
    onUnmounted(() => {
        clearInterval(intervalId)
    })
}