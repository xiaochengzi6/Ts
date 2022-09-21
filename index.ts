// 模式匹配

// 数组
type GetValueResult<P> = P extends Array<infer Value> ? Value : never
type value = GetValueResult<number[]>

// 提取数组类型的第一个元素的类型
type GetArrayFirst<T extends unknown[]> = T extends [infer Value, ...unknown[]] ? Value : never
type FirstArray = GetArrayFirst<[1, 2, 3]>

// 提取最后一个元素
type GetArrayLast<T extends unknown[]> = T extends [...unknown[], infer Value] ? Value : never
type LastArray = GetArrayLast<[1, 2, 3]>

// 取出排除最后一个的剩余数组
type GetArray<T extends unknown[]> = T extends [] ? [] : T extends [...infer Value, unknown] ? Value : unknown
type getArray = GetArray<[1, 2, 3]>

// 取出排除第一个的剩余数组
type GetArrayShift<T extends unknown[]> = T extends [] ? [] : T extends [unknown, ...infer Value] ? Value : unknown
type ShiftValue = GetArrayShift<[1, 2, 3]>

// 字符串

// 判断字符串是否以某个字符为开头
type StartWith<T extends string, Prefix extends string> = T extends `${Prefix}${string}` ? true : false
type IsStartWith = StartWith<'value-number', 'value'>

// 字符串替换
type ReplaceStr<Str extends string, From extends string, To extends string> = Str extends `${infer Prefix}${From}${infer Last}`
    ? `${Prefix}${To}${Last}`
    : Str
type rePlaceStr = ReplaceStr<'valuegetnumber', 'get', 'ww'>

// 取消字符串尾部的空白字符串
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? TrimStrRight<Rest> : Str
// 这里值得注意的是使用了递归处理
type trimStateRight = TrimStrRight<'dsdsds     '>

// 奇效字符串前面的空白字符串
// type TrimStrLeft<Str extends string> = Str extends `${}${infer }`
