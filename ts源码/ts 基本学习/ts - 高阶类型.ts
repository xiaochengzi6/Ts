// ----------------关于 Ts 的高级类型 ----------------

/**
 * 目录
 *
 * 1. Parameters
 *
 * 2. ReturnType
 *
 * 3. ConstructorParameters
 *
 * 4. InstanceType
 *
 * 5. ThisParameterType
 *
 * 6. OmitThisParameter
 *
 * 7. Partial
 *
 */

/**
 * 用于提取函数类型的参数类型
 *
 * Parameters
 *
 */
type DefinedParameters<T extends Function> = T extends (
  x: infer ReturnType
) => any
  ? ReturnType
  : never

/**
 * 用于提取函数类型的返回值类型
 *
 * ReturnType
 *
 */
type DefinedReturnType<T extends Function> = T extends (
  ...args: any
) => infer ReturnType
  ? ReturnType
  : any

/**
 * 提取构造函数的参数类型
 *
 * ConstructorParameters
 *
 * 加上 abstract 表示不能被直接实例化
 */
type DefinedConstructorParameters<
  T extends abstract new (...args: any) => any
> = T extends abstract new (...args: infer R) => any ? R : never

/**
 * 提取构造器返回值的类型
 *
 * InstanceType
 */

type DefinedInstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any

/**
 * 约束函数参数中 this
 *
 * ThisParameterType
 *
 */
type DefinedThisParameterType<T extends Function> = T extends (
  this: infer U,
  ...args: any[]
) => any
  ? U
  : unknown

/**
 * 剔除函数参数中的 this
 *
 * OmitThisParameter
 *
 */
type DefinedOmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T

/**
 * 索引类型中属性可选
 *
 * Partial
 */
