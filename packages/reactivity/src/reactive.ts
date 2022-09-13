import { isObject } from "@vue/shared"
import { mutableHandlers, ReactiveFlags } from "./baseHandler"


const reactiveMap = new WeakMap() // 不会导致内存泄漏  key只能是对象

// 将数据转换成响应式数据   只能做对象的代理
// 使用同一个对象，多次代理，返回同一个代理对象
export function reactive(obj) {
  if (!isObject(obj)) return
  if (reactiveMap.has(obj)) return reactiveMap.get(obj)
  if (obj[ReactiveFlags.IS_REACTIVE]) return obj // 如果目标是一个代理对象  那么一定被代理过
  const proxy = new Proxy(obj, mutableHandlers)
  reactiveMap.set(obj, proxy)
  return proxy
}