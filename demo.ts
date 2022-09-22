// 测试
// 问题

type array = [1, 2, 3, 4, 5, 6]
// 检索 数组
type IsSameValue<A, B> = (A extends B ? true : false) & (B extends A ? true : false)

type IncludeArray<Arr extends unknown[], Target> = Arr extends [infer First, ...infer Rest]
  ? IsSameValue<First, Target> extends true
    ? true
    : IncludeArray<Rest, Target>
  : false

// 返回查到的数据
type SerchArray<Arr extends unknown[], Target> = Arr extends [infer First, ...infer Rest]
  ? IsSameValue<First, Target> extends true
    ? First
    : SerchArray<Rest, Target>
  : never

// 删除匹配到的数组元素
type deleteArrayElement<Arr extends unknown[], Target, Result extends unknown[] = []> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsSameValue<First, Target> extends true
    ? deleteArrayElement<Rest, Target, Result>
    : deleteArrayElement<Rest, Target, [...Result, First]>
  : Result

type DeleteArray = deleteArrayElement<array, 5>

// 构造长度不定的数组
type ChangeArray<Num extends number, El = unknown, Arr extends unknown[] = []> = Arr['length'] extends Num
  ? Arr
  : ChangeArray<Num, El, [...Arr, El]>

type changeArray = ChangeArray<10>

type Camelcase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
  : Str

// 处理数组中字符串将其遇到 '_' 后的字符大写
type CamelcaseArr<Arr extends unknown[]> = Arr extends [infer First, ...infer Rest]
  ? [Camelcase<First & string>, ...CamelcaseArr<Rest>]
  : []
type camelcaseArr = CamelcaseArr<['aaa_aaa', 'bb_bb_bb', 'cc_cc_cc']>
