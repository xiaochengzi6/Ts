/**
 * 目录：
 *
 * 数组长度做计算
 *
 * 1. 加法
 *
 * 2. 减法
 *
 * 3. 乘法
 *
 * 4. 除法
 *
 * 5. 字符串
 *
 * 6. 数字
 *
 * 7. 实例：Fibonacci
 */

// tips: 数组长度做计数 ts 中没有办法去做加减运算符， 只能操作 数组中的长度 length 从而达到计算的目的

// 加法
type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArray<Num1>,
  ...BuildArray<Num2>
]['length']

/**
 * tips :
 *
 * 元组和数组的区别：
 * 1、元组可以由任意个值构成但不能随意更改其长度
 * 2、数组由同类值构成，可以修改其长度
 * 3、元组的长度是字面量类型 数组的长度是 number 类型
 *
 * 注意事项：元组被定义是可以是无名的这种形式 [ ...BuildArray<Num2>, ...infer Rest]
 * 也可以是具名的但全部都要具名 [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
 */

// 减法  被减-减数 = 差 === Num1 -Num2 = 差
type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest['length']
  : never

type subtract = Subtract<31, 21>

// 乘法 相当于是在加法的基础上连续加, 添加了一个 ResultArr 用来记录中间的结果
type Mutiply<
  Num1 extends number,
  Num2 extends number,
  ResultArr extends unknown[] = []
> = Num2 extends 0
  ? ResultArr['length']
  : Mutiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>

// 除法 递归的累积递减 每运行一次就会 +1
type Divide<
  Num1 extends number,
  Num2 extends number,
  ResultArr extends unknown[] = []
> = Num1 extends 0
  ? ResultArr['length']
  : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...ResultArr]>

type divide = Divide<10, 2>

// 使用数组实现计数

// ----------- 字符串 -----------

// 求字符串的长度
type Strlength<
  Str extends string,
  CountArr extends unknown[] = []
> = Str extends `${infer Frist}${infer Rest}`
  ? Strlength<Rest, [...CountArr, unknown]>
  : CountArr['length']

type strlength = Strlength<'length'>

// ----------- 数字 -----------

// 数值大小的比较
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> = Num1 extends Num2
  ? false
  : CountArr['length'] extends Num2
  ? true
  : CountArr['length'] extends Num1
  ? false
  : GreaterThan<Num1, Num2, [...CountArr, unknown]>

/**
 * 这里做的很巧妙 通过对比来判断是否相等 不相等就会但会 false 相等就要去在原来的基础上 +1
 */

type greaterThan = GreaterThan<2, 3>

// Fibonacci 数列 当前的数是前两项的和 f(n) = f(n-1) + f(n-2)

type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr['length'] extends Num
  ? CurrentArr['length']
  : FibonacciLoop<
      CurrentArr,
      [...PrevArr, ...CurrentArr],
      [...IndexArr, unknown],
      Num
    >

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>
