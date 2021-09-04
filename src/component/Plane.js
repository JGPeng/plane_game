import { defineComponent, h, reactive, toRefs, watch } from '@vue/runtime-core'
import planeImg from '../assets/plane.png'

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

function useAttack(ctx, x, y) {
}