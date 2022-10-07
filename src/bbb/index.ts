type obj<U> = U extends number ? true : 1 
var a: number = 1

var b: obj<1> = true