// 题目：'a=1&b=2&c=3' => {a: 1, b: 2, c: 3}

// 第一步：将 'a=1&b=2&c=3' 转为[[a, 1], [b, 2], [c, 3]]
type ParseQueryString<Str extends string, arr extends unknown[] = []> = 
  Str extends `${infer Left}&${infer Rest}`
   ? Left extends `${infer Variable}=${infer Result}`
     ? ParseQueryString<Rest, [[Variable, Result], ...arr]>
     : arr
   : Str extends `${infer Last}=${infer Value}`
     ? ParseQueryString<'', [[Last, Value], ...arr]>
     : arr 
type parse = ParseQueryString<'a=1&b=2&c=3'>

// 第二步：将 [[a, 1], [b, 2], [c, 3]] ==> {a: 1, b: 2, c: 3}
type ArrayToObj<T extends unknown[], Obj extends Record<string, any> = {}> = 
  T extends [infer Target, ...infer Rest] 
   ? Target extends [infer Variable, infer Value]
     //                -Z- 这里将对象组装再一起 
     ? ArrayToObj<Rest, CombineObj<{[K in Variable & string]: Value}, Obj>>
     : Obj
   : Obj 

// 组装对象
type CombineObj<Obj extends Record<string, any>, OtherObj extends Record<string, any>> = {
  [Key in keyof Obj | keyof OtherObj]: 
    Key extends keyof Obj
      // Key 属于 Obj && OtherObj 
      ? Key extends keyof OtherObj 
        ? MergeValues<Obj[Key], OtherObj[Key]>
        : Obj[Key]
      // Key 属于 OtherObj 
      : Key extends keyof OtherObj
        ? OtherObj[Key]
        : never
}

// 合并 value 
type MergeValues<A, B> = 
  A extends B 
    ? A 
    : B extends unknown[]
      ? [A, ...B]
      : [A, B]

// 最后
type com = ArrayToObj<parse>