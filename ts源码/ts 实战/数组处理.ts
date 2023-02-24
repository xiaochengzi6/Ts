// 数组去重

// 数组去重第一步：1. 查找元素 2. 将之排除

type TargetArray = [1,2,3,3,4,5,6,7,7,8,8,8,9]

// 查找元素
type HasElementArr<Arr extends unknown[], T > = 
  Arr extends [infer Target, ...infer Rest] 
   ? Target extends T 
     ? true 
     : HasElementArr<Rest, T>
   : false 

type TestHasElementArr = HasElementArr<TargetArray, 3>

// 删除元素


// 去重
type RemovalArr<Arr extends unknown[], Result extends unknown[] = []> = 
  Arr extends [infer Target, ...infer Rest] 
   ? HasElementArr<Rest, Target> extends true
     ? RemovalArr<Rest, Result>
     : RemovalArr<Rest, [...Result, Target]>
   : Result 

// test
type GetRemovalArr = RemovalArr<TargetArray>

// 问题： 对数组做分组，比如 1、2、3、4、5 的数组，每两个为 1 组，那就可以分为 1、2 和 3、4 以及 5 这三个 Chunk。
// type Chunk<[1,2,3,4,5], 2> => [[1,2],[3,4],5]
type Chunk<Arr extends unknown[], Item,Stake extends unknown[] = [], Result extends unknown[] = []> = 
  Arr extends [infer Target, ...infer Rest] 
    ? Stake['length'] extends Item 
      ? Chunk<Rest, Item, [Target], [...Result, Stake]>
      : Chunk<Rest, Item, [...Stake, Target], Result>
    : [...Result, Stake]
type getChunk = Chunk<[1,2,3,4,5], 2>

