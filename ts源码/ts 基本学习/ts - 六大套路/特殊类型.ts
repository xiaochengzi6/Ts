/**
 * 目录：
 *
 * 特殊类型
 *
 * 1. 如何判断 类型是否是 any
 *
 * 2. 判断 union （联合）类型
 *
 * 3. 判断是否是元组
 */

// ------------ 如何判断 类型是否是 any ------------

/**
 * any 类型的特性
 *
 * any 类型与任何类型的交叉都是 any ，任何类型都是 any 类型 any 又可以是任何类型
 *
 * any 在联合类型中比较特殊，如果类型参数时 any 时候就会
 * 返回 TrueType 和 FalseType 合并后的联合类型
 *
 */
type isAny<T> = 'dong' extends 'wwww' & T ? true : false

// 判断是否全等 这里就排除了 any 类型
// type isEqualPlus<A, B> = (<T>()  => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
type isEqualPlus<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false

type TsEqualPlus = isEqualPlus<1, 2>

/**
 * 原理： 源码中这样写道 T1 extends X1 : X2 和 T2 extends U1 : U2
 * 当 X1 和 U1 对应 X2 和 U2 对应 那么 T1 和 T2 对应
 */

// ------------ 判断 union （联合）类型 ------------

/**
 * union 类型遇到条件类型时就会分散成单个传入的计算的特性
 */

type IsUnionPlue<A, B = A> = A extends A
  ? [B] extends [A]
    ? false
    : true
  : never
// 原理在上面的 IsUnion 中介绍， 这里需要注意的是 ？ 后的 [A] 其实是上次处理后的A 也就是传入联合类型 'a' | 'b' 中 a 或者 B

// 判断 never 类型

/**
 * 原理：由于当 never 类型传入类型参数时就会导致直接返回never
 * type IsNever<T> = T extends true ? 1 : 2
 * 所以这里要处理一下
 */
type IsNever<T> = [T] extends [never] ? true : false

// ------------ 判断是否是元组 ------------

/**
 * 元组中的每一个都是只读类型 readonly
 * 元组和数组最大的不同是他们的 length 前者是字面量类型 后者是数字
 */
type IsTuple<T> = T extends readonly [...infer Eles]
  ? NotEqual<Eles['length'], number>
  : false

type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false
