// 题目： ['a', 'b', 'c'] == > {a: {b: c: 'xxx'}}
// type TubleToNestedObject<['a', 'b', 'c'], 'xxx'> ==> {a: {b: c: 'xxx'}}

type TubleToNestedObject<Arr extends unknown[], Item> = 
  Arr extends [infer First, ...infer Rest] 
    // 这里的 Key extends keyof any ? Key : never 
    // 可以避免 key 为 null or undefined 的情况 并且 key也符合 string | number | symbol   
    ? {[Key in First as Key extends keyof any ? Key : never]: TubleToNestedObject<Rest, Item>}
    : Item

type testTuble = TubleToNestedObject<['a', 'b', 'c'], 'ccc'>