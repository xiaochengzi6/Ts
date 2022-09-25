## 类型收窄

在上述的联合类型的例子中 ts 会分析静态类型的值在运算的具体类型，在 `if/else` 中
放入了`typeof name === "string"` ts 会认为这是一段特殊形式的代码，我们将其称之为
`类型保护` ts 会沿着执行可能的路径在分析值的给定位置上最具体的类型

ts 的类型检查器会考虑这些类型保护和赋值语句，将这个类型推导为更精确的类型的过程
我们称之为收窄

> typeof 操作符在很多 JavaScript 库中都有着广泛的应用，而 TypeScript 已经可以做
> 到理解并在不同的分支中将类型收窄。

### 真值收缩

1、使用 `typeof` 进行多分支的判别

2、隐式的转化

3、强制转换 `Boolean()`

4、`!!` 使用两个感叹号的类型转换

5、`!` 使用一个感叹号对结果取反

### 等值收窄

使用 switch 语句和等值检查比如 === !== == != 去收窄类型

### in 操作符收窄

JavaScript 中有一个 in 操作符可以判断一个对象是否有对应的属性名。TypeScript 也可
以通过这个收窄类型。

```ts
type Fish = { swim: () => void }
type Brith = { sun: () => void }
function move(swim: Fish | Brith) {
  if (swim in Fish) {
    console.log('收缩')
  }
}
```

### instanceof 收缩

instanceof 也是一种类型保护，TypeScript 也可以通过识别 instanceof 正确的类型收窄

### 赋值语句

TypeScript 可以根据赋值语句的右值，正确的收窄左值。

```ts
let sum: string: number = 'name';

function printString(sum: : string | number){
  if(sum = 5){
    console.log(`${sum} 是 number 类型`)
  }else{
    console.log(`${sum} 是 string 类型`)
  }
}
```

### 控制流分析

基于`if else` 等条件控制语句的类型保护，当遇到类型保护和赋值语句 ts 就会采用这样
的收窄类型，而这种方式是一个变量可以被观察到变为不同的类型

```ts
function padLeft(padding: number | string, input: string) {
  // 因为有了 `return` 语句就能通过代码分析判断出在剩余部分的类型
  if (typeof padding === 'number') {
    return new Array(padding + 1).join(' ') + input
  }
  return padding + input
}
```

### 类型判断式

`type predicates` predicate 是一个能返回 `boolean` 的函数

语法：`parameterName is Type` 这里 parameter 是这个函数的参数 Type 是一个类型别
名 以此来去判断 参数是否符合类型别名

```ts
type Fish = {
  swim: () => void
}
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim()
}
```

### 可判别的联合

```ts
interface Shape {
  kind: 'circle' | 'square'
  radius?: number
  sideLength?: number
}

// 在这里使用

function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2
}
```

如果开启了 `strictNUllChecks` 模式 就会导致错误 因为 ts 认为 shape 和
shape.radius 都有可能是 `null` 类型所以要对其处理一下

```ts
function getArea(shape: Shape) {
  if (shape && shape.radius) {
    return Math.PI * shape.radius ** 2
  }
}
```

或者使用非空断言来处理 对象的属性后缀一个`!`

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius! ** 2
}
```

但是这样不太合适 既然开启了 `strictNullChecks` 就是要去做检查但是使用 `!`又去屏
蔽了有些多余

```ts
interface Circle {
  kind: 'circle'
  radius: number
}

interface Square {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square

function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2
}
```

但是这里还是不行 会出现问题 原因就在于 `Shape` 有可能是 Circle 接口的 所以检测不
到 `radius` 属性这里还需要再去判别

但是这里只需要在加一个对 `kind` 的检测就能正确的使用了

```ts
function getArea(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2
  }
}
```

这就能确保了 `Shape` 参数中存在 `radius`属性

当联合类型的每个类型都包含一个共同的自变量属性，ts 就会判断其为 `可辩别联合` 然
后可以将具体成员的类型进行收窄

kind 就是可辩别属性 通过对 kind 校验可以确认参数的具体类型。因为`king` 属性是接
口 `Circle` 和 `Square` 的主要判别因素

### never 类型

当进行收窄的时候，如果你把所有可能的类型都穷尽了，TypeScript 会使用一个 `never`
类型来表示一个不可能存在的状态。

never 类型可以赋值给任何类型，然而，没有类型可以赋值给 `never` （除了 never 自身
）。这就意味着你可以在 switch 语句中使用 never 来做一个穷尽检查。

### 穷尽检查

```ts

