import test from 'tape';
import bitIterator from '../lib/bit_iterator.js';
test('should return the correct bit pattern across byte boundaries', function (t) {
    t.plan(5);
    var bi = bitIterator(function () {
        return Buffer.from([
            15,
            16,
            1,
            128
        ]);
    });
    t.equal(bi(16), 3856);
    t.equal(bi(7), 0);
    t.equal(bi(2), 3);
    t.equal(bi(7), 0);
    t.equal(bi.bytesRead, 4);
});
test('should correctly switch from one buffer to the next', function (t) {
    t.plan(4);
    var i = 0;
    var buffs = [
        [1],
        [128]
    ];
    var bi = bitIterator(function () {
        return buffs[i++];
    });
    t.equal(bi(7), 0);
    t.equal(bi(2), 3);
    t.equal(bi(7), 0);
    t.equal(bi.bytesRead, 2);
});
test('each iterator has an independent bytesRead property', function (t) {
    t.plan(6);
    var i = 0;
    var ii = 0;
    var buffs = [
        [1],
        [128]
    ];
    var bi1 = bitIterator(function () {
        return buffs[i++];
    });
    var bi2 = bitIterator(function () {
        return buffs[ii++];
    });
    t.equal(bi1.bytesRead, 0);
    t.equal(bi2.bytesRead, 0);
    bi1(9);
    t.equal(bi1.bytesRead, 2);
    t.equal(bi2.bytesRead, 0);
    bi2(7);
    t.equal(bi1.bytesRead, 2);
    t.equal(bi2.bytesRead, 1);
});
test('aligns to the byte boundary when passed null', function (t) {
    t.plan(3);
    var bi = bitIterator(function () {
        return Buffer.from([
            15,
            16,
            1,
            128
        ]);
    });
    t.equal(bi(7), 7);
    bi(null);
    t.equal(bi.bytesRead, 1);
    t.equal(bi(4), 1);
});