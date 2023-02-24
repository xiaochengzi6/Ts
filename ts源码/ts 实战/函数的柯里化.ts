// function currying(xxx) => (a: string) => (b: number) => (c: boolean) => void

// 函数的参数决定返回的值

type CurriedFunc<Params, Return> =
  Params extends [infer Arg, ...infer Rest] 
   ? (arg: Arg) => CurriedFunc<Rest, Return>
   : never 

declare function currying<Func>(fn: Func) : 
  Func extends (...args: infer Params) => infer Result ? CurriedFunc<Params, Result> : never 


// (arg_1, arg_2, arg_3) => (arg_1) => (arg_2) => (arg_3) => void

// js 
function currying(fn) {
  
}                              