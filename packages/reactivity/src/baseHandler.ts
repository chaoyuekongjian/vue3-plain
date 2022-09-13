
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}



export const mutableHandlers = {
  get(target, key, receiver) { // receiver改变了取值的this指向
    if (key === ReactiveFlags.IS_REACTIVE) return true
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const bo = Reflect.set(target, key, value, receiver)
    return bo
  }
}