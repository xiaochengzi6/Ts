> TypeSctipr Version4.6.4 

## 类型

### 原始类型

1、string 

2、number

3、boolean

4、Array

~~~ts
let arrays: Array<number> = [1,2,3];
let number_arr: number[] = [2,3,4];
~~~
这两种使用方式一样

5、any

当没有使用到类型注解、ts 通过上下文也不能推断的就会默认使用 any 类型

~~~ts
let unImmuable: any = 1;
unImmuable = function () {};
unImmuable = true;
~~~

可以在 `tsconfig.json` 中开启 `noImplicitAny = true` 来使 ts 不回默认使用 any 类型 

6、

## 类型注解

一般在一些变量命名时候不需要对其进行类型注解 只需要赋予值就行 然后 ts 能自动对其类型注解。
~~~js
// 哒咩
let a: number = 333;

// 要洗
let b = 333;
~~~

## 函数

这里就涉及到了最基本三个知识点了

1、函数的参数类型注解

2、函数的返回值的类型注解

3、匿名函数中的参数类型注解

### 1、函数的参数类型注解
当使用函数的时候会通过检查你的类型注解来去判断是否使用正确

~~~ts
function pritName(first: string, laster: number){
  console.log(first + laster)
}
~~~

在声明函数的的时候在每一个参数后面跟上 `类型注解`

### 2、返回值的类型注解

~~~ts
function pritName(first: string, laster: number): string {
  return first + laster
} 
~~~

### 3、匿名函数的参数的类型注解
当 ts 知道如何调用 匿名函数 时候就会自动的推断其使用的参数类型是什么这个过程称之为 `上下文推断` 

~~~ts
let arrs = [89, 'Perter', true];
arrs.forEach((element) => {
  console.log(element)
})
~~~

ts 能自动的推断出其参数的类型为 `element: number | string | boolean`  

### 函数的类型表达式
语法：` () => void`

例如： `(a: string ) => void`

~~~ts
function Peer (str: string){
  console.log(str)
}
function geteeter (fn: (a: string) => void){
  fn("Hello")
}

geteeter()
~~~

函数的参数没有明确给出就会默认为 `any` 

在 `tsconfig.json` 中设置 `strict` `noImplicitAny` 的开启都会导致程序中报错

类似的还可以使用 `type` 类型别名去定义一个 函数类型

`type Peer =  (a: string) => void`

### 调用签名

函数除了可以被调用还可以有自己的属性值 如果我们想描述一个带有属性的函数，我们可以在一个对象类型中写一个调用签名（call signature）。

~~~ts
// 函数签名
type Des = {
  description: string;
  // 这里就表示函数的返回值是一个 布尔值 且返回类型之间使用 `:` 而不是 `=>`
  (someArg: number): boolean;
}

function doSomeSting(fn: Des){
  fn()  
  //....
}
function fn () {return true}
fn.description = "string"
doSomeSting()
~~~

### 构造签名

JavaScript 函数也可以使用 new 操作符调用，当被调用的时候，TypeScript 会认为这是一个构造函数(constructors)，因为他们会产生一个新对象。你可以写一个构造签名，方法是在调用签名前面加一个 new 关键词

~~~ts
type SomeConstructor = {
  new (s: string): SomeObject
}

function fn (ctor: SomeConstructor){
  return new ctor("hello")
}
~~~


调用签名和构造签名可以放在一起

~~~ts
interface SomeConstructor{
  new (s: string): Date;
  (n?: number): number;
}
~~~

### 泛型函数

函数的输出类型依赖于输入类型，或者两个输入类型以某种形式相互依赖

~~~ts
function firstName<Type> (arr: Type[]): Type | undefined{
  return arr[0]
}

// 调用

const value = firstName(["a","b","c"]);
// typeof value === string

const Value_2 = firstName([1,2,3]);
// typeof value_2 === number
~~~

这里指定了一个参数为 `Type[]` 的类型（也就是说接收 Type 类型的数组） 且 输出值也符合 `Type` 的类型（值为 Type 类型）


### 推断

ts 会根据上下文来推断类型参数

~~~ts
function map<Input, Output>(arr: Input[], func: (arg: Input): Output): Output[] {
  return arr.map(func)
}

~~~


### 约束

有的时候，我们想关联两个值，但只能操作值的一些固定字段，这种情况，我们可以使用**约束（constraint）**对类型参数进行限制。

比如： 为了确保传入的参数具有 `length` 属性我们使用 extends 语法来约束

~~~ts
function <Type extend {length: number}> (a: Type, b: Type) {
  if(a.length > b.length){
    return a;
  }else{
    return b
  }
}
~~~


### 泛型约束实战
这是一个错误的例子
~~~ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    // 这里出现问题
    return { length: minimum };
  }
}
~~~

这是一个返回值类型为 `Type` 的函数 函数返回值不符合要求 就会出现错误

虽然这个例子返回的 对象符合 `约束` 但是和参数的类型 `Type` 不相符 




### 声明的类型参数
ts 能自动推断泛型调用中传入的类型参数， 但也并不能总是推断出

~~~ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2)
}
combine([1,3,5],["hello"])
// 这里就会不合适 出现错误

// 可以手动的添加类型
combine<string | number>([1,2,3],["hello"])

// 类似于这种
let arr: (string | number)[] = [1,2,3, "heool"]
// 这 `string` 和 `number` 之间做了一个并集 可以处理的范围更广
~~~


### 函数的可选参数的问题

1、参数可选 需要在参数的后缀一个? 表示参数可以省略

~~~ts

function f(x?: number){
  //...
}
~~~

2、参数提供一个默认值

~~~js
function f(x=10){
  //....
}
~~~

3、回调函数的可选参数

在 4.6.4 版本中

~~~ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void){
  for(let i = 0; i < arr.length; i++){
    callback(arr[i],i)
  }
}
myForEach([1, 2, 3], (a, i) => console.log(a, i));
~~~

回调函数中 `index`的参数是一个可以被忽略的 但是传入了一个值 ts 没有抛错可以使用。 这里表明了 回调函数可以接收 1-2 个参数值

### 函数重载
ts 的函数调用中 确定其参数后才能对其使用 但是有些函数需要根据不同的参数的来返回值。这就需要写 `重载函数签名` 才行， 通过写一些`函数签名`来说明函数的不同调用方法

~~~js
function makeDate(timesTamp: number): Date;

function makeDate(m: number, d: number, y: number): Date;

function makeDate(morTimestamp: number, d?: number, y?: number){
  if(d !== undefined && y !== undefined){
   return new Date(morTimestamp, d, y)
  }
  
  else if(d !== undefined || y !== undefined){
    return d extends undefined ? new Date(morTimestamp, d) : new Date(morTimestamp, null, y)
  }
  else{
    return new Date(morTimestamp)
  }
}

