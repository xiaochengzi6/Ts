never 代表不可达，比如函数的异常抛出就是 never

void 代表空 可以时 undefined 或 never

any 代表任意类型，任何类型都可以赋值给它，但是不能赋值给其他的类型

unknown 未知类型，任何类型都可以赋值给它，但是不能赋值给别的类型

> any 和 unknown 的区别： any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，而 any 除了可以接收任意类型的值，也可以赋值给任意类型（除了 never）。类型体操中经常用 unknown 接受和匹配任何类型，而很少把任何类型赋值给某个类型变量。

## 模式匹配

### 数组

1、提取类型

```ts
type GerValueResult<P> = P extends Promise<infer value> ? value : never

type Result = GetValueType<Promise<number>>
```

需要注意这里的 `infer` 他会自动推断 那也是你需要去传入合适的类型才会推断

```ts
type GerValueResult<P> = P extends Promise<infer value> ? value : never

type Result = GetValueType<number>
// Result = never; 这显然和我们的预期不符合
```

还有这种

```ts
type GetValue<P> = p extends Array<infer value> ? value : never

type Value = GerValue<number>
// Value = never

// 要是想要获得合适的值就必须传入 合适的参数

type Value = GerValue<number[]>
type Value = GerValue<Array<number>>
// 这两者都可以
```

infer 会根据合适的类型去推断 当传入的类型不完整的时候就会出现不符合预期值。

TypeScript 类型的模式匹配就是通过使用 `extends ?` 这样的语法来去对类型参数匹配，将其结果保存在 infer 的局部变量中

2、提取数组第一个元素

```ts
type GetArrayFirst<T extends unknown[]> = T extends [infer Value, ...unknown[]] ? Value : never

type arr = [1, 2, 3]

type FirstArray = GetArrayFirst<arr>
// FirseArray = 1
```

`T extends unknown[]` 用来约束类型为数组 后面的 extends 用来结合 `?` 用来判断

any 和 unknown 的区别： any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，而 any 除了可以接收任意类型的值，也可以赋值给任意类型

类似的可以取出数组的最后一个

```ts
type Arr = [1, 2, 3]

type GetLastArray<T extends unknown[]> = T extends [...unknown[], infer Last] ? Last : never

type Last = GetLastArray<Arr>
```

或者取出排除最后一个的剩余数组

```ts
type Arr = [1, 2, 3]

type GetArray<T extends unknown[]> = T extends [] ? [] : T extends [...infer Rest, unknown] ? Rest : unknown

type Rest = GetArray<Arr>
```

### 字符串

1、判断某个字符串是否以某个前缀开头

```ts
type HasValueStr<T extends string, Y extends string> = T extends `${Y}${string}` ? true : false

type IsValue = HasValueStr<'Hellow word', 'Hellow'>
```

这里使用了 `${Y}${string}` 前一个 `${Y}` 表示继承的是 Y 的类型 后一个 `${string}` 表示任何字符串

2、字符串的匹配的问题

```ts
type Replace<Str extends string, From extends string, To extends string> = Str extends `${infer Prefix}${From}${infer foot}`
  ? `${Prefix}${To}${foot}`
  : Str

// 这里的意思就是通过传入的三个参数  用 From 去将字符划分三个区域

// 目标  划分标识  替换字符
type ReplaceResult = Replace<'Object is ?', '?', 'Value'>
// Object is Value
```

3、替换字符串的空白字符 Trim

空白字符可能很多 只能一个一个匹配递归去除

```ts
type TrimString<Str extends string> = Str extends `${infer Result} ${' ' | '\n' | '\t'} ` ? TrimString : Str
```

总结下来 使用 `extends` 后面的这个很重要 它必须能够代表你传入的类型 你可以使用 infer 来去使用这个类型中的一小撮类型 比如 `${infer Value}${string}` 然后你传入了一个这样的值 `Hellow wwwww sdsd` 那么你使用 infer 声明的 `Value` 变量的值就是 Hellow 后面的 `${string}` 相当于占位符。用于解释器后都是字符串类型

### 函数

1、提取参数的类型

```ts
type GetParamterFunc<Func extends Function> = Func extends (...args: infer Value) => void ? Value : never

type FuncParamter = GetParamterFunc<(name: string) => void>
```

这里的`(name: string)=>void` 也是一种类型--函数类型

2、提取返回值

```ts
type GetReturnFunc<Func extends Function> = Func extends (...arg: any[]) => infer Return ? Return : never

type FuncReturnValue = GetReturnFunc<(name: number) => void>
```

这里又一个注意点 这里参数使用了 `any` 而不是 `unknown` 因为这里是做参数的类型 而参数又被赋予其他的类型上 unknown 只能用来被标识 不能用来接收

使用了 `unknown` 那么就会返回 never 类型。

3、 关于 this 的问题

```ts
class Dong {
  name: string
  constructor() {
    this.name = 'dong'
  }

  hello() {
    return 'Hello, I' + this.name
  }
}

const dong = new Dong()
const obj = {
  name: 'obj',
}
dong.hello.call(obj)
// Hello, I obj
```

