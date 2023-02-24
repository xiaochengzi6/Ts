// 将索引类型的某些 key 转为 可选的，其余 key 不变

interface Dong {
  name: string
  age: number
  addRess: string
}

type OptionsDong = Pick<Dong, 'name' | 'addRess'>

type obj = keyof Dong 

type PartialObjectPropByKeys<Obj extends Record<string, any>, Key extends keyof any> = 
 Copy<Partial<Pick<Obj, Extract<keyof Obj, Key>>> & Omit<Obj, Key>>

type test = PartialObjectPropByKeys<Dong, 'name' | 'age'>

type Copy<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key]
}