~~~

这里有两个`函数重载` 一个接收一个参数 另一个接收两个参数，然后又写了一个兼容签名的函数实现 将其称之为 `实现签名` 
> 这里的函数调用只接受 1 或者 3 个参数 原因就在于没有写 接收 2 个参数的函数重载

函数重载 和 实现签名必须兼容

### 如何写好一个函数重载的建议

1、尽量使用 `联合类型` 代替 `函数重载`

~~~ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any){
  return x.length
}
~~~
等效于

~~~ts
function len(x: any[] | string ){
  return x.length;
}
~~~

### 函数中声明的 this
~~~ts
const User = {
  id: 123,
  admin: fasle,
  bacomeAdmin: function () {
    this.admin = true;
  }
}
~~~
在这个对象 `User` 中 `this` 能够知道是指向的是 User 在特殊情况下还需要明确指出

~~~ts
interface User = {
  id: number;
  admin: boolean;
}

declare const getDB: () => DB;

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function(this: User){
  return this.admin;
})
~~~
这里就去指明了 `this` 的指向关系 this 代表着 `User`

> 值得注意的是这里不应该使用 箭头函数 箭头函数的 this 指向的是外层函数的 this

## 其他类型

1、void

表示一个函数不会返回任何值。

2、object

表示任何不是原始类型的值 (string, number, bigint, boolean, symbol, null, undefined)

3、unknown 

表示任何类型的值 类似于 any 使用 `unknown` 更安全怎么使用都合法。可以描述一个函数返回一个不知道什么类型的值。

~~~ts
function printAny(num: string): unknown{
  console.log(num)
}
~~~

4、never

一些函数从来不返回值，它也表示一个值不会再被观察到，作为函数的返回类型的时候他会表明 函数异常结束，或者是会结束程序执行。

~~~ts
function fnc(s: string): never{
  throw new Error(s)
}
~~~

也可以表示在联合类型中没有可能是其中的类型的时候

~~~ts
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // x 的类型 type= 'never'!
  }
}
~~~

感觉这样写体现不出来这个特征 当函数的参数不是 `string | number` 的时候就会抛出错误的。

### Function
使用 `Function` 类型可以表示总是被调用 但结果返回 any 类型

~~~ts
function doSomething (f: Function){
  f(1)
}
~~~
这里就等同于

~~~js
function doSomething(f){
  f(1)
}
~~~

但是由于返回的是 any 可能造成问题应该使用 这样的方式

~~~ts
function doSomething(f: () => void){
  f(1)
}
// 函数的调用签名
interface Func{
  (sum: any):void
}
function doSomething(f: Func){
  f(1)
}
~~~

### 剩余参数 

> arguments 和 parameters 都可以表示函数的参数，由于本节内容做了具体的区分，所以我们定义 parameters 表示我们定义函数时设置的名字即形参，arguments 表示我们实际传入函数的参数即实参

~~~ts
function multiply(n: number, ...m: number[]){
  return m.map((x)=> n*x)
}
~~~

ts 会将剩余参数的类型隐式的设置为 any[] 而不是 any 设置具体类型必须是 Array<T> 或者 T[] 或者 元组


~~~ts
const arr1 = [1,2,3]
const arr2 = [4,5,6]
arr1.push(...arr2)
~~~

或者

~~~ts
const args = [8, 5];
const angle = Math.atan2(...args);
// 这里就会出现问题
~~~
需要使用 定长数组 - 元组 或者是 rest 参数 使用可变数组会抛错

解决方法 `const args = [8, 5] as const` 让其只读

### 参数结构
~~~ts
// js
function sum({a, b, c}){
  console.log(a + b + c)
}
sum({a: 10, b: 3, c: 9})

// ts
function sum({a, b, c}: {a: number, b: number, c: number}){
  console.log(a + b + c)
}

// 类似的
type ABC = {a: number; b: number; c: number}
function sum({a, b, c}: ABC){
  console.log(a + b + c)
}
~~~

### 函数的可赋值性

函数的返回值为 `void` 类型 会产生一些意料之外的的行为

~~~ts
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true
} 

// 但其实 f1 的返回值还是 void类型
~~~
再比如这个例子 它诠释了这种行为的好处
~~~ts
const arr1 = [1,2,3,4]
const arr2: number[] = []
arr1.forEach((ele)=>arr2.push(ele))
~~~
forEach 内部的箭头桉树返回一个数组 但是 forEach 方法返回的是 void 的类型 所以哪怕给 `forEach` 方法传入一个不是它所期待的函数 也能正常运行

> forEach 方法期待接收一个返回 void 的函数


### 函数类型表达式、类型别名、调用签名、函数重载 它们的关系可以异同

函数类型表达式： `function func (fn: ()=> void){}` 

语法： `()=>void` 

`类型别名`语法： `type Fn = () => void`；

使用 `function func (fn； Fn){}`

这两者很相似可以替换使用 具体点的分析就是后者可以多次重复使用这个 `type Fu` 类型

`调用签名`

~~~ts
interface Func {
  (str: string): void;
}

function pring(str: Func){}
~~~

使用方式上面类似于前二者 但是需要注意的是 这里使用的是 `:`  而不是 `=>` 

使用调用签名的好处是能够定义函数的属性 当接收的函数没有此属性的时候就会抛错 也是一种类型验证的手段

~~~ts
// 调用签名
interface Func {
  // 函数的属性
  describe: number,
  // 规定函数的参数和返回类型
  (str: string): void
}
~~~

`函数重载` 这个主要规定函数可以接收几个参数 通过先规定 `重载签名` + `实现签名` 的方式

~~~ts
// 重载签名
function makeDate(time: number): Date;
function makeDate(t: number, x: string, y: string): Date;

// 实现签名
function makeDate(T: number, x?: string, y?: string){
  if(x !== undefined && y !== undefined){
    return Date(T, x, y)
  }else{
    return Date(T)
  }
}
~~~
规定了函数使用参数的用法。 当一个函数需要接收一个或多个参数来调用的时候就可以使用这样的方式。



## 对象类型

一般作用于 函数接收一个对象为参数的情况 每个注解之间使用 `,` 或者 `;` 隔离
~~~ts
function (obj: {first: string; laster: number}){
  //....
}
~~~

可选属性 在属性后添加一个 `?` 代表属性可以没有 属性不存在它的值就是 `undefined` 
~~~ts
function (obj: {first: string; laster?: number}){
  // 使用的时候需要判断
  if(obj.laster !== undefined){
    console.log(obj.first + obj.laster);
  }
}
~~~