function getArea(shape: Shape){
  switch(shape.kind){
    case "circle":
      return ...

    case "square":
      return ...

    default:
      const _never: never  = shape
      return _never;
  }
}

```

这样能穷尽了参数 `shape` 的可能性 使得 ts 在类型收窄都会对所有可能性进行判别

## 类型别名

当一个类型使用多次的时候 这个时候希望有一个单独的命名来指向它以此来重复的使用

```ts
type Point = {
  x: number
  y: string
}

function printName(obj: Point) {
  console.log(obj.x, obj.y)
}
printName({ x: 11, y: 'str' })
```

你可以给这个别名任意的类型

```ts
type Id = number | string

type UserNameID = string
```

## 接口

接口可以看作是 对象类型的另外一种形式

```ts
interface Point {
  x: number
  y: string
}
function printName(obj: Point) {
  console.log(obj.x, obj.y)
}
printName({ x: 11, y: 'str' })
```

## 类型别名盒接口的区分

类型别名无法添加新属性 而接口可以扩展

1、类型别名可以通过 `&` 交集的方式来扩展类型

```ts
type Point = {
  first: number
}

type Beat = Point & {
  laster: string
}
```

每一次的定义都固定了不能再改变

2、接口可以继承来扩展类型

```ts
interface Animal {
  first: number
}

interface Beat extends Animal {
  laster: string
}
```

3、可以对已经存在的接口添加新属性

```ts
interface Point {
  first: number
}

interface Point {
  laster: string
}
```

这就等同于

```ts
interface Point {
  first: number
  laster: string
}
```

## 类型断言

类型断言的使用方法是 `as`

```js
interface Point_a {
  a: number
}

interface Point_b {
  b: number
}

function func (obj: a){
  console.log(obj.a)
}
let B: b = {
  b: 23
}
func(B as a)
```

它会要求你的参数值和 a 的接口做一个对比判断是否一样 也就是于第三方做一个验证。可
以阻止一些强制类型的转换

```ts
type O = number
let a = 2
let b = a + ''
console.log(b as O)
```

这里就会出现错误 b 的类型显然被隐式转化了

## 字面量类型

除了常见的类型 string 和 number ，我们也可以将类型声明为更具体的数字或者字符串。

```ts
// 联合类型
type IsButton = true | false
let x: IsButton = true

// 字面量类型
let x: true | false = true

function printText(target: 1 | 0 | -1) {}

printTet(0)

// 抛出错误
printTet('ss')

function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}
printText('Hello, world', 'left')
printText("G'day, mate", 'centre')
```

和非字变量类型结合

```ts
type obj = {
  user: 'perter'
  age: 20
}
function printName(name: obj | 'name') {
  //...
}
```

## 字面量推断

当初始化变量为 一个对象

```ts
const a = {
  counter: 0
}
那么 ts 会推断其类型为 `number`
```

同样的 再字符串中也是如此

```ts
const a = { math: 'GET' }

function printA(math: 'GET') {
  console.log(math)
}
printA(a.math)
// 出错
```

出错原因在于 对象 a 的属性 `math` 的类型为 `string` 而函数需要接收一个类型为 字
变量类型为 `GET` 的属性两者不相等。

解决方法：

1、添加一个类型断言改变推断结果

```ts
const a = { math: 'GET' }

function printA(math: 'GET') {
  console.log(math)
}

