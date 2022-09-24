/**
 * 目录：
 *
 * 递归复用
 *
 * 1. promise 对象
 *
 * 2. 数组
 *
 * 3. 字符串
 *
 * 4. 对象
 */

// tips: ts 不支持循环但支持递归, 但数量不确定就只能去使用 递归 处理，一层一层的处理

// ----------- promise 递归复用 -----------
type ttt = Promise<Promise<Promise<Record<string, any>>>>

// 通过递归提取一个不确定层数的 promise 中的 value
type DeepPromiseValueType<T> = T extends Promise<infer ValueType>
  ? DeepPromiseValueType<ValueType>
  : T
type deepPromiseValueType = DeepPromiseValueType<ttt>

// ----------- 数组的递归 -----------

// 倒序
type arr = [1, 2, 3, 4, 5]
type ReversArr<T extends Array<unknown>> = T extends [
  ...infer Firsts,
  infer Last
]
  ? [Last, ...ReversArr<Firsts>]
  : T
type reversArr = ReversArr<arr>

// 查找元素
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
type Includes<Arr extends unknown[], FindItem> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false

type IncludesResult = Includes<[1, 2, 3, 4, 5], 4>
type IncludesResult2 = Includes<[1, 2, 3, 4, 5], 6>

// 在数组中删除与之匹配的元素
type RemoveItem<
  Arr extends unknown[],
  Item,
  Result extends unknown[]
> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result
type removeItem = RemoveItem<[1, 2, 2, 2, 2, 2, 3, 4, 5], 2, []>

// 创建“不定”数组 当给定的数组类型元素不确定时候，就需要递归处理
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>
type buildArray = BuildArray<5, 'number', []>

// ----------- 字符串类型的递归 -----------

// 递归处理删除字符串中被匹配的值
type ReplaceStrAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${ReplaceStrAll<Suffix, From, To>}`
  : Str
type replaceStrAll = ReplaceStrAll<'AnnnBercerrWW', 'Ber', 'GGGG'>

// 将字符串每一个字符设置为联合类型
type StringToUnion<Str extends string> =
  Str extends `${infer First}${infer Value}`
    ? First | StringToUnion<Value>
    : never
type stringToUnion = StringToUnion<'value'>

// 字符串的反转
type ReversStr<
  Str extends string,
  Result extends string = ''
> = Str extends `${infer First}${infer Rest}`
  ? ReversStr<Rest, `${First}${Result}`>
  : Result
type reversStr = ReversStr<'123456'>

// ----------- 对象类型的递归 -----------

// 处理嵌套对象，从而其能够全部是 readonly 类型
type DeepReadOnly<Obj extends Record<string, any>> = {
  readonly [Key in keyof Obj]: Obj[Key] extends object
    ? Obj[Key] extends Function
      ? Obj[Key]
      : DeepReadOnly<Obj[Key]>
    : Obj[Key]
}

type deepReadOnly = DeepReadOnly<{ A: { C: { name: 1 } } }>

/**
 * 这里值得注意的是这个地方当 ts 用到时才会及打算所以这里并没有计算到此处
 * 使用 Obj extends any ? never : 计算处理函数 || Objextends never ? never : 计算处理函数
 */

type DeepReadonly<Obj extends Record<string, any>> = Obj extends never
  ? never
  : {
      readonly [Key in keyof Obj]: Obj[Key] extends object
        ? Obj[Key] extends Function
          ? Obj[Key]
          : DeepReadonly<Obj[Key]>
        : Obj[Key]
    }
//   : never

type deepReadonly = DeepReadonly<{ A: { B: { C: { D: '3' } } } }>

type ReverseStr<Str extends string> = Str extends `${infer First}${infer Rest}`
  ? `${ReverseStr<Rest>}${First}`
  : Str
type ReverseStrResult = ReverseStr<'hello'>
