/**
 * 目录：
 *
 * 协变、逆变
 *
 *
 */

/**
 * tips :
 *
 * 需要明确的是 什么是协变 什么是逆变
 * 类型之间可以相互有相同的部分这个时候就分为子类型和父类型
 *
 * 子类型相对于父类型来说更加具体 比如
 * inter face {
 *  a: number,
 *  b: string
 * }
 *
 * inter face_1 {
 *  a: number,
 *  b: string,
 *  w: number,
 *  e: boolean
 * }
 * face_1 显然是 face 的子类型
 *
 * 了解这点后在向看
 *
 * 当子类型给父类型的时候就是协变
 *
 * 父类型给子类型的时候就是逆变
 *
 * let a: face = {a: 1, b: 'b'}
 * let b: face_1 = {a: 1, b: 'b', w: 1, e: true}
 *
 * a = b
 * 这个时候就产生了协变 当子类型可以赋值给父类的时候就会产生协变
 *
 * 两者都能发生，就叫做双向协变
 *
 * 双向协变 存在于 ts 2x 版本中需要通过 strictFunctionTypes 来去管理
 * strictFunctionTypes: boolean 默认 false
 * ture 只支持函数参数的逆变，设置为 fasle 则是双向协变
 *
 * 需要注意：双向协变是有问题的，尽量避免
 *
 */

/**
 * 函数的参数具有逆变性质，而返回值是协变的
 *
 * 那么在函数传入参数和返回值的处理的时候就要额外处理
 */

type Func = (a: string) => void

const func: Func = (a: 'hello') => undefined

type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never
type UnionToIntersecResult = UnionToIntersection<{ guang: 1 } | { dong: 2 }>

/**
 * 总结：函数的参数具有逆变性返回值具有协变性质
 *
 * 参数：（逆变）也就是在规定类型后  类型向内收缩 {a: number, b: number, c: number}  ==逆变==>  {a: 1}
 *
 * 返回值：（协变）在规定类型后 类型向外扩张 {a: number} ==协变==> {a: 1, b: 1, c: 1}
 *
 * 双向协变：此时有两个类型 一个父类型，一个子类型 由函数的参数类型分别使用这两个类型后能够互相赋值的条件下
 */

// 利用函数的参数 逆变
type GetReturnFunctionPlus<Func extends Function> = Func extends (
  x: any[]
) => infer ReturnType
  ? ReturnType
  : never
// 这里的函数的类型是 any[] 也只能是 any 不可能换成 unknown 因为函数的参数是逆变的 也就是说要找到 unknown 的父类型
// 显然不可能 而 any 类型它的特性就是任何值都是 any ，any 也是任何值

// 利用函数返回值 协变 联合类型的交集的实现
type UnionIntersectResult<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never
type unionIntersectResult = UnionIntersectResult<{ a: number } | { b: string }>

// 这个 UnionIntersectResult 就充分解释了上面说的话 返回的类型是其协变后的东西
// 联合类型协变后就变成 联合类型的交集
