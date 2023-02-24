## ts 中的 *.d.ts 文件是做什么的
*.d.ts 文件是指类型定义文件，js 库也能支持定义静态类型

大部分 npm 库是由 js 编写的，直接去引用会导致出现“没有找到类型定义”的错误，d.ts 文件就是向 ts 文件提供了有关于 js 编写的 Api 的类型定义，现在使用的是 @types 方式， ts 会默认查看 ./node_modules/@types 文件夹，任意层的 ./node_modules/@types 都会被使用，也可以使用 `tsconfig.json` 的 `typeRoots` 来配置

~~~json
{
  "compilerOptions": {
    "typeRoots": ["./typeing"]
  }
}
~~~
现在是只能使用 `./typeing` 下的类型定义文件，./node_modules/@types 不会再使用

如果配置了 `types` 那么只会使用你罗列出来的配置文件，其他的都会被忽视


~~~json
{
  "compilerOptions": {
    "typs": ["node", "lodash"]
  }
}
~~~

## d.ts 文件的编写语法

1. common.js 规范【有待验证】

~~~ts
// index.d.ts
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}


// or main.d.ts 
declare module "ever" {
  export function b (): number
  export const a: string
}
~~~

2. es6 的模块方法【有待验证】

~~~ts
export declare let name: 1
export function add(x: number): string
~~~


使用 namespace 去定义类型
~~~ts
let result = mylib.makeGreeting('hello, world')
console.log("llll")
let count = mylib.numberOfGreetings


// *.d.ts
declare namespace mylib {
  function makeGreeting(s: string): string
  let numberOfGreetings: number
}
~~~

使用函数重载
~~~ts
let x: Widget = getWidget(43)
let arr: Widget = getWidget("all of them")


// *.d.ts
declare function getWidget(x: number): number
declare function getWidget(x: string): string[]

~~~

重用类型
~~~ts
greet({
  greeting: "hellow, word",
  duration: 40000
})

// *.d.ts
interface GreetingSetting {
  greeting: string
  duration: number
  color: string
}
declare function greet(setting: GreetingSetting): void
~~~

使用 type 去定义类型
~~~ts
// documentation: Anywhere a greeting is expected, you can provide a string, a function returning a string, or a Greeter instance.

function greeting(){
  return "llll"
}
class MyGreeter extends Greeter {}

greet("hellow")
greet(greeting)
greet(new MyGreeter())


// *.d.ts
type GreetSetting = string | () => string | Greeter
declare function greet(x: GreetSetting): void

~~~

组织类型

~~~ts
// 这里还是有些蒙 还需要再看看 别的库是怎么组织的代码结构
const g = new Greeter("hello")
g.log({ verbose: true})
g.alert({ modal: false, title: "current greeting"})

// 1. *.d.ts
declare namespace GreetingLib{
  interface log {
    verbore: boolean
  }

  interface alert {
    modal: boolean
    title: string
    color: string
  }
}



// 之前如果使用了 namespace GreetingLib 还可以继续创建一个嵌套形式的命名空间 类如 namespace GreetingLib.Options
// 2. *.d.ts
declare namespace GreetingLib.Options {
  interface log {
    verbose: boolean
  }
  interface alert {
    modal: boolean
    title?: string
    color?: string
  }
} 
~~~

针对 class 类型的声明
~~~ts
class Greeter {
  constructor(text){
    this.text = text 
  }
  log(obj){
    console.log(obj)
  }

  alert(obj){
    const {modal, title, color} = obj
    console.log(modal, title, color)
  }
}

// *.d.ts
declare class Greeter {
  constructor(text: string)

  log(obj: number): void

  alert(obj: {modal: number, title: string, color: stringf}): void
}
~~~

全局变量可以通过 declare var / const / let 来声明

~~~ts
declare var foo = "hellow, word"
~~~

全局函数也同样
~~~ts
declare function add (x: string): string
~~~

还有一些常见的[语法](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html)



declare var       声明全局变量

declare function  声明全局方法

declare class     声明全局类

declare enum      声明全局枚举类型

declare namespace 声明全局对象

interface和type   声明全局类型


export namespace  导出（含子属性的）对象

export defaultES6 默认导出

export =commonjs  导出模块

export as namespaceUMD 库声明全局变量

declare global         扩展全局变量

declare module扩展模块

使用这个语法 `/// <reference />三斜线指令` 可以去访问其他文件


看起来很奇怪的写法 `export = _` 当时是在看 @types/underscore 时候发现的
~~~ts
// 当 esModuleInterop: true 时候你才能使用 export default _ 不然你就使用 过时的写法 export = _ 不过这样的写法在哪里都能被兼容 
// Note that using export default in your .d.ts files requires esModuleInterop: true to work. If you can’t have esModuleInterop: true in your project, such as when you’re submitting a PR to Definitely Typed, you’ll have to use the export= syntax instead. This older syntax is harder to use but works everywhere. Here’s how the above example would have to be written using export=:

export = i_


// 例子：
function getArrayLength(arr) {
  return arr.length;
}
getArrayLength.maxInterval = 12;
module.exports = getArrayLength;

// *.d.ts
declare function getArrayLength(arr: unknown[]): number
declare namespace getArrayLength {
  declare const maxInterval: 12
}

// 也是 commonjs 规范的导出方式
export = getArrayLength
~~~

~~~ts
// 这种导出方式适合于 umd 的导出方式 

export as namespace _;
~~~

还有就是 什么时候使用  namespace 和 module 这个需要注意
namespace 相当于是一个 IIFE 包裹起来的单独作用域，这样的作法可以减少全局作用域的污染，一般内部模块通常使用 namespace 称为 内部空间，外部模块使用 module 称为 模块

lodash 中 index.d.ts 中使用 三斜线表达式去引入多个文件，这样文件都是对 index.d.ts 的扩展

~~~ts
// index.d.ts
/// <reference path="./common/function.d.ts" />



// ./count/function.d.ts
declare module "../index" {
  //....
}

命名空间 `namespace` 也是这样的方式
~~~ts
// index.d.ts
namespace Validate {
  interface ToParamterType {
    name: string
    color: string
  }
}

// comment.d.ts
/// <reference path="./index.d.ts" />
namespace Validate {
  interface ToReturnType {
    name: string
    age: number
  }
}
~~~

## 类型声明和变量声明


## 参考文章
[1](https://juejin.cn/post/6987735091925483551#heading-4)

[2]()

[3]()

[4]()