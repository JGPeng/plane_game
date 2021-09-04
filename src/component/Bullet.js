import { defineComponent, h, ref, watch } from '@vue/runtime-core'
import myselfBulletImg from '../assets/bullet.png'
import enemyBulletImg from '../assets/bullet.png'

export const SelfBulletInfo = {
    width: 8,
    height: 14,
    dir: -1,
    speed: 5
}

export const EnemyBulletInfo = {
    width: 8,
    height: 14,
    dir: 1,
    speed: 2
}

export default defineComponent({
    props: ['x', 'y', 'id', 'dir'],
    setup(props, ctx) {
        let x = ref(props.x)
        let y = ref(props.y)

        watch(props, (newProps) => {
            x.value = newProps.x
            y.value = newProps.y
        })

        return {
            x,
            y,
            dir: props.dir
        }
    },
    render(ctx) {
        return h('Sprite', {
            x: ctx.x,
            y: ctx.y,
            texture: ctx.dir === 1 ? enemyBulletImg : myselfBulletImg,
        })
    }
})