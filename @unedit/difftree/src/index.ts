type NonEmpty<A> = [A, ...A[]];

type n = number;

const from = <A extends n, B extends n>(xs: NonEmpty<[A, B, A, B]>, a: A, b: B, start: n, end: n): DiffTree<A, B> => {
    const mid = Math.floor((end - start) / 2) + start;
    const m = xs[mid];
    const next = mid + 1;

    // No destructuring: index access is faster than destructuring.
    const aMid = m[0];
    const bMid = m[1];
    const sa = m[2];
    const sb = m[3];

    return new DiffTree(
        (aMid - a) as A,
        (bMid - b) as B,
        sa,
        sb,
        mid === start ? null : from(xs, aMid, bMid, start, mid),
        next === end ? null : from(xs, aMid, bMid, next, end),
    );
};

const ab = <A extends n, B extends n>(d: DiffTree<A, B>, a: A, b: B): B => {
    const sub = (a - d.a) as A;
    const sum = (b + d.b) as B;

    if (sub < 0 && d.l) return ab(d.l, sub, sum);
    if (sub > 0 && d.r) return ab(d.r, sub, sum);

    return sum;
};

const ba = <A extends n, B extends n>(d: DiffTree<A, B>, b: B, a: A): A => {
    const sub = (b - d.b) as B;
    const sum = (a + d.a) as A;

    if (sub < 0 && d.l) return ba(d.l, sub, sum);
    if (sub > 0 && d.r) return ba(d.r, sub, sum);

    return sum;
};

type R<A extends n, B extends n, C> = (
    c: C,
    tree: { a: A; b: B; sa: A; sb: B },
    value: { a: A; b: B },
    parent: { a: A; b: B } | null,
) => C;

const reduce = <A extends n, B extends n, C>(
    tree: DiffTree<A, B>,
    f: R<A, B, C>,
    c: C,
    parent: { a: A; b: B } | null,
): C => {
    const value = parent
        ? {
              a: (tree.a + parent.a) as A,
              b: (tree.b + parent.b) as B,
          }
        : {
              a: tree.a,
              b: tree.b,
          };

    if (tree.l) c = reduce(tree.l, f, c, value); // eslint-disable-line no-param-reassign

    c = f(c, tree, value, parent); // eslint-disable-line no-param-reassign

    if (tree.r) c = reduce(tree.r, f, c, value); // eslint-disable-line no-param-reassign

    return c;
};

// region Spad
const spad = (x: n, n: n): string =>
    x >= 0
        ? `+${x.toString().padStart(n, '0')}`
        : `−${Math.abs(x)
              .toString()
              .padStart(n, '0')}`;
// endregion Spad

const splayL = <A extends n, B extends n>(d: DiffTree<A, B>, sub: A, a: A): DiffTree<A, B> => {
    const { l } = d;

    if (!l) return d;

    const n = (sub - l.a) as A;

    //              Zig-zag                          Zig-zig                 Zig
    return (n > 0 ? d.rotateLl().rotateR() : n < 0 ? d.rotateR().rotateR() : d.rotateR()).splay(a);
};

const splayR = <A extends n, B extends n>(d: DiffTree<A, B>, sub: A, a: A): DiffTree<A, B> => {
    const { r } = d;

    if (!r) return d;

    const n = (sub - r.a) as A;

    //              Zig-zag                          Zig-zig                 Zig
    return (n < 0 ? d.rotateRr().rotateL() : n > 0 ? d.rotateL().rotateL() : d.rotateL()).splay(a);
};

const splay = <A extends n, B extends n>(d: DiffTree<A, B>, a: A): DiffTree<A, B> => {
    const sub = (a - d.a) as A;

    if (sub < 0 && d.l) return splayL(d, sub, a);
    if (sub > 0 && d.r) return splayR(d, sub, a);

    return d;
};

/**
 * Differential binary tree for mapping offsets between strings in different encodings.
 */
export class DiffTree<A extends n, B extends n> {
    static from<A extends n, B extends n>(xs: NonEmpty<[A, B, A, B]>): DiffTree<A, B> {
        return from(xs, 0 as A, 0 as B, 0, xs.length);
    }

    readonly a: A;
    readonly b: B;

    readonly sa: A;
    readonly sb: B;

    readonly l: DiffTree<A, B> | null;
    readonly r: DiffTree<A, B> | null;

    constructor(a: A, b: B, sa: A, sb: B, l: DiffTree<A, B> | null = null, r: DiffTree<A, B> | null = null) {
        this.a = a;
        this.b = b;
        this.sa = sa;
        this.sb = sb;
        this.l = l;
        this.r = r;
    }

    ab(a: A): B {
        return ab(this, a, 0 as B);
    }

