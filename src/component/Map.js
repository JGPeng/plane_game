import { defineComponent, h, ref } from '@vue/runtime-core'
import mapImg from '../assets/gamePage.png'
import { game } from '../Game'

export default defineComponent({
    setup() {
        const viewHeight = 654
        let mapY1 = ref(0)
        let mapY2 = ref(-viewHeight)
        const speed = 5

        // pixi.js interval
        game.ticker.add(() => {
            mapY1.value += speed
            mapY2.value += speed
            if (mapY1.value >= viewHeight) {
                mapY1.value = -viewHeight
            }
            if (mapY2.value >= viewHeight) {
                mapY2.value = -viewHeight
            }
        })

        return {
            mapY1, mapY2
        }
    },
    render(ctx) {
        return h('Container', [
            h('Sprite', { texture: mapImg, y: ctx.mapY1 }),
            h('Sprite', { texture: mapImg, y: ctx.mapY2 })
        ])
    }
})