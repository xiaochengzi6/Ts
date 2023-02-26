// 比如从 guang-and-dong 转换成 guangAndDong。
type KebabCaseToCamelCase<Str extends string> = 
  Str extends `${infer Target}-${infer Rest}`
    ? `${Target}${KebabCaseToCamelCase<Capitalize<Rest>>}`
    : Str 

// 反转 
type CamelCaseToKebabCase<Str extends string> = 
  Str extends `${infer Left}${infer Rest}`
    ? Left extends Lowercase<Left> 
      ? `${Left}${CamelCaseToKebabCase<Rest>}`
      : `-${Lowercase<Left>}${CamelCaseToKebabCase<Rest>}`
    : Str 

type getCamelCaseStr = CamelCaseToKebabCase<'guangAndDongVueHellow'>

 // const res = join('-')('guang', 'and', 'dong');
// 'guang-and-dong'

declare function joins<
  Delimiter extends string
>(delimiter: Delimiter):
  <Items extends string[]>
    (...parts: Items) => JoinType<Items, Delimiter>

type JoinType<Items extends unknown[], Delimiter extends string, Result extends string = ''> =
  Items extends [infer First, ...infer Rest]
   ? JoinType<Rest, Delimiter, `${Result}${Delimiter}${First & string}`>
   : RemoveFirstDelimiter<Result>

type RemoveFirstDelimiter<Str extends string> = 
  Str extends `${infer _}${infer Rest}`
    ? Rest 
    : Str 


const a = joins('-')('guang', 'and', 'dong') 


// 题目；合并
type A = {
  aaa: 111
  bbb: 222
}

type B = {
  bbb: 222
  ccc: 333
}

type Defaultize<Obj extends Record<string, any>, OtherObj extends Record<string, any>> = 
  & Pick<Obj, Exclude<keyof Obj, keyof OtherObj>>
  & Partial<Pick<Obj, Extract<keyof Obj, keyof OtherObj>>>
  & Partial<Pick<OtherObj, Exclude<keyof OtherObj, keyof Obj>>>

type Copy<T> = {
  [Key in keyof T]: T[Key]
}

type getDefaulting = Copy<Defaultize<A,B>>