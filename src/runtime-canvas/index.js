import { createRenderer } from '@vue/runtime-core'
import { Container, Sprite, Graphics, Text, Texture } from 'pixi.js'

const renderer = createRenderer({
    createElement(type) {
        // console.log(1, 'createElement')
        let element
        switch (type) {
            case 'Container':
                element = new Container()
                break
            case 'Sprite':
                element = new Sprite()
                break
        }
        return element
    },
    setElementText(node, text) {
        node.addChild(new Text(text))
    },
    patchProp(el, key, preValue, nextValue) {
        // console.log(2, 'patchProp')
        switch (key) {
            case 'texture':
                el.texture = Texture.from(nextValue)
                break
            case 'onClick':
                el.on('pointertap', nextValue)
                break
            default:
                el[key] = nextValue
        }
    },
    insert(el, parent) {
        // console.log(3, 'insert')
        parent.addChild(el)
    },
    createText(text) {
        return new Text(text)
    },
    createComment() { },
    parentNode() { },
    nextSibling() { },
    remove(el) {
        const parent = el.parent
        if (parent) {
            parent.removeChild(el)
        }

    }
})

export function createApp(rootComponent) {
    return renderer.createApp(rootComponent)
}