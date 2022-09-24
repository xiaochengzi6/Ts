/**
 * keyof 是索引查询 针对[对象、class]这两者是索引类型
 * 索引可以做出变化，用 as 操作符，叫重映射
 */

// ====模式匹配

// ----数组
type GetValueResult<P> = P extends Array<infer Value> ? Value : never
type value = GetValueResult<number[]>

// 提取数组类型的第一个元素的类型
type GetArrayFirst<T extends unknown[]> = T extends [infer Value, ...unknown[]] ? Value : never
type FirstArray = GetArrayFirst<[1, 2, 3]>

// 提取最后一个元素
type GetArrayLast<T extends unknown[]> = T extends [...unknown[], infer Value] ? Value : never
type LastArray = GetArrayLast<[1, 2, 3]>

// 取出排除最后一个的剩余数组
type GetArray<T extends unknown[]> = T extends [] ? [] : T extends [...infer Value, unknown] ? Value : unknown
type getArray = GetArray<[1, 2, 3]>

// 取出排除第一个的剩余数组
type GetArrayShift<T extends unknown[]> = T extends [] ? [] : T extends [unknown, ...infer Value] ? Value : unknown
type ShiftValue = GetArrayShift<[1, 2, 3]>

// ----字符串

// 判断字符串是否以某个字符为开头
type StartWith<T extends string, Prefix extends string> = T extends `${Prefix}${string}` ? true : false
type IsStartWith = StartWith<'value-number', 'value'>

// 字符串替换
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Last}` ? `${Prefix}${To}${Last}` : Str
type rePlaceStr = ReplaceStr<'valuegetnumber', 'get', 'ww'>

// 取消字符串尾部的空白字符串
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? TrimStrRight<Rest> : Str
// 这里值得注意的是使用了递归处理
type trimStateRight = TrimStrRight<`dsdsds     `>

// 取消字符串前面的空白字符串
type TrimStrLeft<Str extends string> = Str extends `${' ' | '\n' | '\t'}${infer Rest}` ? TrimStrLeft<Rest> : Str
type trimStrLeft = TrimStrLeft<`    dsdsdsds`>

// 这两者何必 形成 trim() 用法
type TrimStr<Str extends string> = TrimStrRight<TrimStrLeft<Str>>
type trimStr = TrimStr<`    dsdsds    `>

// ----函数

// 提取参数
type GetParameters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never
type getParameters = GetParameters<(name: string, age: number) => string>

// 提取返回类型
type GetReturnType<Func extends Function> = Func extends (...args: any[]) => infer ReturnType ? ReturnType : never
type getReturnType = GetReturnType<(name: string, age: number) => string>

// 确保对象上函数在执行[call\bind\apply]时 this 指向是否正确
// strictBindCallApply = true
class Dong {
  name: string
  hello(this: Dong) {
    console.log(this.name)
  }
}
const dong = new Dong()
// dong.hello.call({name: 'value'})

// 提取 this
type GetThisParameterType<T> = T extends (this: infer ThisType, ...args: any[]) => any ? ThisType : unknown
type getThisParameterType = GetThisParameterType<typeof dong.hello>

// ====构造器

// 构造器类型使用 interface 声明
interface Person {
  name: string
}

interface PersonConstructor {
  new (name: string): Person
}

// 提取构造函数的返回对象
type GetInstanceType<Constructor extends new (...res: any) => any> = Constructor extends new (
  ...res: any
) => infer InstanceType
  ? InstanceType
  : any
type getInstanceType = GetInstanceType<PersonConstructor>

//提取构造函数的参数类型
type GetParameterConstructor<Constructor extends new (...args: any) => any> = Constructor extends new (
  ...args: infer ParametersType
) => unknown
  ? ParametersType
  : never
type getParametersConstructor = GetParameterConstructor<PersonConstructor>

// ====索引类型

// 提取 props 中的 ref
// 首先是通过 keyof Props 将其中索引提取出来构成联合类型 然后判断 ref 是否在其中
type GetRefProps<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? Value
    : never
  : never
type getRefProps = GetRefProps<{ ref?: 1; name: 'dong' }>

/**
 * ts 支持三种可以声明任意类型的变量 type infer 类型参数[ 比如 type Value<T> 中的 T ]
 */

// ==== 重新构造

// ---- 元组的重新构造

// 往元组类型后添加一个类型
type tuple = [1, 2, 3]

type Push<Arr extends unknown[], Ele> = [...Arr, Ele]
type tuplePush = Push<tuple, 4>

// 在前面添加一个类型
type UnShift<Arr extends unknown[], Ele> = [Ele, ...Arr]
type tupleUnShift = UnShift<tuple, 0>

//[1,2] + ['guang', 'dong'] => [[1, 'guang'], [2, 'dong']]
// 递归去处理 能处理数量不定的数组
type Zip2<One extends unknown[], Other extends unknown[]> = One extends [infer OneFirst, ...infer OneRest]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>]
    : []
  : []

type zip2 = Zip2<[1, 2, 3, 4, 5], ['A', 'B', 'C', 'D', 'E']>

// ----字符串类型的重新构造

// 首字母大写
type CapitalizerStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str
type capitalizerStr = CapitalizerStr<'hello'>

// 下划线转驼峰
type CamelCase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
  : Str
type camelCase = CamelCase<'dong_dong_dong'>

// 删除匹配字符
type DropSubStr<Str extends string, SubStr extends string> = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str
type dropSubStr = DropSubStr<'dong~~~~~', '~'>

// ---- 函数

// 函数类型的重新构造
type AppendArgument<Func extends Function, Arg> = Func extends (...args: infer Args) => infer ReturnType
  ? (...args: [Args, Arg]) => ReturnType
  : never
type appendArgument = AppendArgument<(name: string, args: number) => string, number>

// ----索引类型

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

// ==== 递归复用

/**
 * ts 不支持循环但支持递归, 但数量不确定就只能去使用 递归 处理，一层一层的处理
 */

// promise d 递归复用
type ttt = Promise<Promise<Promise<Record<string, any>>>>

// 通过递归提取一个不确定层数的 promise 中的 value
type DeepPromiseValueType<T> = T extends Promise<infer ValueType> ? DeepPromiseValueType<ValueType> : T
type deepPromiseValueType = DeepPromiseValueType<ttt>

// ----数组的递归

// 倒序
type arr = [1, 2, 3, 4, 5]
type ReversArr<T extends Array<unknown>> = T extends [...infer Firsts, infer Last] ? [Last, ...ReversArr<Firsts>] : T
type reversArr = ReversArr<arr>

// 查找元素
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
type Includes<Arr extends unknown[], FindItem> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false

type IncludesResult = Includes<[1, 2, 3, 4, 5], 4>
type IncludesResult2 = Includes<[1, 2, 3, 4, 5], 6>

// 在数组中删除与之匹配的元素
type RemoveItem<Arr extends unknown[], Item, Result extends unknown[]> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result
type removeItem = RemoveItem<[1, 2, 2, 2, 2, 2, 3, 4, 5], 2, []>

// 创建“不定”数组 当给定的数组类型元素不确定时候，就需要递归处理
type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length
  ? Arr
  : BuildArray<Length, Ele, [...Arr, Ele]>
type buildArray = BuildArray<5, 'number', []>

// ----字符串类型的递归

// 递归处理删除字符串中被匹配的值
type ReplaceStrAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${ReplaceStrAll<Suffix, From, To>}` : Str
type replaceStrAll = ReplaceStrAll<'AnnnBercerrWW', 'Ber', 'GGGG'>

