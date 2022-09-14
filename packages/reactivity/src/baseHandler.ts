import { track, tragger } from "./effect"

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}



export const mutableHandlers = {
  get(target, key, receiver) { // receiver改变了取值的this指向
    if (key === ReactiveFlags.IS_REACTIVE) return true
    track(target, 'get', key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, newValue, receiver) {
    let value = target[key]
    const bo = Reflect.set(target, key, newValue, receiver)
    if (value !== newValue) {
      // 更新操作
      tragger(target, 'set', key)
    }
    return bo
  }
}