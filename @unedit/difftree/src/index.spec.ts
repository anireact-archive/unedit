/*
 eslint
 init-declarations: off,
 max-lines-per-function: off,
 max-statements: off,
 */

import { DiffTree } from '.';

type NonEmpty<A> = [A, ...A[]];

type n = number;

declare const A: unique symbol;
type A = n & typeof A;

declare const B: unique symbol;
type B = n & typeof B;

// region Dot
const d = `digraph "DiffTree" {
    0[label="−01, −01 → 0, 0"]
    1 -> 0

    1[label="−02, −05 → 1, 1"]
    3 -> 1

    2[label="+01, +02 → 2, 3"]
    1 -> 2

    3[label="−05, −07 → 3, 6"]
    8 -> 3

    5[label="−01, −01 → 5, 10"]
    6 -> 5

    6[label="+03, +05 → 6, 11"]
    3 -> 6

    7[label="+01, +01 → 7, 12"]
    6 -> 7

    8[label="+08, +13 → 8, 13"]

    9[label="−01, −01 → 9, 14"]
    10 -> 9

    10[label="−02, −02 → 10, 15"]
    12 -> 10

    11[label="+01, +01 → 11, 16"]
    10 -> 11

    12[label="+04, +04 → 12, 17"]
    8 -> 12

    14[label="−01, −03 → 14, 21"]
    15 -> 14

    15[label="+03, +07 → 15, 24"]
    12 -> 15

    16[label="+01, +02 → 16, 26"]
    15 -> 16
}`;
// endregion Dot

const e = [
    [0 as A, 0 as B, 1 as A, 1 as B],
    [1 as A, 1 as B, 1 as A, 2 as B],
    [2 as A, 3 as B, 1 as A, 3 as B],
    [3 as A, 6 as B, 2 as A, 4 as B],
    [5 as A, 10 as B, 1 as A, 1 as B],
    [6 as A, 11 as B, 1 as A, 1 as B],
    [7 as A, 12 as B, 1 as A, 1 as B],
    [8 as A, 13 as B, 1 as A, 1 as B],
    [9 as A, 14 as B, 1 as A, 1 as B],
    [10 as A, 15 as B, 1 as A, 1 as B],
    [11 as A, 16 as B, 1 as A, 1 as B],
    [12 as A, 17 as B, 2 as A, 4 as B],
    [14 as A, 21 as B, 1 as A, 3 as B],
    [15 as A, 24 as B, 1 as A, 2 as B],
    [16 as A, 26 as B, 1 as A, 1 as B],
] as NonEmpty<[A, B, A, B]>;

const a = DiffTree.from(e);

describe('Creating', () => {
    test('Symmetric', () =>
        expect(a).toEqual(
            new DiffTree<A, B>(
                // 8
                8 as A,
                13 as B,
                1 as A,
                1 as B,
                new DiffTree<A, B>(
                    // 3
                    -5 as A,
                    -7 as B,
                    2 as A,
                    4 as B,
                    new DiffTree<A, B>(
                        // 1
                        -2 as A,
                        -5 as B,
                        1 as A,
                        2 as B,
                        new DiffTree<A, B>(
                            // 0
                            -1 as A,
                            -1 as B,
                            1 as A,
                            1 as B,
                        ),
                        new DiffTree<A, B>(
                            // 2
                            1 as A,
                            2 as B,
                            1 as A,
                            3 as B,
                        ),
                    ),
                    new DiffTree<A, B>(
                        // 6
                        3 as A,
                        5 as B,
                        1 as A,
                        1 as B,
                        new DiffTree<A, B>(
                            // 5
                            -1 as A,
                            -1 as B,
                            1 as A,
                            1 as B,
                        ),
                        new DiffTree<A, B>(
                            // 7
                            1 as A,
                            1 as B,
                            1 as A,
                            1 as B,
                        ),
                    ),
                ),
                new DiffTree<A, B>(
                    // 12
                    4 as A,
                    4 as B,
                    2 as A,
                    4 as B,
                    new DiffTree<A, B>(
                        // 10
                        -2 as A,
                        -2 as B,
                        1 as A,
                        1 as B,
                        new DiffTree<A, B>(
                            // 9
                            -1 as A,
                            -1 as B,
                            1 as A,
                            1 as B,
                        ),
                        new DiffTree<A, B>(
                            // 11
                            1 as A,
                            1 as B,
                            1 as A,
                            1 as B,
                        ),
                    ),
                    new DiffTree<A, B>(
                        // 15
                        3 as A,
                        7 as B,
                        1 as A,
                        2 as B,
                        new DiffTree<A, B>(
                            // 14
                            -1 as A,
                            -3 as B,
                            1 as A,
                            3 as B,
                        ),
                        new DiffTree<A, B>(
                            // 16
                            1 as A,
                            2 as B,
                            1 as A,
                            1 as B,
                        ),
                    ),
                ),
            ),
        ));
});

