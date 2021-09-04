import { defineComponent, h } from '@vue/runtime-core'
import endPageImg from '../assets/endPage.png'
import endBtnImg from '../assets/bee.png'

export default defineComponent({
    setup(props, ctx) {
        const changePage = function () {
            ctx.emit('changePage', 'GamePage')
        }
        return {
            changePage
        }
    },
    render(ctx) {
        return h('Container', [
            h('Sprite', { texture: endPageImg }),
            h('Sprite', {
                texture: endBtnImg,
                x: 170,
                y: 290,
                interactive: true,
                onClick: ctx.changePage
            })
        ])
    }
})