这里使用到了 call 也可以使用 apply 来去改变类中方法的 `this`

如果不想要外部获取可以这样设置

```ts
class Dong {
  name: string
  constructor() {
    this.name = 'dong'
  }

  hello(this: Dong) {
    return 'Hello, I' + this.name
  }
}
```

提取函数的 `this`

```ts
type GetThisParamter<T extends Function> = T extends (this: infer Target, ...args: unknown[]) => unknown ? Target : never
```

### 构造器

1、提取构造器的返回类型

```ts
interface Person {
  name: 'Helllow'
}

interface PersonConstructor {
  new (name: string): Person
}

type GetFuncType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer Return ? Return : never

type FuncReturnValueType = GetFuncType<PersonConstructor>
```

2、提取构造器的参数

```ts
type GetFuncConstrctorParamter<T extends new (...args: any[]) => any> = T extends new (...args: infer ArgsType) => any ? ArgsType : never

type GetConParamter = GetFuncConstrctorParamter<PersonConstructor>
```

### 索引类型

这里使用到的例子是提取 React 中的 ref

```ts
type GetRefProps<Props> = 'ref' extends keyof Props ? (Props extends { ref?: infer Value | undefined } ? Value : never) : never

// type GetRefValue = GetRefProps<{ref?: undefined, name: "dong"}>
type GetRefValue = GetRefProps<{ ref?: 1; name: 'dong' }>
```

