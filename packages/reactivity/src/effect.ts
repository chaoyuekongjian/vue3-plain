
export let activeEffect = undefined
class ReactiveEffect {

  public parent = null // 解决多层嵌套effect
  public deps = []
  public active: boolean = true
  constructor(public fn) {} // 这里的public fn相当于this.fn = fn

  run() { // run就是执行effect  
    if (!this.active) { // 这里表示如果是非激活的情况  只需要执行函数  不需要依赖收集
      this.fn()
      return
    }

    try {
      // 依赖收集   核心就是将当前的effect和稍后渲染的属性关联在一起
      this.parent = activeEffect
      activeEffect = this
      return this.fn() // 当稍后取值操作的时候 可以获取到这个全局的activeEffect
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }

  stop() {
    this.active = false
  }
}

export function effect(fn) {
  // fn可以根据状态变化  重新执行  effect可以嵌套着些
  const _effecrt = new ReactiveEffect(fn) // 创建响应式的effect
  _effecrt.run()
}

// 一个effect对应多个属性，一个属性 对应多个effect  多对多
const targetMap = new WeakMap()
export function track(target, type, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  // let shouldTrack = !dep.has(activeEffect)
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep) // 让effect记录住对应的dep，稍后的清理的时候会用到
  }
  // 反向记录，应该让effect也记录它被哪些属性收集过，这样做的好处是为了可以清理effect
}


export function tragger(target, type, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return // 触发的值不在模板中
  const effects = depsMap.get(key)
  if (effects) {
    // 找到了属性对应的key
    effects.forEach(effect => {
      // 在执行effect的时候，又要执行自己，需要屏蔽调用，避免无限调用  effect !== activeEffect
      if (effect !== activeEffect) {
        effect.run()
      }
    })
  }
}