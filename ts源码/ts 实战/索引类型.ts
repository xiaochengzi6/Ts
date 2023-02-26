// 题目： ['a', 'b', 'c'] == > {a: {b: c: 'xxx'}}
// type TubleToNestedObject<['a', 'b', 'c'], 'xxx'> ==> {a: {b: c: 'xxx'}}

type TubleToNestedObject<Arr extends unknown[], Item> = 
  Arr extends [infer First, ...infer Rest] 
    // 这里的 Key extends keyof any ? Key : never 
    // 可以避免 key 为 null or undefined 的情况 并且 key也符合 string | number | symbol   
    ? {[Key in First as Key extends keyof any ? Key : never]: TubleToNestedObject<Rest, Item>}
    : Item

type testTuble = TubleToNestedObject<['a', 'b', 'c'], 'ccc'>


// 题目: {aaa_bbb: 1} ==> {aaaBbb: 1}
type DeepCamelizeRes<Obj extends Record<string, any>> = 
 Obj extends unknown[] 
   ? CamelizeArr<Obj>
   : {
  [Key in keyof Obj as 
    Key extends `${infer Left}_${infer Right}`
      ? `${Left}${Capitalize<Right>}`
      : Key 
  ]: DeepCamelizeRes<Obj[Key]>
}

type CamelizeArr<Arr extends unknown[]> = 
  Arr extends [infer First, ...infer Rest]
    ? [DeepCamelizeRes<First& string>, ...CamelizeArr<Rest>]
    : []
type obj = {
    aaa_bbb: string;
    bbb_ccc: [
        {
            ccc_ddd: string;
        },
        {
            ddd_eee: string;
            eee_fff: {
                fff_ggg: string;
            }
        }
    ]
}

type getObValue = DeepCamelizeRes<obj>


// 题目： 取出索引类型的属性
type Obj = {
    a: {
        b: {
            b1: string
            b2: string
        }
        c: {
            c1: string;
            c2: string;
        }
    },
}

type GetObjectPath<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: 
    Key extends string 
      ? Obj[Key] extends Record<string, any>
         ? Key | `${Key}.${GetObjectPath<Obj[Key]> & string }`
         : Key 
      : never 
}[keyof Obj]

// 可以看作是
/** 
 * type a = {a: "a" | "a.b" | "a.c" | "a.b.b1" | "a.b.b2" | "a.c.c1" | "a.c.c2"}
 * 
 * 加上[keyof Obj]
 * 
 * type b = a[keyof Obj]  ==> a["a"] ==> "a" | "a.b" | "a.c" | "a.b.b1" | "a.b.b2" | "a.c.c1" | "a.c.c2"
 */


type getobjectPath = GetObjectPath<Obj>