声明对象类型的三种方法

1、匿名对象

~~~ts
function greet (person: {name: string; age: number}){
  return "Hello" + person.name
}

~~~

2、接口定义

~~~ts
interface Person {
  name: string;
  age: number
}

functioon greet(person: Person){
  return "Hello" + person.name
}

~~~

3、类型别名

~~~ts
type Person = {
  name: string;
  age: number
}

function greet(person: Person){
  return "Hello" + Person.name
}
~~~

`readonly` 属性表示一个对象的中标记 readonly 属性是不能被写入的

~~~ts
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType){
  // 可以读取
  console.log(`prop has the vale ${obj.prop}`)
  // 不能写入
  obj.prop = "Hello"
}
~~~

readonly 其表明属性的本身是不能被重新写入的

~~~ts
interface Obj {
  age: 1;
  name: 'perter';
  something: {
    fun: ()=>{
      console.log(1)
    }
  }
}
function doSomething(obj: Obj)
{
  // 可以改变值
  obj.age ++;

  // 不能改变属性 抛出错误
  obj.something = {
    name: 1
  }
}
~~~

ts 在合并类型或者是否的兼容的时候并不会考虑类型 是否含有 `readonly` 属性 这个属性的值是可以通过别名修改的

~~~ts
interface Person {
  name: string;
  age: number;
}
 
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}
 
let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};
 
// 这个就相当于是不能在改变其属性的值了 --- 可以简单的理解为 冻结？
let readonlyPerson: ReadonlyPerson = writablePerson;

~~~

### 索引签名

有时候不知道一个类型的所有属性名 但是知道这些值的特征 可以利用这些特征来查找值

~~~ts
const arr1 = [1,2,3,4];
interface Arr1 {
  [index: number]: number;
}

const arr2 = function func(sum: Arr1){
  console.log(sum[1])
}
arr2(arr1)
~~~
这里就使用到了 `Arr1` 的索引签名

索引签名的属性必须是 string 或者是 number 类型 但数字索引返回的类型一定是字符索引返回类型的子类型

> 这是因为当使用一个数字类型进行索引的时候实际上是将其转为字符串

需要注意的是 当索引签名指定后 所有属性的返回类型要和索引签名的一致

~~~ts
interface Animal {
  name: string;
}
 
interface Dog extends Animal {
  breed: string;
}
 
interface NotOkay {
  [x: number]: Animal;
  // 这里出现问题
  [x: string]: Dog;
}

~~~
ts 可以同时支持 string 和 number 类型但数字索引返回的类型一定是字符串索引返回类型的子类型，这是因为当使用一个数字类型的时候 js 实际上会将其转换成一个字符串。

结合着例子来说 x 使用的 number 类型返回的类型 `Animal` 一定要是字符串 x: string 返回类型 `Dog` 类型的子类型 所以这里的意思是 `Animal` 是 `Dog`类型的子类型

