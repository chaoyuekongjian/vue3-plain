
export let activeEffect = undefined
class ReactiveEffect {
  public active: boolean = true
  constructor(public fn) {} // 这里的public fn相当于this.fn = fn

  run() { // run就是执行effect  
    if (!this.active) { // 这里表示如果是非激活的情况  只需要执行函数  不需要依赖收集
      this.fn()
      return
    }

    try {
      // 依赖收集   核心就是将当前的effect和稍后渲染的属性关联在一起
      activeEffect = this
      return this.fn() // 当稍后取值操作的时候 可以获取到这个全局的activeEffect
    } finally {
      activeEffect = undefined
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