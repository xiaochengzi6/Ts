function greet(person, date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
    return 'j';
}
greet('perter', new Date());
let arrs = ["abbs", 1235, true];
arrs.forEach((s) => {
    console.log(s);
});
// 可选属性
function printname(obj) {
    if (obj.laster !== undefined) {
        console.log(obj.first + obj.laster);
    }
}
let obj = {
    first: 23,
    laster: 's'
};
printname(obj);
function sum(obj) {
    console.log(obj);
}
function sum_2(obj) {
    console.log(obj);
}
function func(obj) {
    console.log(obj.a);
}
let B = {
    a: 23
};
func(B);
const req = { url: "https://example.com", method: "GET" };
function doSomething(fn) {
    console.log(fn.description + " returned " + fn(6));
}
function fn() {
    return true;
}
fn.description = 'dd';
doSomething(fn);
function fns(ctor) {
    return new ctor("hello");
}
// 约束
function longest(a, b) {
    if (a.length >= b.length) {
        return a;
    }
    else {
        return b;
    }
}
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// 函数泛型
// function minimumLength<Type extends { length: number }>(
//   obj: Type,
//   minimum: number
// ): Type {
//   if (obj.length >= minimum) {
//     return obj;
//   } else {
//     return { length: minimum };
//     // Type '{ length: number; }' is not assignable to type 'Type'.
//     // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
//   }
// }
// 声明类型参数
function combine(arr1, arr2) {
    return arr1.concat(arr2);
}
// 这里就会不合适 出现错误
// 可以手动的添加类型
combine([1, 2, 3], ["hello"]);
let arr = [1, 2, 3, "heool"];
function f(n) {
    console.log(n.toFixed()); // 0 arguments
    console.log(n.toFixed(3)); // 1 argument
}
let arr_0 = [1, 2, 3];
f(3);
// 剩余参数
const args = [8, 5];
