/**
 * 目录：
 *
 * 1. 随机
 *
 * 2. 函数的逆变、协变、双向协变题目理解
 *
 * 3. 联合类型的问题
 *
 * 4. 复杂类型处理
 *
 */

// --------------------- 随机 ---------------------

/**
 * 将接口的首字母大写
 *
 */
interface obj {
  name_object: string
  age_Perter: number
}

type InterfaceStringUpperCase<Obj extends object> = {
  [Key in keyof Obj as Key extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : Key]: Obj[Key]
}

type interFaceStringUpperCase = InterfaceStringUpperCase<obj>

/**
 * 检索 数组
 *
 */
type IsSameValue<A, B> = (A extends B ? true : false) &
  (B extends A ? true : false)

type IncludeArray<Arr extends unknown[], Target> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsSameValue<First, Target> extends true
    ? true
    : IncludeArray<Rest, Target>
  : false

/**
 * 返回查到的数据
 *
 */
type SerchArray<Arr extends unknown[], Target> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsSameValue<First, Target> extends true
    ? First
    : SerchArray<Rest, Target>
  : never

/**
 * 删除匹配到的数组元素
 *
 */
type array = [1, 2, 3, 4, 5]

type deleteArrayElement<
  Arr extends unknown[],
  Target,
  Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
  ? IsSameValue<First, Target> extends true
    ? deleteArrayElement<Rest, Target, Result>
    : deleteArrayElement<Rest, Target, [...Result, First]>
  : Result

type DeleteArray = deleteArrayElement<array, 5>

/**
 * 构造长度不定的数组
 *
 *
 */
type ChangeArray<
  Num extends number,
  El = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Num ? Arr : ChangeArray<Num, El, [...Arr, El]>

type changeArray = ChangeArray<10>

type Camelcase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
    : Str

/**
 * 处理数组中字符串将其遇到 '_' 后的字符大写
 *
 */
type CameCaseArr<Arr extends unknown[]> = Arr extends [
  infer First,
  ...infer Rest
]
  ? [CamelCase<First & string>, ...CameCaseArr<Rest>]
  : []
type cameCaseArr = CameCaseArr<['aaa_aaa', 'bb_bb_bb', 'cc_cc_cc']>

// --------------------- 函数的逆变、协变、双向协变 ---------------------

interface Person {
  name: string
  age: number
}

interface Guang {
  name: string
  age: number
  hobbies: string[]
}

let person: Person = {
  name: '',
  age: 20
}

let guang: Guang = {
  name: 'guang',
  age: 20,
  hobbies: ['play game', 'writing']
}

// 产生了协变
person = guang

let printHobbies: (guang: Guang) => void

printHobbies = (guang) => {
  console.log(guang.hobbies)
}

let printName: (person: Person) => void

printName = (person) => {
  console.log(person.name)
}

// 产生了逆变
printHobbies = printName

// 虽然 这里 printName 使用到了父类型 但是也符合子类型的约束
// 所以这里并没问题

// 当父类型可以赋值给子类型时产生了逆变，子类型赋值给父类型时产生了协变
// 两者都能发生，就叫做双向协变
printName = printHobbies

// 双向协变 存在于 ts 2x 版本中需要通过 strictFunctionTypes 来去管理
// ture 支持函数参数的逆变，设置为 fasle 则是双向协变

// --------------------- 联合类型的问题 -----------------------

// 问题1
type Test<T> = T extends number ? 1 : 2
// 输出什么的？
type testValueDateReturn = Test<1 | 'a'>

//  => 1 | 2

// 问题2：
type TestBoolean<T> = T extends true ? 1 : 2
// 输出什么的？
type TestValueBoolean = TestBoolean<boolean>

//  => 1 | 2

// 问题3:
type TestAnyValueReturn<T> = T extends true ? 1 : 2
// 输出什么
type testAnyValueReturn = TestAnyValueReturn<any>

//  => 1 | 2

/**
 * 原因：
 * 条件类型对 any 做了特殊处理，
 * 如果左边是 any，那么直接把 trueType 和 falseType 合并成联合类型返回。
 */

// 问题3:
type TestInputNeverReturn<T> = T extends true ? 1 : 2
// 输出什么
type testImputNeverReturn = TestInputNeverReturn<never> //  => never

/**
 * 原因：
 *  TS 的特殊处理，当条件类型左边是 never 时，直接返回 never。
 */

// 文章 ts 类型问题 https://juejin.cn/post/7066745410194243597?share_token=324476fb-1e6b-45da-93a4-cf7041ed9c73

// --------------------- 复杂类型处理 ---------------------

/**
 * 问题1：
 *
 * 将 "a=1&b=2&c=3" ===> {a: 1, b: 2, c: 3}
 *
 */

type ParseParam<A extends string> = A extends `${infer Key}=${infer Value}`
  ? { [K in Key]: Value }
  : {}

// 这一步需要理解
type MergeParams<
  A extends Record<string, any>,
  B extends Record<string, any>
> = {
  // A 有 key 有 那么 B 呢 ？ 合并 ： 返回A的值
  // A 没有 key 但 B 有 返回 B 的值，没有返回 never
  [Key in keyof A | keyof B]: Key extends keyof A
    ? Key extends keyof B
      ? MergeValues<A[Key], B[Key]>
      : A[Key]
    : Key extends keyof B
    ? B[Key]
    : never
}

type ParseQueryString<Str extends string> = Str extends `${infer A}&${infer B}`
  ? MergeParams<ParseParam<A>, ParseQueryString<B>>
  : ParseParam<Str>

type MergeValues<A, B> = A extends B
  ? A
  : B extends unknown[]
  ? [A, ...B]
  : [A, B]

type valueParseQueryString = ParseQueryString<'a=1&b=2&c=3'>