参考这个[评论](https://ts.yayujs.com/handbook/ObjectTypes.html#readonly-%E5%85%83%E7%BB%84%E7%B1%BB%E5%9E%8B-readonly-tuple-types)

经过修改

~~~ts
interface Animal {
  name: string;
}
 
interface Dog extends Animal {
  breed: string;
}
 
interface NotOkay {
  [x: number]: Dog;
  [x: string]: Animal;
}
~~~

### 属性继承

~~~ts
interface BasicAddress {
  name?: string,
  street: string,
  city: string,
  country: string,
  postalCode: string
}

interface AddressWithUnit extends BasicAddress {
  unit: string
}
~~~

继承多个接口类型

~~~ts
interface Colorful {
  color: string
}

interface Circle{
  radius: number
}

interface ColorfulCircle extends Colorful, Circle {}
~~~

交叉类型

~~~ts
interface Colorful {
  color: string
}

interface Circle{
  radius: number
}

type ColorCircle = Colorful & Circle;
// ColorCircle 将会拥有这两者的所有属性
~~~

### 继承和交叉 的异同

继承和交叉都能继承属性但当产生冲突时
~~~ts
interface Colorful {
  color: string
}
interface ColorfulSub extends Colorful{
  // 这里就会抛出错误
  color: number
}
~~~
使用交叉类型去合并属性当出现这样的问题时候就不会有这样的错误
~~~ts
interface Colorful {
  color: string
}
type ColorfulSub = Colorful & {
  color: number
}
~~~
但是这个时候的 `color` 的类型为 `never` 也就是 `string` 和 `number` 的交集

### 泛型对象类型
~~~ts
interface Box<Type>{
  contents: Type
}
~~~
这样的好处就是 Box 就可以拥有多种类型

~~~ts
let box: Box<string> = {
  contents: "He"
}
~~~

类型别名也能使用泛型 

~~~ts
type Box<Type> = {
  contents: Type;
} 

~~~

### Array 类型

~~~ts
string [] === Array<string>

number[] === Array<number>
~~~
原因就在于 Array 是泛型的数据结构 类似的还有 Map<K, V> Set<T>, Promise<T>

### ReadonlyArray 类型

它描述的是不能改变的数组类型，当函数使用 ReadonlyArray 数组时候就表明了函数不会对数组做出修改可以放心使用

~~~ts
const nolengthArray: ReadonlyArray<string> = ["red", "green", "blue"]
~~~
也可以使用这样的写法 `readonly Type[]`

~~~ts
const nolengthArray: readonly string[] = ["1", "oo", "kk"]
~~~

值得注意的是`Array` 和 `ReadonlyArray` 两者不能双向赋值

~~~ts
let x: readonly string[] = ['a','b', 'c']

let y: string [] = ['string', 'true', '0']

x = y // 可以

y = x // 不可以
~~~



### 元组类型  Tuple Array

元素是另一种 Array 类型 当数组包含个数明确 每个位置的元素类型相同就可以使用元组类型

~~~ts
type StringNumberPair = [string, number]
~~~

获取元组长度之外的元素就会抛错

可以对其使用 数组结构语法

~~~ts
function doSometing(str: [string, number]){
  const [inputString, hash] = str;
  console.log(inputString)
  console.log(hash)
}
~~~

元组类型种可以原则一个可选属性，可选属性后必须放在最后，而且会影响到其长度

~~~ts
type Either = [number, number, number?];

function setCoordinate(coord: Either){
  // 这个时候 这个元组的长度就在 2-3 取决于参数 coord
  consst [x, y, z] = coord;
}
~~~

元素可以使用剩余语法 但必须是 array/tuple 类型

~~~ts
type StringNumberBoolean = [string, number, ...boolean[]];
~~~

### readonly 元组类型

~~~ts
const array = readonly [string, number] = ['hellow', 1]
~~~
大部分的情况下 元组只被创建，用完后也不会修改所以尽可能的将元组设置为 `readonly` 是一个好习惯

之前使用 `const arr = [3, 4] as const` 就是将数组转化成了 `readonly 元组`

需要注意的是
~~~ts
let x: readonly string[] = [];

x = ["a", '1']
~~~
这样使用不会报错 这符合 let 的性质 let 声明的变量可以进行二次的赋值操作 let 声明的是复杂类型 会在栈中保存在堆中开辟的用来存储复杂类型的地址。

> 一般在声明这些不可变的变量时候建议使用 const 语法
## 联合类型
联合类型通俗来讲就是多个类型的合并类型 

~~~ts
function printName (name: string | number){
  console.log(name)
}
~~~

联合类型是由多个类型组合的对每个类型也可以进行不同的操作 这个时候就要 `类型收窄`
> 当 TypeScript 可以根据代码的结构推断出一个更加具体的类型时，类型收窄就会出现。
~~~ts
function printName (name: string | number){
  if(typeof name === "string" ){
    console.log(name.slice(0,3))
  }else{
    console.log(Math.man(0, number))
  }
}
~~~

## 类型收窄
在上述的联合类型的例子中 ts 会分析静态类型的值在运算的具体类型，在 `if/else` 中 放入了`typeof name === "string"` ts 会认为这是一段特殊形式的代码，我们将其称之为 `类型保护` ts 会沿着执行可能的路径在分析值的给定位置上最具体的类型

ts 的类型检查器会考虑这些类型保护和赋值语句，将这个类型推导为更精确的类型的过程 我们称之为收窄

>typeof 操作符在很多 JavaScript 库中都有着广泛的应用，而 TypeScript 已经可以做到理解并在不同的分支中将类型收窄。

### 真值收缩

1、使用 `typeof` 进行多分支的判别

2、隐式的转化 

3、强制转换 `Boolean()`

4、`!!` 使用两个感叹号的类型转换

5、`!` 使用一个感叹号对结果取反

### 等值收窄

使用 switch 语句和等值检查比如 === !== == != 去收窄类型

### in 操作符收窄

JavaScript 中有一个 in 操作符可以判断一个对象是否有对应的属性名。TypeScript 也可以通过这个收窄类型。

~~~ts
type Fish = { swim: () => void }
type Brith = { sun: () => void }
function move(swim: Fish | Brith){
  if(swim in Fish){
    console.log('收缩')
  }
}

~~~

### instanceof 收缩
instanceof 也是一种类型保护，TypeScript 也可以通过识别 instanceof 正确的类型收窄

### 赋值语句
TypeScript 可以根据赋值语句的右值，正确的收窄左值。

~~~ts
let sum: string: number = 'name';

function printString(sum: : string | number){
  if(sum = 5){
    console.log(`${sum} 是 number 类型`)
  }else{
    console.log(`${sum} 是 string 类型`)
  }
}
~~~

### 控制流分析
基于`if else` 等条件控制语句的类型保护，当遇到类型保护和赋值语句 ts 就会采用这样的收窄类型，而这种方式是一个变量可以被观察到变为不同的类型

~~~ts
function padLeft(padding: number | string, input: string) {
  // 因为有了 `return` 语句就能通过代码分析判断出在剩余部分的类型
  if (typeof padding === "number") {
    return new Array(padding + 1).join(" ") + input;
  }
  return padding + input;
}
~~~


### 类型判断式

`type predicates` predicate 是一个能返回 `boolean` 的函数  

语法：`parameterName is Type` 这里 parameter 是这个函数的参数 Type 是一个类型别名 以此来去判断 参数是否符合类型别名

~~~ts
type Fish ={
  swim: () => void
}
function isFish(pet: Fish | Bird) : pet is Fish {
  return (pet as Fish).swim()
}
~~~

### 可判别的联合
~~~ts 
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

// 在这里使用

function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
~~~
如果开启了 `strictNUllChecks` 模式 就会导致错误 因为 ts 认为 shape 和 shape.radius 都有可能是 `null` 类型所以要对其处理一下

~~~ts
function getArea(shape: Shape) {
  if(shape && shape.radius){
    return Math.PI * shape.radius ** 2;
  }
}
~~~
或者使用非空断言来处理 对象的属性后缀一个`!`
~~~ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius! ** 2;
}
~~~
但是这样不太合适 既然开启了 `strictNullChecks` 就是要去做检查但是使用 `!`又去屏蔽了有些多余

~~~ts
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;

function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
~~~

但是这里还是不行 会出现问题 原因就在于 `Shape` 有可能是 Circle 接口的 所以检测不到 `radius` 属性这里还需要再去判别

但是这里只需要在加一个对 `kind` 的检测就能正确的使用了

~~~ts
function getArea(shape: Shape) {
  if(shape.kind === 'circle'){
    return Math.PI * shape.radius ** 2;
  }
}
~~~
这就能确保了 `Shape` 参数中存在 `radius`属性

当联合类型的每个类型都包含一个共同的自变量属性，ts 就会判断其为 `可辩别联合` 然后可以将具体成员的类型进行收窄

kind 就是可辩别属性 通过对 kind 校验可以确认参数的具体类型。因为`king` 属性是接口 `Circle` 和 `Square` 的主要判别因素 

### never 类型
当进行收窄的时候，如果你把所有可能的类型都穷尽了，TypeScript 会使用一个 `never` 类型来表示一个不可能存在的状态。

never 类型可以赋值给任何类型，然而，没有类型可以赋值给 `never` （除了 never 自身）。这就意味着你可以在 switch 语句中使用 never 来做一个穷尽检查。


### 穷尽检查

~~~ts

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

~~~
这样能穷尽了参数 `shape` 的可能性 使得 ts 在类型收窄都会对所有可能性进行判别

## 类型别名

当一个类型使用多次的时候 这个时候希望有一个单独的命名来指向它以此来重复的使用

~~~ts
type Point = {
  x: number,
  y: string
}

function printName (obj: Point){
  console.log(obj.x, obj.y)
}
printName({x: 11, y: 'str'})
~~~

你可以给这个别名任意的类型

~~~ts
type Id = number | string;

type UserNameID = string;

~~~

## 接口

接口可以看作是 对象类型的另外一种形式

~~~ts
interface Point {
  x: number,
  y: string
}
function printName (obj: Point){
  console.log(obj.x, obj.y)
}
printName({x: 11, y: 'str'})
~~~

## 类型别名盒接口的区分

