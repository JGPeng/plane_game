// 返回 [min, max) 之间的随机数
export function getRandomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min
}

// 碰撞检测 - 检测两物体是否发生碰撞
export function hitTest(objA, objB) {
    return (
        objA.x + objA.width >= objB.x &&
        objA.y + objA.height >= objB.y &&
        objA.x <= objB.x + objB.width &&
        objA.y <= objB.y + objB.height
    )
}