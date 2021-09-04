import { defineComponent, h, reactive, onMounted, onUnmounted } from '@vue/runtime-core'
import Map from '../component/Map'
import Plane, { PlaneInfo } from '../component/Plane'
import Enemy, { EnemyInfo } from '../component/Enemy'
import Bullet, { SelfBulletInfo, EnemyBulletInfo } from '../component/Bullet'
import { game } from '../Game'
import { hitTest, getRandomNumber } from '../utils'
import { stage } from '../config'
import { useKeyboardMove } from '../utils/useKeyboardMove'

// 记录子弹id
let hashCode = 0
const createHashCode = () => {
    return hashCode++
}

// 我方飞机信息
const useCreatePlane = ({ x, y, speed }) => {
    const planeInfo = reactive({
        x,
        y,
        speed,
        width: PlaneInfo.width,
        height: PlaneInfo.height
    })

    // 监听按键,触发飞机位移
    // window.addEventListener('keydown', (e) => {
    //     switch (e.code) {
    //         case 'ArrowUp':
    //             if (planeInfo.y > 0) {
    //                 planeInfo.y -= speed
    //             }
    //             break;
    //         case 'ArrowDown':
    //             if (planeInfo.y < height - planeInfo.height) {
    //                 planeInfo.y += speed
    //             }
    //             break;
    //         case 'ArrowLeft':
    //             if (planeInfo.x > 0) {
    //                 planeInfo.x -= speed
    //             }
    //             break;
    //         case 'ArrowRight':
    //             if (planeInfo.x < width - planeInfo.width) {
    //                 planeInfo.x += speed
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // })
    return planeInfo
}

// 敌方信息
const useCreateEnemy = () => {
    const enemyInfos = reactive([])
    const createEnemy = () => {
        enemyInfos.push(reactive({
            x: getRandomNumber(0, 400 - 60),
            y: getRandomNumber(-200, 0),
            width: EnemyInfo.width,
            height: EnemyInfo.height,
            maxHeight: getRandomNumber(100, stage.height / 2),
            xSpeed: getRandomNumber(1, 5),
            ySpeed: getRandomNumber(1, 5),
            life: EnemyInfo.life
        }))
    }
    createEnemy()
    setInterval(createEnemy, 1000)
    return enemyInfos
}

// 我方子弹
const useSelfBullet = () => {
    // 子弹数据
    const selfBullets = reactive([])

    // 创建子弹
    const createSelfBullet = (x, y) => {
        const id = createHashCode();
        const width = SelfBulletInfo.width;
        const height = SelfBulletInfo.height;
        const dir = SelfBulletInfo.dir;
        selfBullets.push({ x, y, id, width, height, dir })
    }

    // 销毁子弹
    const destroySelfBullet = (id) => {
        const index = selfBullets.find((info) => info.id === id)
        if (index !== -1) {
            selfBullets.splice(index, 1)
        }
    }

    return {
        selfBullets,
        createSelfBullet,
        destroySelfBullet
    }
}

// 敌方子弹
const useEnemyBullet = () => {
    const enemyBullets = reactive([])

    const createEnemyBullet = (x, y) => {
        const id = createHashCode();
        const width = SelfBulletInfo.width;
        const height = SelfBulletInfo.height;
        const dir = SelfBulletInfo.dir;
        enemyBullets.push({ x, y, id, width, height, dir })
    }

    return {
        enemyBullets,
        createEnemyBullet
    }
}