类型别名无法添加新属性 而接口可以扩展

1、类型别名可以通过 `&` 交集的方式来扩展类型
~~~ts
type Point = {
  first: number
}


type Beat  = Point & {
  laster: string
}
~~~

每一次的定义都固定了不能再改变

2、接口可以继承来扩展类型
~~~ts
interface Animal {
  first: number
}

interface Beat extends Animal {
  laster: string
}
~~~

3、可以对已经存在的接口添加新属性

~~~ts
interface Point {
  first: number
}

interface Point {
  laster: string
}
~~~

这就等同于

~~~ts
interface Point {
  first: number,
  laster: string
}
~~~

## 类型断言

类型断言的使用方法是 `as`

~~~js
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
~~~

它会要求你的参数值和 a 的接口做一个对比判断是否一样 也就是于第三方做一个验证。可以阻止一些强制类型的转换

~~~ts
type O = number;
let a = 2
let b = a + ''
console.log(b as O)
~~~
这里就会出现错误 b 的类型显然被隐式转化了

## 字面量类型
除了常见的类型 string 和 number ，我们也可以将类型声明为更具体的数字或者字符串。

~~~ts
// 联合类型
type IsButton = true | false;
let x: IsButton = true;

// 字面量类型
let x: true | false = true;


function printText(target: 1 | 0 | -1){}

printTet(0)

// 抛出错误
printTet('ss')

function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
~~~

和非字变量类型结合

~~~ts
type obj  = {
  user: 'perter',
  age: 20
}
function printName(name: obj | 'name'){
  //...
}

~~~

## 字面量推断

当初始化变量为 一个对象

~~~ts
const a = {
  counter: 0
}
那么 ts 会推断其类型为 `number` 
~~~

同样的 再字符串中也是如此

~~~ts
const a = { math: 'GET'} 

function printA (math: "GET"){
  console.log(math)
}
printA(a.math)
// 出错
~~~

出错原因在于 对象 a 的属性 `math` 的类型为 `string` 而函数需要接收一个类型为 字变量类型为 `GET` 的属性两者不相等。

解决方法： 

1、添加一个类型断言改变推断结果

~~~ts
const a = { math: 'GET'} 

function printA (math: "GET"){
  console.log(math)
}

printA(math as a.math)
~~~

## null 或 undefined
JavaScript 有两个原始类型的值，用于表示空缺或者未初始化，他们分别是 null 和 undefined 。

TypeScript 有两个对应的同名类型。它们的行为取决于是否打开了 strictNullChecks 选项。

strictNullChecks 没被打开 当参数为 null 或者 undefined 都会成功运行 打开后将会严格检查 需要先对其进行检查

## 非空断言操作符

当你明确知道一个参数或者是变量不为空的时候你可以再其后添加一个 `！` 

~~~ts
let obj = {}
function printF(name){
  console.log(name!.toString());
}
printF(obj)
~~~

## 不常见的原始类型

`BigInt`
~~~ts
const str: bigInt = BigInt(100)
~~~~

`symbol`

~~~ts
const sym  = Symbol('symbol')
~~~


## 泛型类型
~~~ts
function identity<Type>(arg: Type): Type{
  return arg;
}
let myIdentity: <Type>(arg: Type) => Type = identity;
~~~

这里的 `<Type>(arg: Type) => Type` 就可以被称为泛型类型 使用它可以校验你的泛型函数的泛型是否正确

也可以使用 函数的调用签名

~~~ts
function identity<Type>(arg: Type):Type{
  return arg;
}

// 调用签名
let myIdentity: {
  <Type>(arg: Type): Type = identity
}
~~~

在某些时候需要将泛型参数作为整个接口的参数，可以清楚的知道传入的是什么参数。接口内的成员也能使用这个参数

~~~ts
interface GenericIdentityFn<Type>{
  (arg: Type): Type;
}

function identity<Type>(arg: Type){
  return arg
}
~~~
这里做出的改动是将 Type 类型放到了接口名的后面 这里不在描述一个泛型函数 二是一个非泛型函数作为泛型类型的一部分。

当使用 GenericIdentityFn 的时候需要明确给定参数，可以有效的锁定了调用签名的使用类型
~~~ts
const Funcidentity: GenericIdentityFn<number> = identity
~~~


### 泛型类
泛型类的写法类似于泛型接口，在类名后面使用 <> 包裹住类型参数列表
~~~ts
class Dog<Type> {
  version: Type;
  add: (x: Type, y: Type) => Type;
}

let useDog = new Dog<number> ();

useDog.version = 0;
useDog.add = function (x, y) {
  return x + y
}

~~~

将类型参数放在类上，可以确保类中所有属性都能使用相同的类型。

一个类的类型有两部分： 1、静态部分 2、实例部分

泛型类仅仅对实例部分生效，所以在使用类的时候注意静态成员并不能使用类型参数。

### 泛型约束

在这个例子中 想要获取参数的 arg.length 属性但是并不是所有类型都包括 .length 属性

~~~ts
function loggingIdentity<Type>(arg: Type): Type{
  console.log(arg.length)
  return arg
}
~~~

整个就不能使用 它会提示错误，要是能使用需要对其进行修改，让其使用带有 .length 属性的类型。只要类型有这个成员 我们就能允许使用 但必须有这个成员

~~~ts
interface Lengthwise {
  length: number
}
function logginIdentity<Type extends Lengthwise>(arg: Type): Type{
  console.log(arg.length)
  return arg
}
~~~

现在这个泛型函数被约束了，不在适合所有类型，它需要一个 具有 length 属性的对象

### 在泛型约束中使用类型参数
可以通过这个方法可以获得 obj 上存在的属性
~~~ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key){
  return obj[key]
}
~~~
### 在泛型中使用类类型
通过构造函数来推断出类的类型

~~~ts
class Beekeeper {
  hasMask: boolean = true
}

class ZooKeeper {
  nametag: string = "Mikle"
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: Beekeeper = new Beekeeper();
}

class Lion extends Animal {
  keeper: Zookeeper = new Zookeeper()
}

function createInstance<A extends Animal>(c: new() => A): A{
  return new c();
}
~~~

## keyof 类型操作符
对一个对象类型使用 `keyof` 操纵符，会返回该对象属性名组成的字符串或者数字字面量的联合
~~~ts
type Point = { x: number; y: number};
type P = keyof Point;
~~~

这个 `P === "x" | "y"`

但如果这个类型有一个 `string` 或者 `number` 类型的索引签名 `keyof` 就会直接返回这些类型

~~~ts
type Arrayish = { [n: number]: unknow }
type A = keyof Arrayish
// type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish
// type M = string | number
~~~

