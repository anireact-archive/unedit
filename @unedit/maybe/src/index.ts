export abstract class Maybe<A> {
    static of<A>(a: A): Maybe<A> {
        return new Just(a);
    }

    static zero<A>(): Maybe<A> {
        return new Nothing();
    }

    abstract map<B>(f: (a: A) => B): Maybe<B>;
    abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
    abstract ap<B>(m: Maybe<(a: A) => B>): Maybe<B>;

    abstract alt(m: Maybe<A>): Maybe<A>;

    abstract maybe<B>(f: (a: A) => B, b: B): B;
}

export class Just<A> extends Maybe<A> {
    readonly a: A;

    constructor(a: A) {
        super();

        this.a = a;
    }

    map<B>(f: (a: A) => B): Maybe<B> {
        return new Just(f(this.a));
    }

    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
        return f(this.a);
    }

    ap<B>(m: Maybe<(a: A) => B>): Maybe<B> {
        return m.map(f => f(this.a));
    }

    alt(m: Maybe<A>): Maybe<A> {
        void m;

        return this;
    }

    maybe<B>(f: (a: A) => B, b: B): B {
        void b;

        return f(this.a);
    }
}

export class Nothing<A> extends Maybe<A> {
    constructor() {
        super();

        return nothing || (nothing = this);
    }

    map<B>(f: (a: A) => B) {
        void f;

        return (this as unknown) as Maybe<B>;
    }

    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {
        void f;

        return (this as unknown) as Maybe<B>;
    }

    ap<B>(m: Maybe<(a: A) => B>): Maybe<B> {
        void m;

        return (this as unknown) as Maybe<B>;
    }

    alt(m: Maybe<A>): Maybe<A> {
        return m;
    }

    maybe<B>(f: (a: A) => B, b: B): B {
        void f;

        return b;
    }
}

let nothing = new Nothing<any>();
