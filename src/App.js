/**
 * defineComponent
 *   返回 options 对象，即定义组件，组合式API
 * h，即 hyperscript
 *   h (tag, attrs, [text?, Elements?,...])
 *   返回一个“虚拟节点”(VNode)
 */
import { defineComponent, h, ref, computed } from '@vue/runtime-core'
import StartPage from './pages/StartPage'
import GamePage from './pages/GamePage'
import EndPage from './pages/EndPage'

export default defineComponent({
    setup() {
        let currentPageName = ref('StartPage')
        let currentPage = computed(() => {
            if (currentPageName.value === 'GamePage') {
                return GamePage
            } else if (currentPageName.value === 'StartPage') {
                return StartPage
            } else if (currentPageName.value === 'EndPage') {
                return EndPage
            }
        })
        return {
            currentPageName,
            currentPage
        }
    },
    render(ctx) {
        // const vnode = h('rect', { x: 100, y: 100 }, ['天生我材必有用', h(Circle)])
        // const vnode = h('rect', { x: 100, y: 100 }, '天生我材必有用')
        return h('Container', [
            h(ctx.currentPage, {
                onChangePage(page) {
                    ctx.currentPageName = page
                }
            })
        ])
    }
})