// 战斗逻辑
const useFighting = (planeInfo, enemyInfos, selfBullets, enemyBullets, emit) => {
    // 定时器
    const handleTicker = () => {
        // 移动敌方、碰撞检测
        enemyInfos.forEach((enemyInfo) => {
            // 敌方位移
            if (enemyInfo.x >= stage.width - enemyInfo.width || enemyInfo.x <= 0) {
                enemyInfo.xSpeed = -enemyInfo.xSpeed
            }
            if (enemyInfo.y < enemyInfo.maxHeight) {
                enemyInfo.y += enemyInfo.ySpeed
            }
            enemyInfo.x += enemyInfo.xSpeed
            // 碰撞检测并退出游戏
            if (hitTest(enemyInfo, planeInfo)) {
                // stop和destory有什么区别？
                // game.ticker.stop()
                // game.ticker.destroy()
                console.log('hit，游戏结束')
                emit('changePage', 'EndPage')
            }
        })
        // 我方子弹移动,子弹边界检测,子弹与敌方碰撞检测
        for (let i = 0; i < selfBullets.length; i++) {
            selfBullets[i].y += SelfBulletInfo.dir * SelfBulletInfo.speed
            // 到达上边界 - 子弹消失
            if (selfBullets[i].y <= 0) {
                selfBullets.splice(i, 1)
                i--
            } else {
                // 接触敌方 - 敌方扣血,子弹消失
                const index = enemyInfos.findIndex((enemy) => hitTest(enemy, selfBullets[i]))
                if (index !== -1) {
                    enemyInfos[index].life--
                    if (enemyInfos[index].life <= 0) {
                        enemyInfos.splice(index, 1)
                    }
                    selfBullets.splice(i, 1)
                    i--
                }
            }
        }
        // 敌方子弹移动,子弹边界检测,子弹与我方飞机碰撞检测
        for (let i = 0; i < enemyBullets.length; i++) {
            enemyBullets[i].y += EnemyBulletInfo.dir * EnemyBulletInfo.speed
            // 到达下边界 - 子弹消失
            if (enemyBullets[i].y >= stage.height) {
                enemyBullets.splice(i, 1)
                i--
            } else if (hitTest(planeInfo, enemyBullets[i])) {
                // 接触我方飞机 - 结束游戏
                emit('changePage', 'EndPage')
            } else {
                // 敌方子弹和我方子弹的碰撞检测
                const index = selfBullets.findIndex((bullet) => hitTest(bullet, enemyBullets[i]))
                if (index !== -1) {
                    selfBullets.splice(index, 1)
                    enemyBullets.splice(i, 1)
                    i--
                }
            }
        }
    }

    // 实例被挂载后启动定时器
    onMounted(() => {
        game.ticker.add(handleTicker)
    })

    // 组件卸载时移除定时器
    onUnmounted(() => {
        game.ticker.remove(handleTicker)
    })
}

export default defineComponent({
    setup(props, { emit }) {
        const planeInfo = useCreatePlane({ x: (stage.width / 2 - PlaneInfo.width / 2), y: (stage.height - PlaneInfo.height), speed: 5 })
        const enemyInfos = useCreateEnemy()
        const { selfBullets, createSelfBullet, destroySelfBullet } = useSelfBullet()
        const { enemyBullets, createEnemyBullet } = useEnemyBullet()

        // 飞机移动
        const info = useKeyboardMove({
            x: planeInfo.x,
            y: planeInfo.y,
            speed: planeInfo.speed
        })
        planeInfo.x = info.x
        planeInfo.y = info.y

        // 飞机发射
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
                    createSelfBullet(planeInfo.x + planeInfo.width / 2 - 3, planeInfo.y)
                    count = 0
                }
            }
        }
        // 定时器 - 检测是否发射子弹
        game.ticker.add(handleTicker)

        // 飞机大战
        useFighting(planeInfo, enemyInfos, selfBullets, enemyBullets, emit)

        return {
            planeInfo,
            enemyInfos,
            selfBullets,
            enemyBullets,
            createEnemyBullet
        }
    },
    render(ctx) {
        const createEnemys = () => {
            return ctx.enemyInfos.map((info) => {
                return h(Enemy, {
                    x: info.x,
                    y: info.y,
                    onAttack({ x, y }) {
                        ctx.createEnemyBullet(x, y)
                    }
                })
            })
        }
        const createSelfBullets = () => {
            return ctx.selfBullets.map((info) => {
                return h(Bullet, { x: info.x, y: info.y })
            })
        }
        const createEnemyBullets = () => {
            return ctx.enemyBullets.map((info) => {
                return h(Bullet, { x: info.x, y: info.y })
            })
        }
        return h('Container', [
            h(Map),
            h(Plane, { x: ctx.planeInfo.x, y: ctx.planeInfo.y }),
            ...createEnemys(),
            ...createSelfBullets(),
            ...createEnemyBullets(),
        ])
    }
})
