// 'a' | 'b' | 'c' ==> ['a', 'b', 'c']
type UnionTOIntersection<U> = 
  (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
    ? R 
    : never 
type UnionFuncIntersection<T> = UnionTOIntersection<T extends any ? () => T : never>


type UnionToTuple<T> = 
  // 联合类型转交叉类型  然后将交叉类型的 函数重载
  // (() => "a") & (() => "b") & (() => "c") extends () => T 
  // 能够取出交叉类型的最后一个的返回值 c
  UnionTOIntersection<T extends any ? () => T : never> extends () => infer ReturnType
  // 让 c 从 'a' | 'b' | 'c' 中排除
  ? [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType]
  : []


type Result = UnionToTuple<'a' | 'b' | 'c'>

