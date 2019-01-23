import { Maybe } from '@unedit/maybe';

export abstract class Either<A, B> {
    static of<A, B>(a: A): Either<A, B> {
        return new Right(a);
    }

    abstract map<C>(f: (a: A) => C): Either<C, B>;
    abstract chain<C>(f: (a: A) => Either<C, B>): Either<C, B>;
    abstract ap<C>(f: Either<(a: A) => C, any>): Either<C, B>;

    abstract either<C>(f: (a: A) => C, g: (b: B) => C): C;
    abstract toMaybe(): Maybe<A>;
    abstract swap(): Either<B, A>;
}

export class Right<A, B> extends Either<A, B> {
    readonly a: A;

    constructor(a: A) {
        super();

        this.a = a;
    }

    map<C>(f: (a: A) => C): Either<C, B> {
        return new Right(f(this.a));
    }

    chain<C>(f: (a: A) => Either<C, B>): Either<C, B> {
        return f(this.a);
    }

    ap<C>(f: Either<(a: A) => C, any>): Either<C, B> {
        return f.map(g => g(this.a));
    }

    either<C>(f: (a: A) => C, g: (b: B) => C): C {
        void g;

        return f(this.a);
    }

    toMaybe(): Maybe<A> {
        return Maybe.of(this.a);
    }

    swap(): Either<B, A> {
        return new Left(this.a);
    }
}

export class Left<A, B> extends Either<A, B> {
    readonly b: B;

    constructor(b: B) {
        super();

        this.b = b;
    }

    map<C>(f: (a: A) => C) {
        void f;

        return (this as unknown) as Either<C, B>;
    }

    chain<C>(f: (a: A) => Either<C, B>): Either<C, B> {
        void f;

        return (this as unknown) as Either<C, B>;
    }

    ap<C>(f: Either<(a: A) => C, any>): Either<C, B> {
        void f;

        return (this as unknown) as Either<C, B>;
    }

    either<C>(f: (a: A) => C, g: (b: B) => C): C {
        void f;

        return g(this.b);
    }

    toMaybe(): Maybe<A> {
        return Maybe.zero();
    }

    swap(): Either<B, A> {
        return new Right(this.b);
    }
}
