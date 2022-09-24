/**
 * 目录：
 *
 * 重新构造
 *
 * 1. 元组
 *
 * 2. 字符串
 *
 * 3. 函数
 *
 * 4. 索引类型
 */

// ------------- 元组 -------------

// 往元组类型后添加一个类型
type tuple = [1, 2, 3]

type Push<Arr extends unknown[], Ele> = [...Arr, Ele]
type tuplePush = Push<tuple, 4>

// 在前面添加一个类型
type UnShift<Arr extends unknown[], Ele> = [Ele, ...Arr]
type tupleUnShift = UnShift<tuple, 0>

//[1,2] + ['guang', 'dong'] => [[1, 'guang'], [2, 'dong']]
// 递归去处理 能处理数量不定的数组
type Zip2<One extends unknown[], Other extends unknown[]> = One extends [
  infer OneFirst,
  ...infer OneRest
]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>]
    : []
  : []

type zip2 = Zip2<[1, 2, 3, 4, 5], ['A', 'B', 'C', 'D', 'E']>

// ------------- 字符串 -------------

// 首字母大写
type CapitalizerStr<Str extends string> =
  Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str
type capitalizerStr = CapitalizerStr<'hello'>

// 下划线转驼峰
type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str
type camelCase = CamelCase<'dong_dong_dong'>

// 删除匹配字符
type DropSubStr<
  Str extends string,
  SubStr extends string
> = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str
type dropSubStr = DropSubStr<'dong~~~~~', '~'>

// ------------- 函数 -------------

// 函数类型的重新构造
type AppendArgument<Func extends Function, Arg> = Func extends (
  ...args: infer Args
) => infer ReturnType
  ? (...args: [Args, Arg]) => ReturnType
  : never
type appendArgument = AppendArgument<
  (name: string, args: number) => string,
  number
>

// ------------- 索引类型 -------------

// 索引类型的重新构造
type Mapping<Obj extends object> = {
  [Key in keyof Obj]: [Obj[Key], Obj[Key], Obj[Key]]
}
type mapping = Mapping<{ a: 1; b: 2 }>

// 索引类型的键名字母大写
type UpperCaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<Key & string>]: [Obj[Key]]
}
type upperCaseKey = UpperCaseKey<{ apple: 1 }>

/**
 * ts 提供了高级类型 Record 来创建索引类型
 */
// type Record<K extends string | number | symbol, T> = {[P in K]: T;}

// 索引类型添加 readOnly 修饰类型
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key]
}

// 索引类型添加可选修饰符
type toPartial<T> = {
  [Key in keyof T]?: T[Key]
}

// 取消只读修饰符
type ToMutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}

// 取消可选修饰符
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key]
}

// 根据值的类型做出过滤
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key]
}

interface Personsssss {
  name: string
  age: number
  hobby: string[]
}

type filterByValueType = FilterByValueType<Personsssss, string | number>

/**
 * 总结： 想要类型变换的就要重新构造，重新构造的时候可以对其过滤、修改、变换
 */