这是因为 js 对象的属性名会被强者转为 字符串 所以 属性名为 string 的前身也可能是 number 类型。

> 总结：keyof 主要返回的是 对象属性名 或者是对象属性类型

### 数字字面量的联合类型

~~~ts
const NumbericObject = {
  [1]: "333",
  [2]: "boo",
  [3]: "gggg"
}

type result = keyof typeof NumbericObject
// result = 1 | 2 | 3 
~~~

### Symbol 

ts 也支持 symbol 类型的属性名

~~~ts
const sym1 = Symbol()
const sym2 = Symbol()
const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 3
}
type KS = keyof typeof symbolToNumberMap;
// KS = sym1 | sym2
~~~

处理所有的属性名

~~~ts
function useKey<T, K extends keyof T> (O: T, k: K){
  var name: string | number | symbol = k
}
~~~

### 类和接口

对类使用 keyof 

~~~ts
class Parson {
  name: "hh"
}

type result = keyof Parson
// result = "hh"
~~~

~~~ts
class Parson {
  [1]: string = "ssss"
}

type result = keyof Parson
// result = 1
~~~

对接口使用 `keyof`

~~~ts
interface Person {
  name: "sss"
}

type result = keyof Person
// result = "name"
~~~

### typeof 类型操作符

ts 中的 `typeof` 方法可以在类型上下文中使用，用于获得一个变量或者属性的类型

~~~ts
let a = "str";
let n: typeof a
// n type = string
~~~

### ReturnType 
传入一个函数类型， ReturnType<T> 就会返回这个函数的返回值类型
~~~ts
type Predicate = (x: unknown) => boolean;
type x = ReturnType<Predicate>;
// x = boolean
~~~

当这样使用的时候就会产生错误

~~~ts
function f(x: string){
  return {x: 1}
}

type x = RetrunType<f>
// 这里就会产生错误
~~~

值和类型并不相同 可以看到 function f () {} 代表的是一个函数而 `ReturnType<T>` 所期待的是一个类型所以会抛出错误

解决方法：

~~~ts
type x = ReturnType<typeof f>
~~~

对对象使用 tyepof 

~~~ts
const person = {nam2: "kevin"}
type Kevin = typeof person
~~~

对函数使用 typeof 

~~~ts
funtion identity<Type>(arg: Type): TYpe{
  return arg
}

type result = typeof identity
~~~

### 对 enum 使用 typeof 
~~~ts
enum UserResponse {
  No = 0, 
  Yes = 1,
}

type result = typeof UserResponse;
~~~

### 索引访问类型

可以使用索引访问类型查找另一个类型上的特定属性

~~~ts
type Person = { age: number; name: string; alive: boolean}
type Age = Person["age"]

type I1 = Person["age" | "name"]
type I2 = Person[keyof Person]

~~~
使用字面量元素类型 
~~~ts
const MyArray = [
  {name: "Alice", age: 14},
  {name: 'per', age: 2}
]
// 获得数组的类型
type myArray = typeof MyArray

// 获得数组字面量的元素类型
type Age = typeof MyArray["age"]
~~~

作为索引的只能是类型 不能通过 const 创建一个变量来去引用

~~~ts
const a = "alice";
const obj = {
  alice: 'aaaa',
}
// 这里就会出现问题
type Person = typeof obj[a]
~~~

类似的案例


~~~ts
const App = ["To","Bo","Co"] as const;
type app = typeof App[number]

// app = To | Bo | Co
~~~

这里使用 `as const` 主要是将 数组中每个值的类型都赋予一个字面量类型 `To` `Bo` `Co`等之类的

然后在通过索引访问类型 配合使用 `typeof` 去获取他们的类型



### 条件类型

条件类型就是帮助我们描述输入类型和输出类型的之间的关系

~~~ts
interface Animal {
  live(): void;
}

interface Dog extends Animal {
  woof(): void
}

type Example = Dog extends Animal ? number : string;
~~~

类似的这种
~~~ts
interface IdLabel {
  id: number
}

interface NameLabel {
  name: string
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel{
  //.....
}
~~~

这里多次创建了函数的重载 用来确定函数中传入参数的类型对应相应的执行代码

这里可以使用条件类型来去简化

~~~ts
type NameOrId<T extends number | string> = T extends number? IdLabel : NameLabel;
~~~

~~~ts
function createLabel <T extends number | string> (idOrName: T) : NameOrId<T> {
  //....
}
~~~

### 条件类型约束

`条件类型约束` 的用途和 `类型保护` `收窄类型` 差不多都是进一步的收缩小类型能够确定一些更具体的类型

~~~ts
type MessageOf<T> = T["message"];
// 这里就会使用错误 ts 不能确定 T 是否有 message 属性
~~~

可以约束 T 

~~~ts
type MassageOf<T extends {message: unknown}> = T["message"]

interface Email {
  message: string
}

type EmailyMassage = MassageOf<Email>
~~~


或者

~~~ts
// 这里用到了 T[number] 用来获取数组中的类型
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>;

trpe Num = Flatten<number>

~~~

用 number 来获取数组元素的类型  `T[number]`

### 在条件类型中推断
`infer` 关键词可以从正在比较类型中推断类型在 true 分支中引用该推断结果

~~~ts
type Flstten<Type> = Type extends Array<infer Item> ? Ttem : Type

~~~

这里就是使用了 infer 声明了一个变量 `Item` 这个变量会根据你传入的 Type 类型去推断

~~~ts
type TTuple = [string, number]
type Resolve = Flstten<TTuple> 
// Resolve = string | number
~~~
还有一个例子
~~~ts

// 获取参数类型
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;
 
// 获取实例类型
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;
 
class TestClass {
 