printA(math as a.math)
```

## null 或 undefined

JavaScript 有两个原始类型的值，用于表示空缺或者未初始化，他们分别是 null 和
undefined 。

TypeScript 有两个对应的同名类型。它们的行为取决于是否打开了 strictNullChecks 选
项。

strictNullChecks 没被打开 当参数为 null 或者 undefined 都会成功运行 打开后将会严
格检查 需要先对其进行检查

## 非空断言操作符

当你明确知道一个参数或者是变量不为空的时候你可以再其后添加一个 `！`

```ts
let obj = {}
function printF(name) {
  console.log(name!.toString())
}
printF(obj)
```

## 不常见的原始类型

`BigInt`

```ts
const str: bigInt = BigInt(100)
```

`symbol`

```ts
const sym = Symbol('symbol')
```

## 泛型类型

```ts
function identity<Type>(arg: Type): Type {
  return arg
}
let myIdentity: <Type>(arg: Type) => Type = identity
```

这里的 `<Type>(arg: Type) => Type` 就可以被称为泛型类型 使用它可以校验你的泛型函
数的泛型是否正确

也可以使用 函数的调用签名

```ts
function identity<Type>(arg: Type):Type{
  return arg;
}

// 调用签名
let myIdentity: {
  <Type>(arg: Type): Type = identity
}
```

在某些时候需要将泛型参数作为整个接口的参数，可以清楚的知道传入的是什么参数。接口
内的成员也能使用这个参数

```ts
interface GenericIdentityFn<Type> {
  (arg: Type): Type
}

function identity<Type>(arg: Type) {
  return arg
}
```

这里做出的改动是将 Type 类型放到了接口名的后面 这里不在描述一个泛型函数 二是一个
非泛型函数作为泛型类型的一部分。

当使用 GenericIdentityFn 的时候需要明确给定参数，可以有效的锁定了调用签名的使用
类型

```ts
const Funcidentity: GenericIdentityFn<number> = identity
```

### 泛型类

泛型类的写法类似于泛型接口，在类名后面使用 <> 包裹住类型参数列表

```ts
class Dog<Type> {
  version: Type
  add: (x: Type, y: Type) => Type
}

let useDog = new Dog<number>()

useDog.version = 0
useDog.add = function (x, y) {
  return x + y
}
```

将类型参数放在类上，可以确保类中所有属性都能使用相同的类型。

一个类的类型有两部分： 1、静态部分 2、实例部分

泛型类仅仅对实例部分生效，所以在使用类的时候注意静态成员并不能使用类型参数。

### 泛型约束

在这个例子中 想要获取参数的 arg.length 属性但是并不是所有类型都包括 .length 属性

```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length)
  return arg
}
```

整个就不能使用 它会提示错误，要是能使用需要对其进行修改，让其使用带有 .length 属
性的类型。只要类型有这个成员 我们就能允许使用 但必须有这个成员

```ts
interface Lengthwise {
  length: number
}
function logginIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length)
  return arg
}
```

现在这个泛型函数被约束了，不在适合所有类型，它需要一个 具有 length 属性的对象

### 在泛型约束中使用类型参数

可以通过这个方法可以获得 obj 上存在的属性

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key]
}
```

### 在泛型中使用类类型

通过构造函数来推断出类的类型

```ts
class Beekeeper {
  hasMask: boolean = true
}

class ZooKeeper {
  nametag: string = 'Mikle'
}

class Animal {
  numLegs: number = 4
}

class Bee extends Animal {
  keeper: Beekeeper = new Beekeeper()
}

class Lion extends Animal {
  keeper: Zookeeper = new Zookeeper()
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c()
}
```

## keyof 类型操作符

对一个对象类型使用 `keyof` 操纵符，会返回该对象属性名组成的字符串或者数字字面量
的联合

```ts
type Point = { x: number; y: number }
type P = keyof Point
```

这个 `P === "x" | "y"`

但如果这个类型有一个 `string` 或者 `number` 类型的索引签名 `keyof` 就会直接返回
这些类型

```ts
type Arrayish = { [n: number]: unknow }
type A = keyof Arrayish
// type A = number

type Mapish = { [k: string]: boolean }
type M = keyof Mapish
// type M = string | number
```

这是因为 js 对象的属性名会被强者转为 字符串 所以 属性名为 string 的前身也可能是
number 类型。

