/**
 * 目录：
 *
 * 模式匹配
 *
 * 1. 数组
 *
 * 2. 字符串
 *
 * 3. 函数
 *
 * 4. 构造器
 *
 * 5. 索引类型
 *
 */

// ---------- 数组 ----------
type GetValueResult<P> = P extends Array<infer Value> ? Value : never
type value = GetValueResult<number[]>

// 提取数组类型的第一个元素的类型
type GetArrayFirst<T extends unknown[]> = T extends [infer Value, ...unknown[]]
  ? Value
  : never
type FirstArray = GetArrayFirst<[1, 2, 3]>

// 提取最后一个元素
type GetArrayLast<T extends unknown[]> = T extends [...unknown[], infer Value]
  ? Value
  : never
type LastArray = GetArrayLast<[1, 2, 3]>

// 取出排除最后一个的剩余数组
type GetArray<T extends unknown[]> = T extends []
  ? []
  : T extends [...infer Value, unknown]
  ? Value
  : unknown
type getArray = GetArray<[1, 2, 3]>

// 取出排除第一个的剩余数组
type GetArrayShift<T extends unknown[]> = T extends []
  ? []
  : T extends [unknown, ...infer Value]
  ? Value
  : unknown
type ShiftValue = GetArrayShift<[1, 2, 3]>

// ---------- 字符串 ----------

// 判断字符串是否以某个字符为开头
type StartWith<
  T extends string,
  Prefix extends string
> = T extends `${Prefix}${string}` ? true : false
type IsStartWith = StartWith<'value-number', 'value'>

// 字符串替换
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Last}`
  ? `${Prefix}${To}${Last}`
  : Str
type rePlaceStr = ReplaceStr<'valuegetnumber', 'get', 'ww'>

// 取消字符串尾部的空白字符串
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${
  | ' '
  | '\n'
  | '\t'}`
  ? TrimStrRight<Rest>
  : Str
// 这里值得注意的是使用了递归处理
type trimStateRight = TrimStrRight<`dsdsds     `>

// 取消字符串前面的空白字符串
type TrimStrLeft<Str extends string> = Str extends `${
  | ' '
  | '\n'
  | '\t'}${infer Rest}`
  ? TrimStrLeft<Rest>
  : Str
type trimStrLeft = TrimStrLeft<`    dsdsdsds`>

// 这两者何必 形成 trim() 用法
type TrimStr<Str extends string> = TrimStrRight<TrimStrLeft<Str>>
type trimStr = TrimStr<`    dsdsds    `>

// ---------- 函数 ----------

// 提取参数
type GetParameters<Func extends Function> = Func extends (
  ...args: infer Args
) => unknown
  ? Args
  : never
type getParameters = GetParameters<(name: string, age: number) => string>

// 提取返回类型
type GetReturnType<Func extends Function> = Func extends (
  ...args: any[]
) => infer ReturnType
  ? ReturnType
  : never
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
type GetThisParameterType<T> = T extends (
  this: infer ThisType,
  ...args: any[]
) => any
  ? ThisType
  : unknown
type getThisParameterType = GetThisParameterType<typeof dong.hello>

// ---------- 构造器 ----------

// 构造器类型使用 interface 声明
interface Person {
  name: string
}

interface PersonConstructor {
  new (name: string): Person
}

// 提取构造函数的返回对象
type GetInstanceType<Constructor extends new (...res: any) => any> =
  Constructor extends new (...res: any) => infer InstanceType
    ? InstanceType
    : any
type getInstanceType = GetInstanceType<PersonConstructor>

//提取构造函数的参数类型
type GetParameterConstructor<Constructor extends new (...args: any) => any> =
  Constructor extends new (...args: infer ParametersType) => unknown
    ? ParametersType
    : never
type getParametersConstructor = GetParameterConstructor<PersonConstructor>

// ---------- 索引类型 ----------

// 提取 props 中的 ref
// 首先是通过 keyof Props 将其中索引提取出来构成联合类型 然后判断 ref 是否在其中
type GetRefProps<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? Value
    : never
  : never
type getRefProps = GetRefProps<{ ref?: 1; name: 'dong' }>
