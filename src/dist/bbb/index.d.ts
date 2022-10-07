declare type obj<U> = U extends number ? true : 1;
declare var a: number;
declare var b: obj<1>;