> 总结：keyof 主要返回的是 对象属性名 或者是对象属性类型

### 数字字面量的联合类型

```ts
const NumbericObject = {
  [1]: '333',
  [2]: 'boo',
  [3]: 'gggg'
}

type result = keyof typeof NumbericObject
// result = 1 | 2 | 3
```

### Symbol

ts 也支持 symbol 类型的属性名

```ts
const sym1 = Symbol()
const sym2 = Symbol()
const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 3
}
type KS = keyof typeof symbolToNumberMap
// KS = sym1 | sym2
```

处理所有的属性名

```ts
function useKey<T, K extends keyof T>(O: T, k: K) {
  var name: string | number | symbol = k
}
```

### 类和接口

对类使用 keyof

```ts
class Parson {
  name: 'hh'
}

type result = keyof Parson
// result = "hh"
```

```ts
class Parson {
  [1]: string = 'ssss'
}

type result = keyof Parson
// result = 1
```

对接口使用 `keyof`

```ts
interface Person {
  name: 'sss'
}

type result = keyof Person
// result = "name"
```

### typeof 类型操作符

ts 中的 `typeof` 方法可以在类型上下文中使用，用于获得一个变量或者属性的类型

```ts
let a = 'str'
let n: typeof a
// n type = string
```

### ReturnType

传入一个函数类型， ReturnType<T> 就会返回这个函数的返回值类型

```ts
type Predicate = (x: unknown) => boolean
type x = ReturnType<Predicate>
// x = boolean
```

当这样使用的时候就会产生错误

```ts
function f(x: string) {
  return { x: 1 }
}

type x = RetrunType<f>
// 这里就会产生错误
```

值和类型并不相同 可以看到 function f () {} 代表的是一个函数而 `ReturnType<T>` 所
期待的是一个类型所以会抛出错误

解决方法：

```ts
type x = ReturnType<typeof f>
```

对对象使用 tyepof

```ts
const person = { nam2: 'kevin' }
type Kevin = typeof person
```

对函数使用 typeof

```ts
funtion identity<Type>(arg: Type): TYpe{
  return arg
}

type result = typeof identity
```

### 对 enum 使用 typeof

```ts
enum UserResponse {
  No = 0,
  Yes = 1
}

type result = typeof UserResponse
```

### 索引访问类型

可以使用索引访问类型查找另一个类型上的特定属性

```ts
type Person = { age: number; name: string; alive: boolean }
type Age = Person['age']

type I1 = Person['age' | 'name']
type I2 = Person[keyof Person]
```

使用字面量元素类型

```ts
const MyArray = [
  { name: 'Alice', age: 14 },
  { name: 'per', age: 2 }
]
// 获得数组的类型
type myArray = typeof MyArray

// 获得数组字面量的元素类型
type Age = typeof MyArray['age']
```

作为索引的只能是类型 不能通过 const 创建一个变量来去引用

```ts
const a = 'alice'
const obj = {
  alice: 'aaaa'
}
// 这里就会出现问题
type Person = typeof obj[a]
```

类似的案例

```ts
const App = ['To', 'Bo', 'Co'] as const
type app = typeof App[number]

// app = To | Bo | Co
```

这里使用 `as const` 主要是将 数组中每个值的类型都赋予一个字面量类型 `To` `Bo`
`Co`等之类的

然后在通过索引访问类型 配合使用 `typeof` 去获取他们的类型

### 条件类型

条件类型就是帮助我们描述输入类型和输出类型的之间的关系

```ts
interface Animal {
  live(): void
}

interface Dog extends Animal {
  woof(): void
}

type Example = Dog extends Animal ? number : string
```

类似的这种

```ts
interface IdLabel {
  id: number
}

interface NameLabel {
  name: string
}

function createLabel(id: number): IdLabel
function createLabel(name: string): NameLabel
function createLabel(nameOrId: string | number): IdLabel | NameLabel
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  //.....
}
```

这里多次创建了函数的重载 用来确定函数中传入参数的类型对应相应的执行代码

这里可以使用条件类型来去简化

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel
```

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  //....
}
```