describe('A -> B', () => {
    test('Valid', () => {
        expect(a.ab(3 as A)).toBe(6);
        expect(a.ab(5 as A)).toBe(10);
        expect(a.ab(12 as A)).toBe(17);
        expect(a.ab(14 as A)).toBe(21);
    });
});

describe('B -> A', () => {
    test('Valid', () => {
        expect(a.ba(6 as B)).toBe(3);
        expect(a.ba(10 as B)).toBe(5);
        expect(a.ba(17 as B)).toBe(12);
        expect(a.ba(21 as B)).toBe(14);
    });
});

describe('Reducing', () => {
    test('Sum (diffs)', () => expect(a.reduce((sum, { a }) => sum + (a as n), 0)).toBe(9));
    test('Sum (values)', () => expect(a.reduce((sum, {}, { a }) => sum + (a as n), 0)).toBe(119));
});

describe('Converting', () => {
    test('To entries', () => expect(a.toEntries()).toEqual(e));
    test('To dot', () => expect(a.toString(2)).toBe(d));
});

describe('Rotating', () => {
    test('Left 1', () => expect(a.rotateL().toEntries()).toEqual(e));

    test('Left 2', () =>
        expect(
            a
                .rotateL()
                .rotateL()
                .toEntries(),
        ).toEqual(e));

    test('Left 4', () =>
        expect(
            a
                .rotateL()
                .rotateL()
                .rotateL()
                .rotateL()
                .toEntries(),
        ).toEqual(e));

    test('Right 1', () => expect(a.rotateR().toEntries()).toEqual(e));

    test('Right 2', () =>
        expect(
            a
                .rotateR()
                .rotateR()
                .toEntries(),
        ).toEqual(e));

    test('Right 4', () =>
        expect(
            a
                .rotateR()
                .rotateR()
                .rotateR()
                .rotateR()
                .toEntries(),
        ).toEqual(e));

    test('Left left', () => expect(a.rotateLl().toEntries()).toEqual(e));
    test('Right right', () => expect(a.rotateRr().toEntries()).toEqual(e));
});

describe('Splaying', () => {
    test('Sieg left', () => expect(a.splay(3 as A).toEntries()).toEqual(e));
    test('Sieg-sieg left', () => expect(a.splay(1 as A).toEntries()).toEqual(e));
    test('Sieg-heil left 1', () => expect(a.splay(6 as A).toEntries()).toEqual(e));
    test('Sieg-heil left 2', () => expect(a.splay(2 as A).toEntries()).toEqual(e));

    test('Sieg right', () => expect(a.splay(12 as A).toEntries()).toEqual(e));
    test('Sieg-sieg right', () => expect(a.splay(15 as A).toEntries()).toEqual(e));
    test('Sieg-heil right 1', () => expect(a.splay(10 as A).toEntries()).toEqual(e));
    test('Sieg-heil right 2', () => expect(a.splay(14 as A).toEntries()).toEqual(e));

    test('First', () => expect(a.splay(0 as A).toEntries()).toEqual(e));
    test('Last', () => expect(a.splay(16 as A).toEntries()).toEqual(e));
    test('Before first', () => expect(a.splay(-1 as A).toEntries()).toEqual(e));
    test('After last', () => expect(a.splay(17 as A).toEntries()).toEqual(e));
});