[例子合集](https://www.typescriptlang.org/zh/play?#code/PTAECIAkFMBt4PYHdRIQJwCbgjetlUNsAoEgFwE8AHaUSAQwGcA1B2AV2ifPQEsAdgHMAPABVQ0AB7loAzE1A9+wgDSgAmpJlyFS3oKEA+UAF5QJCdNnzFAAwAkAbw0BfZ8sOu7AflC8uAC5QADN2JmgAbjIqWlAASSYAIQQEWGgGAQBlA2EzemY2Tm5c0Sg4RBQ0LHBVcvxkcCMyEFBAGm9AADlAKjlAYUVAAl8YmjoAMT50HgBBdHQGSnFtGz0OAQBrAWQBAG0AXRNzKx1bUE3BEOh0UCKudQA6O+W1jZ3tvyu6YIFoADdz6Ioh0AMab5TYARlUACZVABmbZ-WJ0ADi0HIo3G5CmM0ob3yaMm01mIiB6GaJFagABzQBwKt1+oM4gAZZgYglzA6LRQPdZILa7fJs3SKTZ3G6cp7bdSnc6hVKydAvaUIWWgD7fX50pEoxn4rH5LXMrFE6ak1qAf7NAEbG6tAACVoNRYAwAMbQHIqIRiIFCFEiF0LAX6V3qELoBAAW19R08alA7vQnvI4b0keM+RIPusfscTklFzx5HcTiDofz2dAeu8fkzufzMbj+bLdmVoBdZH+cWR5B95htdsdztKNa94AA8gAjABW0Ad8b4ih8tQgc-U4DeTRaYEAC8aANeVAL+KgAdTQAhboAh5V3rY15AACkCGCHZcNlg6RHeBA6E4on1O+AgBHtQO-X6AAAphQ9JhghLN4AEozBML4ED4TBQFedguEbT4fnQeEAXfS8ZhvKVzHbHDr1ve8RAAgRr2gYIkwg0wjFg+DjQ3TdABX4wA9tUAHgVLXbG1yA4dABHfR973-d9yE-b9cRE9MjiAu4PWCUVuR2KC6NAEteP4gREOtFEtNQ1UMMtd9NIEnECJRUzBNI8jKI+DgQxHc5aJguDMCY0Atz3fd-AACxnEgHXtJhFAAES-IRQCcEhQFACiQyo-1DGiWKHS-ZQOCnDAAIg6LYti8h-KYG54ugcxwEwCLwBi0BXDIWLfIqBAAMKmdgnC4Rcpq2L0D0gTQAAcjwAh1HiAbQAAaj8mcSsolLapIOq0oEHhQEqz58k+FAOqEHK-laBFQHbMQiqIvD0HmGS9DEiSf35WTWtA9SBDOC4B3IW55NjJ6lJ5FzMkoPx3oM9DokO47Tqvc7LsOa773Er87v-FqirAl6pXez6bhAxTVi5P66N+oGPRREG1VPaMivMo6UROmcztlEQEQQEI1q-aAbkaxAPK3QAQ80AAgTvPYwBvH0AaPUSEEWUwidUBz3OJgvyimrSuCepKmquqJYEKXe1l+WvwAYXSgIsouPK4ugJBbIS6jSgg4I5fGL9Fu4lF3zEIYYfZC2UDk7HvuCAGVLogGkauxQtsA4CA8BARKGDowNL6gQfCswI0PJw6TOTt4PbiCzUXvPPoBER2FYEI2VpN8gMB5zcBcACzV9zF48Kfbd9K+UU2GfOL2-S2v2cdj+Ptn+uOf0sf9I8HmOSymIQmGLsfAdAefF4BFVQdd8hK57i4C47430G7qHGbLw2j8ymuSTXTzN1AXqQjbyzoBCc9g2oJhS4-pgJ9i8BH44HDqAFY0BKAs1lj-RC3V34IE-v+Jwj8fBo1epcZCdAAA+oBliYFfoIaAmA6r5R0m8bqZN0A1U3uTMkYBwYvxCNTHir9YGfxEIg1+yDsHyDwZ8TA6gVYQHWkIcArhmh0PIDaBh6D8hMLfj-NhSDgjgjinZQRVVRFAA)

## 类型转换

ts 提供了三个不能被重新赋值的变量 `infer` `type` `类型参数`

由于这三者的不可变性所以产生新类型就要 `重新构造`

### 数组类型的重新构造

1、扩展 元组的数量

```ts
type arr = [string, string]
type Push<Arr extends unknown[], Ele> = [...Arr, Ele]

type TupleArray = Push<arr, number>
// [string,string, number]
```

数组和元组的区别：数组是指同一个类型的元素构成比如 `number[]` `string[]` 而元组的数量是固定的 类型可以由多个元素构成 比如：`[number, string boolean]`

1、合并两元素的元组

```ts
type tuple1 = [1, 2]

type tuple2 = ['guang', 'dong']

// 合并成以下元组

type tuple = [[1, 2], ['guang', 'dong']]

// 简单实现
type zipArr<T, Y> = T extends [infer left, infer right]
  ? Y extends [infer Yleft, infer Yright]
    ? [[left, Yleft], [right, Yright]]
    : []
  : []

type Value = zipArr<tuple1, tuple2>
```

扩展到任意个元素

```ts
type AddArray<T extends unknown[], Y extends unknown[]> = T extends [infer left, ...infer right]
  ? Y extends [infer Yleft, ...infer Yright]
    ? [[left, Yleft], ...AddArray<right, Yright>]
    : []
  : []
type AddArrayValue = AddArray<[1, 2, 3, 4], ['a', 'b', 'c', 'd']>
```

### 字符串类型的重新构造

1、获得一个字符串字面量类型的 'guang' 转为首字母大写的 'Guang'。

```ts
type UpercaseStr<Str extends string> = Str extends `${infer firststring}${infer Rest}` ? `${Uppercase<firststring>}${Rest}` : never

type FirstStr = UpercaseStr<'guang'>
// Guang
```

2、实现 dong_dong_dong 到 dongDongDong 的变换。

```ts
type TransFromStr<T extends string> = T extends `${infer first}_${infer Tarfet}${infer Rest}`
  ? `${first}${Uppercase<Tarfet>}${TransFromStr<Rest>}`
  : T

type transFromValue = TransFromStr<'dong_dong_dong'>
// type transFromValue = "dongDongDong"
```

3、删除某段字符

```ts
"dong~~~", "~" ==> "dong"
```

实现

```ts
type DelateStrValue<T extends string, Tager extends string> = T extends `${infer First}${Tager}${infer Last}`
  ? `${First}${DelateStrValue<Last, Tager>}`
  : T

type DeleteStr = DelateStrValue<'dong~~~', '~'>
```

### 函数类型的重新构造

比如在已有的函数类型上添加一个参数

```ts
type AddArgumentsFunc<T extends Function, arg> = T extends (...args: infer Arrs) => infer Return ? (...args: [...Arrs, arg]) => Return : T

type AddValue = AddArgumentsFunc<(name: string) => boolean, number>
// (args_0: string, args_1: number) => boolean
```

### 索引类型的重新构造

总结 最重要的就是要选对合适的 `占位符` 我将 `extends` 后面的 `?` 前面的一坨称之为 `占位符` 用来表示传入的参数的大致形状 然后通过处理它来来获得想要的类型比如我有这样一段代码

```ts
type TransFromStr<T extends string> = T extends `${infer first}_${infer Tarfet}${infer Rest}`
  ? `${first}${Uppercase<Tarfet>}${TransFromStr<Rest>}`
  : T

// 首先看这行看看这个闯入的字面量的值
type transFromValue = TransFromStr<'dong_dong_dong'>
```

你会发现字面量为 `dong_dong_dong` 我们在 `extends` 后的占位符 `${infer first}_${infer Target}${infer Rest}` 中将 `_` 符号前和符号后的使用 infer 声明的变量表示 后面到时候递归处理 我这里只用处理 `Target` 在将其三者合并就能得到想要的值。 这就是模式匹配的核心

总结下来就三点：

1、收窄类型------------- 这里主要是让传入的参数是特定的类型避免传错参数

2、选对合适的`占位符`---- 占位符的意思是我编的 他就代表了你传入参数的抽象形态

3、组合----------------- 将其组合在一起返回

实例：

按着我的这个方法去做题试试

1、合并两元素的元组

```ts
type tuple1 = [1, 2]

type tuple2 = ['guang', 'dong']

// 合并成以下元组

type tuple = [[1, 2], ['guang', 'dong']]
```

1、先收窄类型

```ts
type zipArr<T extends unknown[], Y extends unknown[]>
```

2、合适的 `占位符` 和 3、组合

```ts
type zipArr<T extends unknown[], Y extends unknown[]> = T extends [infer left, infer right]
  ? Y extends [infer Yleft, infer Yright]
    ? [[left, Yleft], [right, Yright]]
    : []
  : []
```

最后的结果

```ts
// 最后
type zipArr<T extends unknown[], Y extends unknown[]> = T extends [infer left, infer right]
  ? Y extends [infer Yleft, infer Yright]
    ? [[left, Yleft], [right, Yright]]
    : []
  : []

type Value = zipArr<tuple1, tuple2>
```

看不懂也没事 先记下来那些没弄懂 看看文档 在刷刷题

### 索引类型的重新构造

1、Mapping

```ts
type Mapping<Obj extends object> = {
  [key in keyof Obj]: [Obj[key], Obj[key], Obj[key]]
}
```

2、重映射 `UppercaseKey`

```ts
type UppercasseKey<Obj extends object> = {
  [key in keyof Obje as Uppercase<key & string>: Obje[key]]
}

```

3、Record

```ts
// 可以简单的看成这样
type Record<K extends string | number | symbol, T> = { [P in K]: T }
```

指定索引和值的类型分别为 K 和 T，就可以创建一个对应的索引类型。

```ts
type UppercaseKey<Obj extends Record<string, any>> = {
  [key in keyof Obj as Uppercase<key & string>]: Obj[key]
}
```

这里就限制 Obj 的 key 为 `string` 类型 值为任意类型

。。。

过滤属性的操作

```ts
type fileobjeVaule<T extends Record<string, any>, Value> = {
  [key in keyof T as Value extends T[key] ? key : never]: T[key]
}
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as ValueType extends Obj[Key] ? Key : never]: Obj[Key]
}
type GetFillObjValue = fileobjeVaule<obj, number>
```

重新构造这一块的[代码](https://www.typescriptlang.org/zh/play?#code/PTAEksjRVHVRhRUEb9AOpoecSBQAXAngBwKagIYBOhoAvKANoDOahAlgHYDmANKDfcwLrrZ4AKAVyoALADwBBYqBwAPNDgYATKqEEMA1gwD2AdwYUubAKIAbHAD4ylAHR2phE+a4BuFL1ygAKoKzmH+BjWQqJiRI6gDIIAtgBGOIQW7iggoIAQKoBueoAkcjCABL6AIW7wHnhovuYAjNYU5SwATDzFoKV+OLVVAERMgvjM7WztStq9DZieAF50WA5iXqBsAJqgVuSzcgrKqhSMAGYJoObbaGw7e-RMImhcoAD8KKCLa4oqlCck8wdHoK-3ZxdX15QKB8Fh8jJRfp95hCuFwAFyGO6gWGUEZ8UAANXwpkEeHIEymxDEzQqbGJrSS7lSgG+5QDwhoAqOTyhTgmUaEiUSgCQRmMnkT1U6i0egMYIevI2ak0On0hmW3h562eWwYuxIwNAdhs32hN0RooVm2+7xwhzYGsN0NuoEBaqNhyMGrZHOIgTEEIWEIsV2RCKt3p4ozwjs5mOxuNAQedGDE1TqLAAzCwACxgigAcnwqZYqdimdTAGNc0pU1wKalAGmZgHVtQCz1oByTUAmYr5CuAI3SkIBvH0A0eruAOgACquEIefwVBwAGVaGIxyRHuKOIwmLLJ-K+aAAAYAEgA3t9tnRCDRZ8wAL6b74AJRwNEPK51643ff7g+HYh3e7QB-nx4358v1+RDBwABuCRuI0ABiu40Iu5B9gkj6juOnTdL0FIpGAgB52oADc6gIMzAAPo4Uw+FDEwoCAAxK2HEQAIlRxGgPkgAbyoARsaAEAMXZol4hA9FQoGENo0STty07PO+sqrGKzy3tuEFoIeuEnsqexeEQuwyfJKqgN+Mkrrct4vpem73rBQ44DMyk4GgFifhxXE8XxAmaZZv7eGxni0DZvHRCGOLWNZDDcR5AkDMRRF4QR7SlmAgAESoAJmmoaAQXMAAfslfTxYl7RkKQVgJUw7QuXglE4KY+AKJOXkmWJ+rsLQc5sEpTB7EJqgiWQdyVcukkKSQ4GvlZ+ANYQn7fAAMkOWk3Kum49fpG6FcVpW0OVYijTQdX9QkjlIt4IFNGic3mfBJDkHNJWHUtOXJel-TpRSoCpIAm36AL+KCCAN+2gAFSoAAHJ0oAQ8oIPl4bslIXTRIob6geoeaCeJqjgwweZoHQQxsEQJGiUu4oABQaijVDIt8DhUAAlGQVhnuZgiEAwOpY3YOPeg6xBUMjhBMFwhNZeepSU1tXj-Y65XWBGwOg9xENiBjDD4CDyLvuzVixNo2jmD0bBRHEG3JIwCiENs+B5ng2ixAAVqAG6IpL0vVZwTBuFaAFYjif4xPEhBuIelJgIA4-GACd2-07uYhtGzgmKCOYUNVeeebaIQShiO+yMMBgFhsOVspm1aFAaDgQSMKAWcYNo2xykOGIO3gTXeJn2f-Hn2dbf+QGEHClf5zw7vduBpjawAQhg5VeHwYgAPLG+jzyR9HsfxwQifJ6XoYD7gaeIhnADSde5-nhegCPJsr1aB8l-3aIV7vFDrxgNcX-XgEJDwB8P1tZ8X23jQAOLmZ3pi7wL5D+zggdg74FDiZQOqtnYa2SHFestcMDJG7IZAcxkL7D1HhXCeMc441WYAnJOy8M75y+FTLeRdd4EFUIguCYhCEADIrZzk9MiM+rcUDu0aKoaCWAHzIOzmIQOFIgA)

3、递归复用

为什么采用递归？TypeScript 类型系统不支持循环，但支持递归。所以只能使用递归

递归就是将问题细化为一系列相似的问题然后通过不停的调用自身去解决这些问题，满足任务的结束条件就停止。

例如解析一个嵌套的 `Promise` 对象

```js
type DeepPromise<P extends Promise<unknown>> = P extends Promise<infer Value> ? Value extends Promise<unknown> : Value
: never;

type ValuePromise = DeepPromise<Promise<Promise<Promise<"Value">>>>
// Value
```

简化

```ts
type DeepPromise<P> = P extends Promise<infer Value> ? DeepPromise<Value> : P
```

### 数组类型的递归

1、固定元组类型的颠倒

```ts
type arr = [1, 2, 3, 4, 5]

type strat_arr = [5, 4, 3, 2, 1]
```

```ts
type StrotArray<T extends Array<unknown>> = T extends [infer one, infer two, infer st, infer four, infer fi] ? [fi, four, st, two, one] : T

type Value = StrotArray<arr>
```

当数组的长度不固定的时候就需要递归了

```ts
type arr = [1, 2, 3, 4, 5]
type StortArrayValue<T> = T extends [...infer Rest, infer last] ? [last, ...StortArrayValue<Rest>] : T

type DeepValue = StortArrayValue<arr>
```

2、查找引用 [1, 2, 3, 4, 5] 中是否存在 4

```ts
type TargetArray = [1, 2, 3, 4, 5]

type IncludeValueType<Arr extends unknown[], TargetValue> = Arr extends [infer first, ...infer Rest]
  ? first extends TargetValue
    ? [first, true]
    : IncludeValueType<Rest, TargetValue>
  : -1

type GetValue = IncludeValueType<TargetArray, 4>
```

3、删除数组

采取的也是递归遍历删除。

```ts
type TargetArray = [1, 2, 3, 4, 5]；

type IsValue<Target, Value> = (Target extends Value? true : false)&(Value extends Target ? true : false);

type DeleteArray<Arr extends unknown[], ValueType, Result extends unknown[] = []> = Arr extends [infer First, ...infer Rest] ?
  IsValue<First, ValueType> extends true ?
    DeleteArray<Rest, ValueType, Result>:
    DeleteArray<Rest, ValueType, [...Result, First]>
  : Result

type TargetValue = DeleteArray<TargetArray, 2>
```

4、构造数组

构造数组类型 当数组指定长度没有指定类型的时候就要去遍历

```ts
type BuildArr<Length extends number, Ele = unknown, Result extends unknown[] = []> = Result['length'] extends Length
  ? Result
  : BuildArr<Length, Ele, [...Result, Ele]>

type UnknownArrVaule = BuildArr<5>
//[unknown, unknown, unknown, unknown, unknown]
type NumberArrVaule = BuildArr<5, number>
//[number, number, number, number, number]
```

5、字符串的类型递归

当要考虑到处理值中所有的类型的时候就要考虑到使用递归

```ts
// 字符串的类型递归
type DeepString<Str extends string, From extends string, Target extends string> = Str extends `${infer First}${From}${infer Last}`
  ? DeepString<`${First}${Target}${Last}`, From, Target>
  : Str

type S = 'guang guang guang'

type ResultValue = DeepString<S, 'guang', '?'>
```

6、字符串

把字符串字面量类型的每个字符都提取出来组成联合类型 "dong" => "d|o|n|g";

```ts
type Stringvalue<Str extends string> = Str extends `${infer First}${infer Last}` ? First | Stringvalue<Last> : never

type Str = Stringvalue<'dong'>
// type Str = "d" | "o" | "n" | "g"
```

7、反转字符串

```ts
type ResolveStr<Str extends string, Value extends string = ''> = Str extends `${infer First}${infer Last}`
  ? ResolveStr<Last, `${First}${Value}`>
  : Value

type Str0 = ResolveStr<'dong'>
// type Str0 = "gnod"
```

8、对象的迭代

对象属性上的操作 当对象的属性是对象且是嵌套定义的就需要递归处理

```ts
type obj = {
  a: {
    b: {
      c: {
        f: () => 'dong'
        d: {
          e: {
            guang: string
          }
        }
      }
    }
  }
}

type DeepObj<Obj> = {
  readonly [key in keyof Obj]: Obj[key] extends Object ? (Obj[key] extends Function ? Obj[key] : DeepObj<Obj[key]>) : Obj[key]
}

type DeepObjReadOnly = DeepObj<obj>
```

因为 ts 只有类型被用到的时候才会做类型计算。所以在处理 对象的时候没有使用到属性所以没有被处理只是被 `DeepObj` 函数所包裹

所以可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，让它触发计算：

```ts
type DeepObj<Obj> = Obj extends never
  ? never
  : {
      readonly [key in keyof Obj]: Obj[key] extends Object ? (Obj[key] extends Function ? Obj[key] : DeepObj<Obj[key]>) : Obj[key]
    }
```

[本节案例](https://www.typescriptlang.org/zh/play?#code/PTAEiQEwlfUY8jATzUAOAnA9gWwJYGcCmoBQ+IoALgJ4J4AiOOCACqprgDz2g4AeJOAdgCZZQjdNhwsArrwDWvFAHdeAPiWgAvAWLsuPAUJHNxGXgDMcSUADUAhgBsJOVQH5NYUFbsOO3PoOFMxSRk5RWdXdwiaOgNAm3tHUAAuIjcIuIdCYkTQXhwAN3NCckpQKIYA1npVDW0fPX9RVmMzC3SElzKY1jbVbPoiijw2rrwNTorxEbYJ6cbxACI2+ZUVTLBAB1NAEb9AAozAJAV8YrxrJAsNAG0ARgAaUAAmG4BmG4AWG4BWAF0AbjXSQdAsCQkNYSAB9Y6nUBnN5XV5Pe4XD4DEoAZSBKBIAEETtYyCwACreXR+bHAvFSWQKZTVfDuQk6XxCM7NcygFC5G4siwkeQoTmmVmA-ktUAmFASJDC1kmDAfUBOWlQmU3MUSm5C0i8m7snBy7L45FDTyjUBo1BYnF4iFKX5QQASTobTSQUEgLWS2gSaXSiYyoQA6ANc0AAJRwGqDtmsgLlCvcZ0jGoDfrRLrduI9ocBSiR7n1jrKbXUTtTpPTxpY1sd+OOAHMcGmyEXLjd7qAnqBXqBPo6AJK8ADG9n4ODa+MGLFJPvqFJCvDOHxu1aQdZIPXUisnDPqzIFFhlSETgd3IbDJBjiv3gKnfiXK8LLjOl5INyBDj1ir7g4kw9H48zz9AW96x6RVsgAWguR0AHFgONItPyHEdjTHSgCVretSzIF4bRSUBAAIlQATNIOf5QzQFACh7Hg0AnE5ryEGcqXnG5KJwNAbkzCRbBIOjQAYxR5ybD4bXcDRNzqPwdxFAAxDADwApMg3-c93B7LAAFEAEcJDsFgZLk5iqNULc-FfPBYxPMiKKolh-wM1j2LDTiSF6RVSPInAWOo2zQE8m4ziTDiuJuPTo2EpITywJze3UrSdMxG4ACFqlAAAKTEeIS+VSCQLxshMOxcAASlAAAyVLMuMoR0pcUzwvy2wip+XDABDzQACBMAADlACo5LZcMAZX0tkAELdusAWDlADsPQAs7QGwA300ATAVAEYdQAAdMAQMi2sdBKJAwWx+FJFgABk+BrEgAAseN4CQ0AAI3MG41NsE0+N4G4xOJejgkYuVziEot8FJM55ju3hDqO+Y5Uq0B9sB46ssnbJ1s27aTj2g7jpuu6-KTUlUd1JQmsOUBSULDQ4a2na3hw3DAHVtQAyb0AJjkBsAbx9AGj1KBiJKMozWMGsWDNHjASQTngqYXmgQFwD0O4sG+c55KebBgADAASABvIMQpIABfZWpKYTWVePXaow1uWssVdmRcBlhFaVtXdaAjXlYNwF1blwX0EXcXeidJBcf+FEi3mGttMB0BA+sYPQ8B+YfZKQLVzgsZaAQDmLZRG4A6Dmt5jTpxll+QAoo2pmmKcAI3TAHnEpmBsAeetOupwBfhMABeNADXlQAvxUAU3NNkABCNABUAwAIFSZ0B5n4dlM-UVRB4AHxQcfeHHzPo7wZOazyctZfEoQpcBmWgR4q3Vdkp3laDR2jZcNXQHHr3OeX+I9sNz3cgKb3HR5jRF+vhwWEH4fc8p2mK8AWeVAA28azPAmYUC2AKGabm29JbmxrDcQssD+bBw0PMZYRZV4vVALvY8NtD760Ns7FwrkwzgMgUCW+GorZ4KVm0Z2wlshtHnl7AADEWMBECcBQK-pHHGjoUAXQAFZFiVoqdw1hsiiIiNI0AF1JFiJkdI-s8jFGqIiCYbIKVipqFUAAciHoDXRVwFFqOkfwFRpjLE4AsZY2xIcM7ZA3jWExdiIjqxcZY9xdivGqJ8e4dx7iQGlETgAeSESwMJwiwahn7C6fgLAnE3DDmQFQGhFSRJ4skrKSskA4GsAY2wjYzjSBwI2YwoASlkBQCYUAkSPjZEicU0poM161KETgfs3EXCNMqS0rBUkpCdIwOyLKPTmnhTKJEiJQimlkC+g0mZvT1bhQfoUfMoShGhnySE3ghSiyTPCQIwRfCgA)

## 数组长度做计数

ts 类型没有加减乘除，但是可以通过构造出不同的数组取出 `length` 来完成计算，把数组的值加减乘除 转换为对数组的提取和构造。

1、加法

```ts
type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length
  ? Arr
  : BuildArray<Length, Ele, [...Arr, Ele]>

type Add<Num1 extends number, Num2 extends number> = [...BuildArray<Num1>, ...BuildArray<Num2>]['length']

type value = Add<10, 90>
```

2、减法

```ts
type Subtract<Num1 extends number, Num2 extends number> = BuildArray<Num1> extends [...arr1: BuildArray<Number2>, ...arr2: infer Rest]
  ? Rest['length']
  : never
```

3、乘法

```ts
type Multible<Num1 extends number, Num2 extends number, Result extends unknown[] = []> = Num2 extends 0
  ? Result['length']
  : Multible<Num1, Subtraction<Num2, 1>, [...BuildArray<Num1>, ...Result]>
```

4、除法

```ts
type Divide<Num1 extends number, Num2 extends number, Result extends unknown[] = []> = Num1 extends 0
  ? Result['length']
  : Divide<Subtraction<Num1, Num2>, Num2, [unknown, ...Result]>
```

[案例](https://www.typescriptlang.org/zh/play?#code/PTAEhDzQCBMD7dBS9QQt0A6mgRvwFABcCeAHApqAIQFcBLAGwBMBBAJxoENMAeAOSIFtRcAPdXAOwoBnUPw4AjXDQA0oAKJl8AXlBF+Aa34B7AO79ZAJVxCiZdF14Dhqjdr0BtALqgVTgHwvUoUEZNn7AESK-ADm6AAWAc48fIIibJwA-KBePsam5gBcqcTk1HSMrByyCriy9gB0Vb4ZJYqObgDcqKggoIAFSoCrNhg4+FQUFEXsAIwWsdZi7JIyoAkATGNWIpPThulmi3E2mrr8Ti6g7geolVW5lLQMzAnDbrJVFef5V0Nzbo6BwWGRji1tgPOK3SweFAAGUiOJ0AwAMboEhafhDUYxJaiCRSWTzTYTdE0DxKHKkC4Fa4cW7YkSnCr0OjDTKEInPQrzO6gB40mhzekkfgAMykoAAMvQhOhnMlhaL7AByL4RaXOen8XAANykzR6IJV9DIRFw4MhDAOBqh9Fh8MRc2ktz+YEAGnJA3qgACyGRI4kUSIpaKmGNmHAWKK2Kz9NQ2Qesah2DmcrgaByxEZEAAZQMlUmH0DK5eEFalMq6zO7PTdZCaYXCEa9ZLdpFSnpdmWTWQ9Mw0NW1ACZp3U1+AAIiQVSQKLgvUmfat-exA5Zg7i1n5zOOo3Y9rHDvGVKkbt7k+nvJnPgJvlF86AB0OR0xy2bK4jS1O3piA+UV7tpK31mKmi1UEA)；

5、利用数组的长度来确定字符串的长度

```ts
type Strlen<Str extends string, Result extends unknown[] = []> = Str extends `${string}${infer Rest}`
  ? Strlen<Rest, [...Result, Rest]>
  : Result['length']
```

6、比较

如果 A 先到了就是 B 大 否则 A 大

```ts
// 这里默认为 Num1 大于 Num2

type GreaterThan<Num1 extends number, Num2 extends number, Result extends unknown[] = []> = Num1 extends Num2
  ? false
  : Result['length'] extends Num1
  ? false
  : Result['length'] extends Num2
  ? true
  : GreaterThan<Num1, Num2, [...Result, unknown]>
```

7、斐波那契数列

```js
// js 的写法

function FibonacciLoop(n) {
  if (n < 2) return n

  return fobonaciLoop(n - 1) + fobonaciLoop(n - 2)
}
```

这个属实没看明白

```ts
type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr['length'] extends Num
  ? CurrentArr['length']
  : FibonacciLoop<CurrentArr, [...PrevArr, ...CurrentArr], [...IndexArr, unknown], Num>

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>
```

将这个 `CurrentArr` 里面的内容查看就可以发现 其实就是来回的加 第一次就是 `[1]` 然后第二次就是和 `[1,1]` 第三次就是 `[1,1,1]` 第四次就是 第二次和第三次的合并值 `[1,1] + [1,1,1]`

总结： ts 类型没有办法处理数值的加减可以使用 数组的长度来完成这个办法，缺陷是没有浮点数的计算。

## 分布式条件类型

> 当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。

```ts
type Union = 'a' | 'b' | 'c'

type UppercaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item

// type value = "b" | "c" | "A"
```

1、提取字符串中的字符，首字母大写以后重新构造一个新的 `aa_aa_aa => aaAaAa`

之前的方法

```ts
type CamelcaseResult = 'aa_aa_aa'

type Camelcase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
  : Str

type CamelcaseArr<Arr extends unknown[]> = Arr extends [infer Item, ...infer RestArr]
  ? [Camelcase<Item & string>, ...CamelcaseArr<RestArr>]
  : []

type value = CamelcaseArr<['aa_aa_aa', 'ff_ff']>
// type value = ["aaAaAa", "ffFf"]
```

如果是联合类型的呢 ts 会将联合类型中的每一个元素都会传入做一次单独的计算然后再组合成联合类型

```ts
type CamelcaseUnion<Item extends string> = Item extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}`
  : Item

type value = CamelcaseUnion<'aa_aa_aa' | 'bb_bb_bb' | 'ff_ff_ff'>
```

2、判断联合类型

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never

type value = IsUnion<'a' | 'b' | 'c'>
```

传入联合类型会返回 `true` 传入其他类型会返回 `false`

看这里的案例 `IsUnion<A, B = A>` 在条件类型中 左边是联合类型， 会把每个元素传入做计算，右边不会。`A extends A ?` 所以这里的 A 就代表是 联合类型 extends 中 的右侧 A 是标识的联合类型 左侧的值代表 联合类型中的一部份 也就是说 `A extends A` 就是为了触发分布式条件类型， 让 A 的类型单独传入； 而 B 的类型将会作为整个 A 的类型传入。

当 A 是联合类型时：

1、A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。

2、A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。

特别的： 数组转联合类型

```ts
type aa = ['a', 'b', 'c'][number]
// type aa = "a" | "b" | "c"
```

希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'。

```ts
type Combination<A extends string, B extends string = A> = A extends A ? Combination<A, AllCombinations<Exclude<B, A>>> : never
```

`Exclude<B, A>` 就是 B 中排除 A 的值 `AllCombinations<X，Y>` 这里就代表了 x 和 Y 组合的所有类型

## 特殊类型要记清

1、`any` 于任何一个类型交叉都是 any

根据这一特性可以判断类型是否是 `any`

```ts
type IsAny<T> = 'any' extends 'yes' & T ? true : false

type Value = IsAny<any>
// true

type Value_1 = IssAny<number>
// false
```

2、`IsEqual` 判断两者是否相同

```ts
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)

type IsEqualValue = IsEqual<'a', any>
// 这样就会出现问题
```

any 可以是任何类型，类型也可以是 any ，所以就会出现问题

使用这样的方式可以正确判断

```ts
type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
```

3、`IsUnion`

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
```

4、`IsNever`

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

5、any 在合并类型中会返回 TrueType 和 falseType 的合值

```ts
type TestAny<T> = T extends number ? 1 : 2

type value = TestAny<any>
// '1'|'2'
```

6、数组和元组

元组类型也是数组类型，但每个元素都是只读的，并且 length 是数字字面量，而数组的 length 是 number。

```ts
type NotEqual<A, B> = (<T>() => extends A ? 1 : 2) extends (<T>() => extends B ? 1 : 2) ? false : true;

type IsTuple<T> = T extends readonly [...params: infer Eles] ? NotEqual<Eles['length'], number> : false;

```

`T extends [...params: infer Eles]` 这段是判断 T 是一个只读数组

`NotEqual` 用于判断两者不相等的时候是元组

类型之间是有父子关系的，更具体的那个是子类型，比如 A 和 B 的交叉类型 A & B 就是联合类型 A | B 的子类型，因为更具体。

如果允许父类型赋值给子类型，就叫做`逆变`。

如果允许子类型赋值给父类型，就叫做`协变`。

ts 中函数的参数具有逆变性质，参数有可能是多类型的，参数类型会变成他们的交叉类型。

```ts
type UnionToIntersection<U> = (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown ? R : never

type s = UnionToIntersection<{ a: 1 } | { b: 2 }>
// {a: 1;} & {b: 2;}
```

这里就是利用到了函数参数的逆变性质，可以将参数类型变成交叉类型

`U extends U ?` 为了触发联合类型的分发机制，将每个类型单独取出用于传入函数的参数中 函数的参数是多种类型所以就会变成交叉类型 返回的 R 是函数的参数做出的结果

比如像这种就会产出合并的结果

```ts
type Fun<T> = ((x: T) => unknown) extends (x: infer R) => unknown ? R : never

type ss = Fun<{ a: 1 } | { b: 2 }>
// {a: 1;} | {b: 2;}
```
