/**
 * defineComponent
 *   返回 options 对象，即定义组件，组合式API
 * h，即 hyperscript
 *   h (tag, attrs, [text?, Elements?,...])
 *   返回一个“虚拟节点”(VNode)
 */
import { defineComponent, h, ref, computed } from '@vue/runtime-core'
import { PAGE, getPageComponent } from "./pages";

export default defineComponent({
    setup() {
        const currentPageName = ref(PAGE.start)
        const currentPage = computed(() => {
            return getPageComponent(currentPageName.value)
        })
        const handleChangePage = (page) => {
            currentPageName.value = page
        }

        return {
            currentPage,
            handleChangePage
        }
    },
    render(ctx) {
        // const vnode = h('rect', { x: 100, y: 100 }, ['天生我材必有用', h(Circle)])
        // const vnode = h('rect', { x: 100, y: 100 }, '天生我材必有用')
        return h('Container', [
            h(ctx.currentPage, {
                onChangePage: ctx.handleChangePage
            })
        ])
    }
})