// 将字符串每一个字符设置为联合类型
type StringToUnion<Str extends string> = Str extends `${infer First}${infer Value}`
  ? First | StringToUnion<Value>
  : never
type stringToUnion = StringToUnion<'value'>

// 字符串的反转
type ReversStr<Str extends string, Result extends string = ''> = Str extends `${infer First}${infer Rest}`
  ? ReversStr<Rest, `${First}${Result}`>
  : Result
type reversStr = ReversStr<'123456'>

// ---- 对象类型的递归
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

type ReverseStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${ReverseStr<Rest>}${First}` : Str
type ReverseStrResult = ReverseStr<'hello'>

/**
 * 数组长度做计数 ts 中没有办法去做加减运算符， 只能操作 数组中的长度 length 从而达到计算的目的
 */

// 加法
type Add<Num1 extends number, Num2 extends number> = [...BuildArray<Num1>, ...BuildArray<Num2>]['length']

/**
 * 元组和数组的区别：
 * 1、元组可以由任意个值构成但不能随意更改其长度
 * 2、数组由同类值构成，可以修改其长度
 *
 * 注意事项：元组被定义是可以是无名的这种形式 [ ...BuildArray<Num2>, ...infer Rest]
 * 也可以是具名的但全部都要具名 [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
 */

// 减法  被减-减数 = 差 === Num1 -Num2 = 差
type Subtract<Num1 extends number, Num2 extends number> = BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest['length']
  : never

type subtract = Subtract<31, 21>

// 乘法 相当于是在加法的基础上连续加, 添加了一个 ResultArr 用来记录中间的结果
type Mutiply<Num1 extends number, Num2 extends number, ResultArr extends unknown[] = []> = Num2 extends 0
  ? ResultArr['length']
  : Mutiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>

// 除法 递归的累积递减 每运行一次就会 +1
type Divide<Num1 extends number, Num2 extends number, ResultArr extends unknown[] = []> = Num1 extends 0
  ? ResultArr['length']
  : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...ResultArr]>

type divide = Divide<10, 2>

// 使用数组实现计数

// ---- 字符串

// 求字符串的长度
type Strlength<Str extends string, CountArr extends unknown[] = []> = Str extends `${infer Frist}${infer Rest}`
  ? Strlength<Rest, [...CountArr, unknown]>
  : CountArr['length']

type strlength = Strlength<'length'>

// ---- 数字

// 数值大小的比较
type GreaterThan<Num1 extends number, Num2 extends number, CountArr extends unknown[] = []> = Num1 extends Num2
  ? false
  : CountArr['length'] extends Num2
  ? true
  : CountArr['length'] extends Num1
  ? false
  : GreaterThan<Num1, Num2, [...CountArr, unknown]>

/**
 * 这里做的很巧妙 通过对比来判断是否相等 不相等就会但会 false 相等就要去在原来的基础上 +1
 */

type greaterThan = GreaterThan<2, 3>

// Fibonacci 数列 当前的数是前两项的和 f(n) = f(n-1) + f(n-2)

type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr['length'] extends Num
  ? CurrentArr['length']
  : FibonacciLoop<CurrentArr, [...PrevArr, ...CurrentArr], [...IndexArr, unknown], Num>

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>

// 联合分散可简化

/**
 * 当类型参数为联合类型，并在条件类型的左边直接引用该类型时候，
 * ts 就会把每一个元素单独传入来去做类型运算，并合并成联合类型，这样
 * 的语法叫做分布式条件类型
 *
 * 具体解释
 *
 * type Union = 'a' | 'b' | 'c'
 *
 * 当类型参数为联合类型
 * type Uppercase<Item extends string> = ...
 * type upperCase = Uppercase<Union>
 *
 * 并在条件类型的左边直接引用该类型时候
 * type Uppercase<Item extends string> = [注意这里] Item extends 'a' ?  X : Y
 *
 */

type Union = 'a' | 'b' | 'c'

type UppercaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item
type uppercaseA = UppercaseA<Union>

// 当联合类型遇到字符串时
type StrUnion = `${Union}___===`

// 判断联合类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
type isUnion = IsUnion<['a' | 'b' | 'c']>

/**
 * 条件类型中如果左边的类型是联合类型，会把每个元素单独传入做计算，而右边不会。
 * 所以 A 是 'a' 的时候，B 是 'a' | 'b' | 'c'， A 是 'b' 的时候，B 是 'a' | 'b' | 'c'
 *
 * [B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，
 * 那么 B 就是整个联合类型。
 * B 是联合类型整体，而 A 是单个类型，自然不成立，
 * 而其它类型没有这种特殊处理，A 和 B 都是同一个成立。
 */

//  当 A 是联合类型时：

//  A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。

//  A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。

// 数组转联合类型
type unions = ['aaa', 'bbb'][number]

// 实现 BEM
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`