  constructor(
    public name: string,
    public string: number
  ) {}
}
 
type Params = ConstructorParameters<typeof TestClass>;  
// [string, numbder]
 
type Instance = InstanceType<typeof TestClass>;         
// TestClass
~~~

感觉 infer 需要你去手动传入一个类型 这个类型的会被分解成多个 比如`(arg: number)=> void` 这里面就有 参数注解、 以及函数返回类型  通过比对 infer 与其 Type 的位置来自动的获取类型 所以 `infer` 会有自动推断类型的能力。



当从多重调用签名中推断类型的时候就会按照最后的签名进行推断，这个签名是用来处理所有情况的签名




### 分发的条件类型
在泛型使用条件类型的时候，传入一个联合类型，就会变成分发

~~~ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumberArr = ToArray<string | number>;
// type StrArrOrNumberArr = string[] | number[]
~~~

如果要避免这种情况可以使用 [] 将 Type 包裹起来

~~~ts
type ToArray<Type> = [Type] extends [any] ? Type[] : never;

type StrArrOrNumberArr = ToArray<string | number>;
// StrArrOrNumberArr = (string | number)[]
~~~



## 映射类型

解决的问题：当一个类型基于另一个类型，不想在拷贝就要考虑使用 映射类型

映射类型建立在索引标签的语法上
~~~ts
// 索引类型
type OnlyBoolsAndHorse = {
  [key: string]: boolean | unknow;
}

// 映射类型
type Options<Type> = {
  [Property in keyof Type]: boolean;
};
~~~

映射类型就是使用 `PropertyKeys` 的联合类型的泛型 其中 PropertyKeys 多是通过 keyof 创建，然后循环遍历键名创建一个类型
~~~ts
type Options <Type> = {
  [Prototy in keyof Type]: boolean
}

type FeatureFlags = {
  darkMode: ()=> void;
  newUserProfile: () => void;
}
// 遍历所有的属性 类型为 boolean
type FeatureOptions = Options<FeatureFlags>
// FeatureOptions{
//  darkMode: boolean
//  newUserProfile: boolean  
//}
~~~

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

~~~ts
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
~~~


2、删除可选属性

~~~ts
type CreateMutable<Type> = {
  [Prototy in keyof Type]-?: Type[Prototy]
}

type Locked = {
  id?: "88888";
  name?: "Per"
}

type User = CreateMutable<Locked>

type CreateMutable<Type> = {
  [Prototy in keyof Type]-?: Type[Prototy]
}

type Locked = {
  id?: "88888";
  name?: "Per"
}

type User = CreateMutable<Locked>

// type User = {
//     id: "88888";
//     name: "Per";
// }
~~~

### 通过 as 实现从新映射

使用 as 语句实现键名的重新映射

~~~ts
type MappedType<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties]
}
~~~

`NewKeyType` 可以理解为是一个新的参数名


~~~ts
type MappedType<Type> = {
  // 注意这里的 <string&Properties> 这里是确保是 Type 的属性且为 string 的
  [Properties in keyof Type as `get${Capitalize<string&Properties>}`]: () => Type[Properties]
}

interface Person {
  name: string;
  age: string
}

type LazePerson = MappedType<Person>

type S = string&number

~~~



使用实例：

1、根据对象是否有属性来返回 true 或者 false

~~~ts
type ExtractPII<Type> = {
  [Property in keyof Type ]: Type[Property] extends { pii: true }? true : false 
}

interface Dog {
  id: {format: 'ss'};
  name: {type: string, pii: true}
}

type ObjectGdp = ExtractPII<Dog>
// {
//    id: false;
//     name: true;
// }
~~~

## 模板字面量类型 

只能在类型操作中使用，跟 JavaScript 的模板字符串是相同的语法

当模板中的变量是一个联合类型的时候，每一个可能的字符串字面量都会被表示

~~~ts
type Emial = "Perter" | "Heeo";

type Forter = "WWW.ddd" | "UYUY";

type AllLocalIds = `${Emial | Forter}_ID`
// type AllLocalIds = "Perter_ID" | "Heeo_ID" | "WWW.ddd_ID" | "UYUY_ID"
~~~

如果模板自变量的多个变量都是联合类型结果会交叉结合 穷尽所有的可能性


### 类型中的字符串联合类型


打算实现一个这样的例子 on 函数会接受 一个 属性并在后加上 "Change" 回调函数中接收该属性的类型
~~~ts
const person = markeWatcheObject({
  firstName: "san";
  lastName: "Ron";
  age: 33
})


person.on("firstNameChanged", (newValue)=>{
  console.log(`...${newValue}`)
})
~~~
实现
~~~ts
Object.keys(passedObject).map(x=>`${x}Changed`)

type PropEventSource<Type> = {
  // 这里 {string & keyof Type} 取的交集 确保属性是 Type 类型的且类型为 string
  on(eventName: `${string & keyof Type}Change`, callback: (newValue: any) => void);

}
// 或者这样

type ProEventSource<Type> = {
  on(eventName: `${Extract<keyof Type, string>Change}`, callback: (newValue: any)=> void): void
}


~~~

现在来实现回调函数接收的参数的问题 传入的参数和对应的属性的类型相同

~~~ts
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

~~~

具体的可以参考这里 [模板字面量类型-实例](https://ts.yayujs.com/handbook/TemplateLiteralTypes.html#%E6%A8%A1%E6%9D%BF%E5%AD%97%E9%9D%A2%E9%87%8F%E7%9A%84%E6%8E%A8%E6%96%AD-inference-with-template-literals)




内置的字符操作类型

`Uppercase`: 每个字符转大写

~~~ts
type Strgetting = "Hello, word";
type ShoutyGreeting = Uppercase<Strgetting>;

type AsKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = AsKey<"my-app">
~~~


`Lowercase`: 每个字符转为小写

`Capitalize`: 每个字符的第一个字符转为大写形式

`Uncapitalize`: 每一个字符的第一个字符转换未小写形式


## 类
定义一个类
~~~ts
class Point {}
~~~

一个字段申明会创建一个公共的可写入的属性

~~~ts
class Point {
  x: number;
  y: number;
}
~~~
当类型注解没有指定时 会隐式的设置为 any 指定初始值后会自动推断其类型并设置

Initilization: 含义就是初始化

`strictPropertyInitialization`的配置选型控制是否在构造函数中初始化 开启后会检查不符合会抛错

~~~ts
class Point {
  // 未被初始化 抛错
  x: number
}

~~~
需要注意的是： 字段的初始化是要在构造函数中进行初始化， Ts 不会分析构造函数中你调用的方法，进而判断初始化的值。以下的方式就会抛错

~~~ts
class Point {
  // 出现问题 未被初始化
  x: number;

  constructor(){
    this.setName()
  }

  setName(){
    this.x = 0;
  }
}

~~~

当你未开启 `strictPropertyInitialization` 就不会出现这个错误。

不过也可以使用 `!` 非空断言操作符去判断

~~~ts
class Point {
  // 这样表示 x 不可能是 null 或者 undefined 类型
  x!: number
}
~~~

`readonly`：在字段前加上这样的修饰符，会阻止在构造函数之外赋值 

~~~ts
class Point {
  readonly name: string = 'word';

  constructor (otherName?: string){
    if(otherName !== undefined){
      this.name = otherName
    }
  }

  err() {
    // 这里就使用错误 
    this.name = "not"
  }
}

~~~

### 类构造函数
类的构造函数近似于函数 可以使用类型注解，默认值，重载等
~~~ts
class Point {
  x: number;
  y: number;

  constructor (x: 0, y: 0){
    this.x = x;
    this.y = y;
  }
}


// 或者

class Point {
 constructor(x: number, y: string);
 constructor(str: string);
 constructor(sx: any, y?: any){
   //....
 }

}
~~~

构造函数和函数签名之间的区别

1、构造函数不能有类型参数

2、构造函数不能有返回类型注解，因为总是返回类实例类型。


super 调用 详细内容可以参考 js 的语法
~~~ts
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // 使用 this 之前必须调用一次 this  

    // class 的继承的其内部不存在 this 需要调用一次基类的构造函数后才会有 this 
    super()
  }
}