    ba(b: B): A {
        return ba(this, b, 0 as A);
    }

    reduce<C>(f: R<A, B, C>, c: C): C {
        return reduce(this, f, c, null);
    }

    toEntries(): NonEmpty<[A, B, A, B]> {
        return this.reduce(
            (entries, { sa, sb }, { a, b }) => {
                entries.push([a, b, sa, sb]);

                return entries;
            },
            ([] as any) as NonEmpty<[A, B, A, B]>,
        );
    }

    toString(n = 0): string {
        return `digraph "DiffTree" {\n${this.reduce(
            (entries, d, v, p) => {
                let o = `    ${v.a}[label="${spad(d.a, n)}, ${spad(d.b, n)} → ${v.a}, ${v.b}"]`;

                if (p) o += `\n    ${p.a} -> ${v.a}`;

                entries.push(o);

                return entries;
            },
            [] as string[],
        ).join('\n\n')}\n}`;
    }

    rotateR() {
        const g = this;
        const e = g.l;

        if (!e) return g;

        const b = e.r;

        const b_ = b && b.setAb((e.a + b.a) as A, (e.b + b.b) as B);
        const g_ = g.setAb(-e.a as A, -e.b as B).setL(b_);
        const e_ = e.setAb((e.a + g.a) as A, (e.b + g.b) as B).setR(g_);

        return e_;
    }

    rotateL() {
        const g = this;
        const f = g.r;

        if (!f) return g;

        const c = f.l;

        const c_ = c && c.setAb((f.a + c.a) as A, (f.b + c.b) as B);
        const g_ = g.setAb(-f.a as A, -f.b as B).setR(c_);
        const f_ = f.setAb((f.a + g.a) as A, (f.b + g.b) as B).setL(g_);

        return f_;
    }

    rotateRr() {
        const g = this;
        const f = g.r;

        if (!f) return g;

        return g.setR(f.rotateR());
    }

    rotateLl() {
        const g = this;
        const e = g.l;

        if (!e) return g;

        return g.setL(e.rotateL());
    }

    splay(root: A): DiffTree<A, B> {
        return splay(this, root);
    }

    split(start: A): [DiffTree<A, B> | null, DiffTree<A, B> | null] {
        const s = this.splay(start);

        if (start > s.a) return [s, null];

        const l = s.l && s.l.setAb((s.a + s.l.a) as A, (s.b + s.l.b) as B).splay(Number.MAX_SAFE_INTEGER as A);

        const r = l
            ? s
                  .setL(null)
                  .splay(Number.MIN_SAFE_INTEGER as A)
                  .setAb(0 as A, 0 as B)
            : s.setL(null);

        return [l, r];
    }

    merge(tree: DiffTree<A, B>): DiffTree<A, B> {
        const l = this.splay(Number.MAX_SAFE_INTEGER as A);
        const r = tree.splay(Number.MIN_SAFE_INTEGER as A);

        return l.setR(r.setAb(l.sa as A, l.sb as B));
    }

    insert(index: A, tree: DiffTree<A, B>): DiffTree<A, B> {
        const s = this.split(index);

        const l = s[0];
        const r = s[1];

        if (l) {
            if (r) return l.merge(tree).merge(r); // Mid.

            return l.merge(tree); // End.
        }

        return tree.merge(r!); // Start.
    }

    delete(start: A, end: A): DiffTree<A, B> | null {
        const s1 = this.split(start);

        const l = s1[0];
        const r1 = s1[1];

        const s2 = r1 && r1.split((end - start) as A);

        const r = s2 && s2[1];

        if (l) {
            if (r) return l.merge(r); // Mid.

            return l; // End.
        }

        return r; // Start.
    }

    replace(start: A, end: A, replacement: DiffTree<A, B>): DiffTree<A, B> {
        const s1 = this.split(start);

        const l = s1[0];
        const r1 = s1[1];

        const s2 = r1 && r1.split((end - start) as A);

        const r = s2 && s2[1];

        if (l) {
            if (r) return l.merge(replacement).merge(r); // Mid.

            return l.merge(replacement); // End.
        }

        if (r) return replacement.merge(r); // Start.

        return replacement; // All.
    }

    setAb(a: A, b: B): DiffTree<A, B> {
        return new DiffTree(a, b, this.sa, this.sb, this.l, this.r);
    }

    setL(l: DiffTree<A, B> | null): DiffTree<A, B> {
        return new DiffTree(this.a, this.b, this.sa, this.sb, l, this.r);
    }

    setR(r: DiffTree<A, B> | null): DiffTree<A, B> {
        return new DiffTree(this.a, this.b, this.sa, this.sb, this.l, r);
    }
}
