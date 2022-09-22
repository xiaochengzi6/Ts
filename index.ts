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

interface Person {
  name: string
  age: number
  hobby: string[]
}

type filterByValueType = FilterByValueType<Person, string | number>

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
type BuildArray<Length extends number, Ele extends unknown, Arr extends unknown[] = []> = Arr['length'] extends Length
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