type bemResult = BEM<'div', ['left', 'content', 'right'], ['content', 'color', 'display']>

// 全组合

type Combination<A extends string, B extends string> = A | B | `${A}${B}` | `${B}${A}`

type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never
/**
 * 这里的核心思想就是 两两处理
 * 通过 Combination<A, AllCombinations<Exclude<B, A>>> 去组合 A 以及 B去除A以后的所有组合
 */

// ==== 特殊类型

// 如何判断 类型是否是 any

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
type isEqualPlus<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type TsEqualPlus = isEqualPlus<1, 2>

/**
 * 原理： 源码中这样写道 T1 extends X1 : X2 和 T2 extends U1 : U2
 * 当 X1 和 U1 对应 X2 和 U2 对应 那么 T1 和 T2 对应
 */

// 判断 union （联合）类型

/**
 * union 类型遇到条件类型时就会分散成单个传入的计算的特性
 */

type IsUnionPlue<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
// 原理在上面的 IsUnion 中介绍， 这里需要注意的是 ？ 后的 [A] 其实是上次处理后的A 也就是传入联合类型 'a' | 'b' 中 a 或者 B

// 判断 never 类型

/**
 * 原理：由于当 never 类型传入类型参数时就会导致直接返回never
 * type IsNever<T> = T extends true ? 1 : 2
 * 所以这里要处理一下
 */
type IsNever<T> = [T] extends [never] ? true : false

// 判断是否是元组

/**
 * 元组中的每一个都是只读类型 readonly
 * 元组和数组最大的不同是他们的 length 前者是字面量类型 后者是数字
 */
type IsTuple<T> = T extends readonly [...infer Eles] ? NotEqual<Eles['length'], number> : false

type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

// ==== 协变、逆变
/**
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

type UnionToIntersection<U> = (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown ? R : never
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
type GetReturnFunctionPlus<Func extends Function> = Func extends (x: any[]) => infer ReturnType ? ReturnType : never
// 这里的函数的类型是 any[] 也只能是 any 不可能换成 unknown 因为函数的参数是逆变的 也就是说要找到 unknown 的父类型
// 显然不可能 而 any 类型它的特性就是任何值都是 any ，any 也是任何值

// 利用函数返回值 协变 联合类型的交集的实现
type UnionIntersectResult<U> = (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown ? R : never
type unionIntersectResult = UnionIntersectResult<{ a: number } | { b: string }>

// 这个 UnionIntersectResult 就充分解释了上面说的话 返回的类型是其协变后的东西
// 联合类型协变后就变成 联合类型的交集
