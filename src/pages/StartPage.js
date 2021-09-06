import { defineComponent, h } from '@vue/runtime-core'
import startPageImg from '../assets/startPage.png'
import startBtnImg from '../assets/bee.png'
import { PAGE } from './index'

export default defineComponent({
    setup(props, ctx) {
        const changePage = function () {
            ctx.emit('changePage', PAGE.game)
        }
        return {
            changePage
        }
    },
    render(ctx) {
        return h('Container', [
            h('Sprite', { texture: startPageImg }),
            h('Sprite', {
                texture: startBtnImg,
                x: 170,
                y: 200,
                interactive: true,
                onClick: ctx.changePage
            })
        ])
    }
})