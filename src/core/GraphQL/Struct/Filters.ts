export type Primary<T> = T extends {
    _id : infer PK;
} ? PK | string : T extends {
    uuid : infer PK;
} ? PK : T extends {
    id : infer PK;
} ? PK : never;

export type PrimaryProperty<T> = T extends {
    _id : any;
} ? '_id' | string : T extends {
    uuid : any;
} ? 'uuid' : T extends {
    id : any;
} ? 'id' : never;

export type NonFunctionPropertyNames<T> = NonNullable<{
    [K in keyof T] : T[K] extends Function ? never : K;
}[keyof T]>;

export type Scalar = boolean | number | string | bigint | symbol | Date | RegExp | Buffer | {
    toHexString() : string;
};

export type ExpandScalar<T> = null | (T extends string ? string | RegExp : T extends Date ? Date | string : T);

export type OperatorMap<T> = {
    and? : Query<T>[];
    or? : Query<T>[];
    eq? : ExpandScalar<T>;
    ne? : ExpandScalar<T>;
    in? : ExpandScalar<T>[];
    nin? : ExpandScalar<T>[];
    not? : Query<T>;
    gt? : ExpandScalar<T>;
    gte? : ExpandScalar<T>;
    lt? : ExpandScalar<T>;
    lte? : ExpandScalar<T>;
    like? : string;
    re? : string;
    ilike? : string;
    overlap? : string[];
    contains? : string[];
    contained? : string[];
};

export type ExpandProperty<T> = T extends (infer U)[] ? NonNullable<U> : NonNullable<T>;
export type FilterValue2<T> = T | ExpandScalar<T> | Primary<T>;
export type FilterValue<T> = OperatorMap<FilterValue2<T>> | FilterValue2<T> | FilterValue2<T>[] | null;
type ExpandObject<U> = {
    [K in NonFunctionPropertyNames<U>]?: Query<ExpandProperty<U[K]>> | FilterValue<ExpandProperty<U[K]>> | null;
} | FilterValue<ExpandProperty<U>>;
export type Query<T> = T extends Scalar ? FilterValue<T> : ExpandObject<T>;
export type FilterQuery<T> = NonNullable<Query<T>>;
