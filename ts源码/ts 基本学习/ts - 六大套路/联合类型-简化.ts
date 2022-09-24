/**
 * 目录：
 *
 * 联合分散可简化
 *
 */

/**
 * tips:
 *
 * 当类型参数为联合类型，并在条件类型的左边直接引用该类型时候，
 * ts 就会把每一个元素单独传入来去做类型运算，并合并成联合类型，这样
 * 的语法叫做分布式条件类型
 *
 * 具体解释
 *
 * type Union = 'a' | 'b' | 'c'
 *
 * 当类型参数为联合类型
 * type Uppercase<Item extends string> = ...
 * type upperCase = Uppercase<Union>
 *
 * 并在条件类型的左边直接引用该类型时候
 * type Uppercase<Item extends string> = [注意这里] Item extends 'a' ?  X : Y
 *
 */

type Union = 'a' | 'b' | 'c'

type UppercaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item
type uppercaseA = UppercaseA<Union>

// 当联合类型遇到字符串时
type StrUnion = `${Union}___===`

// 判断联合类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
type isUnion = IsUnion<['a' | 'b' | 'c']>

/**
 * 条件类型中如果左边的类型是联合类型，会把每个元素单独传入做计算，而右边不会。
 * 所以 A 是 'a' 的时候，B 是 'a' | 'b' | 'c'， A 是 'b' 的时候，B 是 'a' | 'b' | 'c'
 *
 * [B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，
 * 那么 B 就是整个联合类型。
 * B 是联合类型整体，而 A 是单个类型，自然不成立，
 * 而其它类型没有这种特殊处理，A 和 B 都是同一个成立。
 */

//  当 A 是联合类型时：

//  A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。

//  A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。

// 数组转联合类型
type unions = ['aaa', 'bbb'][number]

// 实现 BEM
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`

type bemResult = BEM<
  'div',
  ['left', 'content', 'right'],
  ['content', 'color', 'display']
>

// 全组合

type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`

type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never
/**
 * 这里的核心思想就是 两两处理
 * 通过 Combination<A, AllCombinations<Exclude<B, A>>> 去组合 A 以及 B去除A以后的所有组合
 */