describe('Splitting', () => {
    test('Split 1', () => {
        const [b, c] = a.split(7 as A);

        expect(b && b.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
        ]);

        expect(c && c.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 1 as B],
            [2 as A, 2 as B, 1 as A, 1 as B],
            [3 as A, 3 as B, 1 as A, 1 as B],
            [4 as A, 4 as B, 1 as A, 1 as B],
            [5 as A, 5 as B, 2 as A, 4 as B],
            [7 as A, 9 as B, 1 as A, 3 as B],
            [8 as A, 12 as B, 1 as A, 2 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
        ]);
    });

    test('Split 2', () => {
        const [b, c] = a.split(9 as A);

        expect(b && b.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
            [7 as A, 12 as B, 1 as A, 1 as B],
            [8 as A, 13 as B, 1 as A, 1 as B],
        ]);

        expect(c && c.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 1 as B],
            [2 as A, 2 as B, 1 as A, 1 as B],
            [3 as A, 3 as B, 2 as A, 4 as B],
            [5 as A, 7 as B, 1 as A, 3 as B],
            [6 as A, 10 as B, 1 as A, 2 as B],
            [7 as A, 12 as B, 1 as A, 1 as B],
        ]);
    });

    test('Min', () => {
        const [b, c] = a.split(Number.MIN_SAFE_INTEGER as A);

        expect(b).toBeNull();
        expect(c && c.toEntries()).toEqual(e);
    });

    test('Out of range', () => {
        const [b, c] = a.split(Number.MAX_SAFE_INTEGER as A);

        expect(b && b.toEntries()).toEqual(e);
        expect(c).toBeNull();
    });
});

describe('Merging', () => {
    test('Merge 1', () =>
        expect(
            DiffTree.from([
                [0 as A, 0 as B, 1 as A, 1 as B],
                [1 as A, 1 as B, 1 as A, 2 as B],
                [2 as A, 3 as B, 1 as A, 3 as B],
                [3 as A, 6 as B, 2 as A, 4 as B],
                [5 as A, 10 as B, 1 as A, 1 as B],
                [6 as A, 11 as B, 1 as A, 1 as B],
            ] as NonEmpty<[A, B, A, B]>)
                .merge(
                    DiffTree.from([
                        [0 as A, 0 as B, 1 as A, 1 as B],
                        [1 as A, 1 as B, 1 as A, 1 as B],
                        [2 as A, 2 as B, 1 as A, 1 as B],
                        [3 as A, 3 as B, 1 as A, 1 as B],
                        [4 as A, 4 as B, 1 as A, 1 as B],
                        [5 as A, 5 as B, 2 as A, 4 as B],
                        [7 as A, 9 as B, 1 as A, 3 as B],
                        [8 as A, 12 as B, 1 as A, 2 as B],
                        [9 as A, 14 as B, 1 as A, 1 as B],
                    ] as NonEmpty<[A, B, A, B]>),
                )
                .toEntries(),
        ).toEqual(e));

    test('Merge 2', () =>
        expect(
            DiffTree.from([
                [0 as A, 0 as B, 1 as A, 1 as B],
                [1 as A, 1 as B, 1 as A, 2 as B],
                [2 as A, 3 as B, 1 as A, 3 as B],
                [3 as A, 6 as B, 2 as A, 4 as B],
                [5 as A, 10 as B, 1 as A, 1 as B],
                [6 as A, 11 as B, 1 as A, 1 as B],
                [7 as A, 12 as B, 1 as A, 1 as B],
                [8 as A, 13 as B, 1 as A, 1 as B],
            ] as NonEmpty<[A, B, A, B]>)
                .merge(
                    DiffTree.from([
                        [0 as A, 0 as B, 1 as A, 1 as B],
                        [1 as A, 1 as B, 1 as A, 1 as B],
                        [2 as A, 2 as B, 1 as A, 1 as B],
                        [3 as A, 3 as B, 2 as A, 4 as B],
                        [5 as A, 7 as B, 1 as A, 3 as B],
                        [6 as A, 10 as B, 1 as A, 2 as B],
                        [7 as A, 12 as B, 1 as A, 1 as B],
                    ] as NonEmpty<[A, B, A, B]>),
                )
                .toEntries(),
        ).toEqual(e));
});