### 条件类型约束

`条件类型约束` 的用途和 `类型保护` `收窄类型` 差不多都是进一步的收缩小类型能够确
定一些更具体的类型

```ts
type MessageOf<T> = T['message']
// 这里就会使用错误 ts 不能确定 T 是否有 message 属性
```

可以约束 T

```ts
type MassageOf<T extends { message: unknown }> = T['message']

interface Email {
  message: string
}

type EmailyMassage = MassageOf<Email>
```

或者

```ts
// 这里用到了 T[number] 用来获取数组中的类型
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>;

trpe Num = Flatten<number>

```

用 number 来获取数组元素的类型 `T[number]`

### 在条件类型中推断

`infer` 关键词可以从正在比较类型中推断类型在 true 分支中引用该推断结果

```ts
type Flstten<Type> = Type extends Array<infer Item> ? Ttem : Type
```

这里就是使用了 infer 声明了一个变量 `Item` 这个变量会根据你传入的 Type 类型去推
断

```ts
type TTuple = [string, number]
type Resolve = Flstten<TTuple>
// Resolve = string | number
```

还有一个例子

```ts
// 获取参数类型
type ConstructorParameters<T extends new (...args: any[]) => any> =
  T extends new (...args: infer P) => any ? P : never

// 获取实例类型
type InstanceType<T extends new (...args: any[]) => any> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : any

class TestClass {
  constructor(public name: string, public string: number) {}
}

type Params = ConstructorParameters<typeof TestClass>
// [string, numbder]

type Instance = InstanceType<typeof TestClass>
// TestClass
```

感觉 infer 需要你去手动传入一个类型 这个类型的会被分解成多个 比
如`(arg: number)=> void` 这里面就有 参数注解、 以及函数返回类型 通过比对 infer
与其 Type 的位置来自动的获取类型 所以 `infer` 会有自动推断类型的能力。

当从多重调用签名中推断类型的时候就会按照最后的签名进行推断，这个签名是用来处理所
有情况的签名

### 分发的条件类型

在泛型使用条件类型的时候，传入一个联合类型，就会变成分发

```ts
type ToArray<Type> = Type extends any ? Type[] : never

type StrArrOrNumberArr = ToArray<string | number>
// type StrArrOrNumberArr = string[] | number[]
```

如果要避免这种情况可以使用 [] 将 Type 包裹起来

```ts
type ToArray<Type> = [Type] extends [any] ? Type[] : never

type StrArrOrNumberArr = ToArray<string | number>
// StrArrOrNumberArr = (string | number)[]
```

## 映射类型

解决的问题：当一个类型基于另一个类型，不想在拷贝就要考虑使用 映射类型

映射类型建立在索引标签的语法上

```ts
// 索引类型
type OnlyBoolsAndHorse = {
  [key: string]: boolean | unknow
}

// 映射类型
type Options<Type> = {
  [Property in keyof Type]: boolean
}
```

映射类型就是使用 `PropertyKeys` 的联合类型的泛型 其中 PropertyKeys 多是通过
keyof 创建，然后循环遍历键名创建一个类型

```ts
type Options<Type> = {
  [Prototy in keyof Type]: boolean
}

type FeatureFlags = {
  darkMode: () => void
  newUserProfile: () => void
}
// 遍历所有的属性 类型为 boolean
type FeatureOptions = Options<FeatureFlags>
// FeatureOptions{
//  darkMode: boolean
//  newUserProfile: boolean
//}
```

### 映射修饰符

有四种修饰符可以在映射类型中使用

1、`readonly`

用于设置属性只读

2、`?`

设置属性是否可选

3、`+`

添加修饰符 没有添加前缀的都会默认为是 `+`

4、`-`

删除该修饰符

案例：

1、删除可读属性

```ts
type CreateMutable<Type> = {
  -readonly [Prototy in keyof Type]: Type[Prototy]
}

type Locked = {
  readonly id = 'dddddd';
  readonly name = "Per"
}

// 这样使用就能获得一个没有 `readonly` 修饰符的 类型
type UnReadonly = CreateMutable<Locked>

// type UnReadonly = {
//    id = 'dddddd';
//    name = "Per"
// }
```