~~~

[摘自](https://es6.ruanyifeng.com/#docs/class-extends)

> 为什么子类的构造函数，一定要调用super()？原因就在于 ES6 的继承机制，与 ES5 完全不同。ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”。ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”。这就是为什么 ES6 的继承必须先调用super()方法，因为这一步会生成一个继承父类的this对象，没有这一步就无法继承父类。


### 方法

类中的函数属性被称为方法 方法和函数、构造函数一样可以使用类型注解

~~~ts
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}

~~~
在方法中使用一个未限定的名称，，会指向闭包作用域里面的内容

~~~ts
let x: number = 0;

class Point {
  x: string = "Hello";

  m() {
    console.log(x)
  }
}


let point = new Point();
point.m()
// 0
~~~

Getter / Setter

~~~ts
class Point {
  _length = 0;
  get length() {
    return this._length;
  }

  set length(value) {
    this._length = value;
  }
}

~~~
特殊的推断规则：

1、get 存在 set 不存在 属性就是 readonly 类型

2、setter 参数类型没有指定就是 getter 的返回类型

3、getter 和 setter 必须有相同的成员可见性


索引签名

~~~ts
class MyCalss {
  [s: string]: boolean | ((s: string) => boolean)

  check(s: string){
    return this[s] as boolean;
  }
}

~~~



### 类继承
js 的类可以继承 基类

使用 `implements` 语句 可以检查一个类是否满足特定的 interface 
~~~ts
interface Pingable {
  ping(): boolean;
}


class Point implements Pingable {
  ping() {
    return 1
  }
}

class Bell implements Pingable {
  // 这个时候就出现了问题  Bell 中没有 ping 这个函数
  pong() {
    console.log('ssss')
  }
}
~~~

主要注意的是 `implements` 并不会改变类的类型或者方法的类型。

implements 语句仅仅检查类是否按照接口类型实现

~~~ts
interface Checkable {
  check(name: string): boolean;
}


class NameChecker implements Checkable {
  check(s){
    // 这里的使用错误就是 误以为 s 还是 string 类型
    // implements 不会去继承 interface 声明类型的参数或者方法 
    // 需要自己重新定义才行 

    // implements 只会去检查是否有 check 这个函数和返回类型是否存在
    console.log(s.toLowercse() === "OK" )
  }
} 
~~~

一个有可选属性的接口在使用 `implements` 的时候不回去创建这个属性

~~~ts
interface A {
  x: number;
  y?: number
}

class C implements A {
  x = 0;
}

const c = new C();


// 这就出现问题 没有y 这个属性
c.y = 10
~~~

`extends` 语句

使用`extends` 可以继承其所有的属性和方法，在其基础上还能定义其他成员


extends  `基类` 是用作继承 `派生类`是继承 基类的类

~~~ts
class Bell {
  move() {
    console.log('sss')
  }
}

class Dog extends Bell {
  buid() {
    console.log(0)
  }
}

const d = new Dog()
d.move();
d.buid();
~~~

派生类可以覆盖继承的基类的方法或者属性，可以使用 super 语法访问基类

而且还可以通过 基类的引用指向一个派生类的实例

~~~ts
const b: Base = d;
b.move
~~~

派生类可以覆盖原来基类的方法或属性但是要遵循基类的实现方式

~~~ts
class Bell {
  buid() {
    console.log('sss')
  }
}

class Dog extends Bell {
  // 这里就会出现问题
  // Bell 类的buid 没有指定一个参数 
  buid(name: string) {
    console.log(name)
  }
}
~~~

### 成员可见性

`public`:  类成员的默认可见性为 `public` 可以在任何地方被获取 `public` 是默认的可见性修饰符，你不需要写它

`protrcted`: 仅仅只对子类可见
~~~ts
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}
 
class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK

// 这里获取不到 抛出错误
g.getName();
~~~

派生类需要遵循基类的实现，但是依然可以选择公开拥有更多能力的基类子类型，这就包括让一个 protected 成员变成 public：

~~~ts
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
~~~

来看看令人疑惑的语法问题

~~~ts
class Bass {
  protected x: number = 1;
}

class Derived1 extends Base {
  protected x: number = 5;
}

class Derived2 extends Base {
  f1(other: Derived2){
    other.x = 10
  }

  f2(other: Derived1){
    // 这里就会出现问题
    other.x = 20
  }
}
~~~
Derived1 中的 protected 成员只能通过 Derived1 或者其子类才能访问 通过 Derived2 来获取 Derived1 protected成员 显然不合法

所以在 Derived2 获取 Base 上的 protected 成员也不合法。

`private` 类似于 `protected` 但是不允许访问成员，即便是子类 意思代表私有的不可见的


ts 允许交叉实例获得私有成员

~~~ts
class A {
  private x = 10;

  public sameAs(other: A){
    return other.x === this.x
  }
}
~~~

> private和 protected 仅仅在类型检查的时候才会强制生效。在js 中运行的时候不会可以获取到


~~~ts
class MySafe {
  private secreKey = 12345
}


const s = new MySafe();
~~~


`private` 可以通过 `[]` 语法来进行访问 这样做的好处使其不是强制私有


~~~ts
class MySafe {
  private secreKey = 12345
}


const s = new MySafe();
// 可以访问
s["secreKey"]
~~~

js 的私有话即使是编译后还是保留私有性 `#`

~~~js
class MySafe {
  #secreKey = 12345
}

~~~
### 静态成员

类可以有静态成员，类的静态成员和实例无关可以通过类名获取

~~~ts 
class MySafe{
  static x = 0;
  static func = ()=>{
    console.log(MySafe.x)
  }
}

~~~

静态成员可以有 `public`、`protected` 和 `private`

~~~ts
class MyClass {
  private static x = 0;
}

console.log(MyClass.x)

~~~
静态成员可以被继承






## 模块

类型可以像 JavaScript 值那样，使用相同的语法被导出和导入：

~~~ts
export type Cat = {  break: number; name: string}
export interface Dog {
  breeds: string[],
  yearBirch: number
}

~~~