describe('Inserting', () => {
    test('Mid 1', () => {
        const b = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
            [7 as A, 12 as B, 1 as A, 1 as B],
            [8 as A, 13 as B, 1 as A, 1 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
            [10 as A, 15 as B, 1 as A, 1 as B],
            [11 as A, 16 as B, 1 as A, 2 as B],
            [12 as A, 18 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        const t = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 2 as A, 4 as B],
            [3 as A, 5 as B, 1 as A, 3 as B],
        ] as NonEmpty<[A, B, A, B]>);

        expect(b.insert(11 as A, t).toEntries()).toEqual(e);
    });

    test('Mid 2', () => {
        const b = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
            [7 as A, 12 as B, 1 as A, 1 as B],
            [8 as A, 13 as B, 1 as A, 1 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
            [10 as A, 15 as B, 1 as A, 1 as B],
            [11 as A, 16 as B, 1 as A, 1 as B],
            [12 as A, 17 as B, 1 as A, 2 as B],
            [13 as A, 19 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        const t = DiffTree.from([[0 as A, 0 as B, 2 as A, 4 as B], [2 as A, 4 as B, 1 as A, 3 as B]] as NonEmpty<
            [A, B, A, B]
        >);

        expect(b.insert(12 as A, t).toEntries()).toEqual(e);
    });

    test('Mid 3', () => {
        const b = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
            [7 as A, 12 as B, 1 as A, 1 as B],
            [8 as A, 13 as B, 1 as A, 1 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
            [10 as A, 15 as B, 1 as A, 1 as B],
            [11 as A, 16 as B, 1 as A, 1 as B],
            [12 as A, 17 as B, 2 as A, 4 as B],
            [14 as A, 21 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        const t = DiffTree.from([[0 as A, 0 as B, 1 as A, 3 as B], [1 as A, 3 as B, 1 as A, 2 as B]] as NonEmpty<
            [A, B, A, B]
        >);

        expect(b.insert(14 as A, t).toEntries()).toEqual(e);
    });

    test('End', () => {
        const b = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        const t = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 1 as B],
            [2 as A, 2 as B, 1 as A, 1 as B],
            [3 as A, 3 as B, 1 as A, 1 as B],
            [4 as A, 4 as B, 1 as A, 1 as B],
            [5 as A, 5 as B, 2 as A, 4 as B],
            [7 as A, 9 as B, 1 as A, 3 as B],
            [8 as A, 12 as B, 1 as A, 2 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        expect(b.insert(Number.MAX_SAFE_INTEGER as A, t).toEntries()).toEqual(e);
    });

    test('Start', () => {
        const b = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 1 as B],
            [2 as A, 2 as B, 1 as A, 1 as B],
            [3 as A, 3 as B, 1 as A, 1 as B],
            [4 as A, 4 as B, 1 as A, 1 as B],
            [5 as A, 5 as B, 2 as A, 4 as B],
            [7 as A, 9 as B, 1 as A, 3 as B],
            [8 as A, 12 as B, 1 as A, 2 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        const t = DiffTree.from([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
        ] as NonEmpty<[A, B, A, B]>);

        expect(b.insert(0 as A, t).toEntries()).toEqual(e);
    });
});

describe('Deleting', () => {
    test('Mid', () =>
        expect(a.delete(11 as A, 15 as A)!.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
            [7 as A, 12 as B, 1 as A, 1 as B],
            [8 as A, 13 as B, 1 as A, 1 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
            [10 as A, 15 as B, 1 as A, 1 as B],
            [11 as A, 16 as B, 1 as A, 2 as B],
            [12 as A, 18 as B, 1 as A, 1 as B],
        ]));

    test('End', () =>
        expect(a.delete(7 as A, Number.MAX_SAFE_INTEGER as A)!.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 2 as B],
            [2 as A, 3 as B, 1 as A, 3 as B],
            [3 as A, 6 as B, 2 as A, 4 as B],
            [5 as A, 10 as B, 1 as A, 1 as B],
            [6 as A, 11 as B, 1 as A, 1 as B],
        ]));

    test('Start', () =>
        expect(a.delete(0 as A, 7 as A)!.toEntries()).toEqual([
            [0 as A, 0 as B, 1 as A, 1 as B],
            [1 as A, 1 as B, 1 as A, 1 as B],
            [2 as A, 2 as B, 1 as A, 1 as B],
            [3 as A, 3 as B, 1 as A, 1 as B],
            [4 as A, 4 as B, 1 as A, 1 as B],
            [5 as A, 5 as B, 2 as A, 4 as B],
            [7 as A, 9 as B, 1 as A, 3 as B],
            [8 as A, 12 as B, 1 as A, 2 as B],
            [9 as A, 14 as B, 1 as A, 1 as B],
        ]));

    test('All', () => expect(a.delete(0 as A, 17 as A)).toBeNull());
});

describe('Replacing', () => {
    const a = DiffTree.from([
        [0 as A, 0 as B, 1 as A, 1 as B],
        [1 as A, 1 as B, 1 as A, 2 as B],
        [2 as A, 3 as B, 1 as A, 3 as B],
        [3 as A, 6 as B, 2 as A, 4 as B],
        [5 as A, 10 as B, 1 as A, 1 as B],
        [6 as A, 11 as B, 1 as A, 1 as B],
        [7 as A, 12 as B, 1 as A, 1 as B],
    ]);

    test('Mid', () =>
        expect(
            a
                .replace(
                    3 as A,
                    6 as A,
                    DiffTree.from([
                        //
                        [0 as A, 0 as B, 1 as A, 2 as B],
                        [1 as A, 2 as B, 1 as A, 3 as B],
                        [2 as A, 5 as B, 1 as A, 2 as B],
                    ] as NonEmpty<[A, B, A, B]>),
                )
                .toEntries(),
        ).toEqual([
            [0, 0, 1, 1],
            [1, 1, 1, 2],
            [2, 3, 1, 3],
            [3, 6, 1, 2],
            [4, 8, 1, 3],
            [5, 11, 1, 2],
            [6, 13, 1, 1],
            [7, 14, 1, 1],
        ]));

    test('End', () =>
        expect(
            a
                .replace(
                    6 as A,
                    8 as A,
                    DiffTree.from([
                        //
                        [0 as A, 0 as B, 1 as A, 2 as B],
                    ] as NonEmpty<[A, B, A, B]>),
                )
                .toEntries(),
        ).toEqual([
            //
            [0, 0, 1, 1],
            [1, 1, 1, 2],
            [2, 3, 1, 3],
            [3, 6, 2, 4],
            [5, 10, 1, 1],
            [6, 11, 1, 2],
        ]));

    test('Start', () =>
        expect(
            a
                .replace(
                    0 as A,
                    2 as A,
                    DiffTree.from([
                        //
                        [0 as A, 0 as B, 1 as A, 1 as B],
                        [1 as A, 1 as B, 1 as A, 1 as B],
                    ] as NonEmpty<[A, B, A, B]>),
                )
                .toEntries(),
        ).toEqual([
            [0, 0, 1, 1],
            [1, 1, 1, 1],
            [2, 2, 1, 3],
            [3, 5, 2, 4],
            [5, 9, 1, 1],
            [6, 10, 1, 1],
            [7, 11, 1, 1],
        ]));

    test('All', () =>
        expect(
            a
                .replace(
                    0 as A,
                    8 as A,
                    DiffTree.from([
                        //
                        [0 as A, 0 as B, 1 as A, 2 as B],
                        [1 as A, 2 as B, 1 as A, 3 as B],
                        [2 as A, 5 as B, 1 as A, 2 as B],
                    ] as NonEmpty<[A, B, A, B]>),
                )
                .toEntries(),
        ).toEqual([
            //
            [0, 0, 1, 2],
            [1, 2, 1, 3],
            [2, 5, 1, 2],
        ]));
});