2、删除可选属性

```ts
type CreateMutable<Type> = {
  [Prototy in keyof Type]-?: Type[Prototy]
}

type Locked = {
  id?: '88888'
  name?: 'Per'
}

type User = CreateMutable<Locked>

type CreateMutable<Type> = {
  [Prototy in keyof Type]-?: Type[Prototy]
}

type Locked = {
  id?: '88888'
  name?: 'Per'
}

type User = CreateMutable<Locked>

// type User = {
//     id: "88888";
//     name: "Per";
// }
```

### 通过 as 实现从新映射

使用 as 语句实现键名的重新映射

```ts
type MappedType<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

`NewKeyType` 可以理解为是一个新的参数名

```ts
type MappedType<Type> = {
  // 注意这里的 <string&Properties> 这里是确保是 Type 的属性且为 string 的
  [Properties in keyof Type as `get${Capitalize<
    string & Properties
  >}`]: () => Type[Properties]
}

interface Person {
  name: string
  age: string
}

type LazePerson = MappedType<Person>

type S = string & number
```

使用实例：

1、根据对象是否有属性来返回 true 或者 false

```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false
}

interface Dog {
  id: { format: 'ss' }
  name: { type: string; pii: true }
}

type ObjectGdp = ExtractPII<Dog>
// {
//    id: false;
//     name: true;
// }
```

## 模板字面量类型

只能在类型操作中使用，跟 JavaScript 的模板字符串是相同的语法

当模板中的变量是一个联合类型的时候，每一个可能的字符串字面量都会被表示

```ts
type Emial = 'Perter' | 'Heeo'

type Forter = 'WWW.ddd' | 'UYUY'

type AllLocalIds = `${Emial | Forter}_ID`
// type AllLocalIds = "Perter_ID" | "Heeo_ID" | "WWW.ddd_ID" | "UYUY_ID"
```

如果模板自变量的多个变量都是联合类型结果会交叉结合 穷尽所有的可能性

### 类型中的字符串联合类型

打算实现一个这样的例子 on 函数会接受 一个 属性并在后加上 "Change" 回调函数中接收
该属性的类型

```ts
const person = markeWatcheObject({
  firstName: "san";
  lastName: "Ron";
  age: 33
})


person.on("firstNameChanged", (newValue)=>{
  console.log(`...${newValue}`)
})
```

实现

```ts
Object.keys(passedObject).map(x=>`${x}Changed`)

type PropEventSource<Type> = {
  // 这里 {string & keyof Type} 取的交集 确保属性是 Type 类型的且类型为 string
  on(eventName: `${string & keyof Type}Change`, callback: (newValue: any) => void);

}
// 或者这样

type ProEventSource<Type> = {
  on(eventName: `${Extract<keyof Type, string>Change}`, callback: (newValue: any)=> void): void
}


```

现在来实现回调函数接收的参数的问题 传入的参数和对应的属性的类型相同

```ts
type PropEventSource<Type> = {
  // 这里确保 key 是 string类型的并且是 Type 的属性
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) = void
  ): void
}

declare functioon makeWatchedObject <Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", newName => {
														  // (parameter) newName: string
    console.log(`new name is ${newName.toUpperCase()}`);
});

```

具体的可以参考这里
[模板字面量类型-实例](https://ts.yayujs.com/handbook/TemplateLiteralTypes.html#%E6%A8%A1%E6%9D%BF%E5%AD%97%E9%9D%A2%E9%87%8F%E7%9A%84%E6%8E%A8%E6%96%AD-inference-with-template-literals)

内置的字符操作类型

`Uppercase`: 每个字符转大写

```ts
type Strgetting = 'Hello, word'
type ShoutyGreeting = Uppercase<Strgetting>

type AsKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = AsKey<'my-app'>
```

`Lowercase`: 每个字符转为小写

`Capitalize`: 每个字符的第一个字符转为大写形式

`Uncapitalize`: 每一个字符的第一个字符转换未小写形式
