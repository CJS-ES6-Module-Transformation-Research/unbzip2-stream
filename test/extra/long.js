import unbzip2Stream from '../../index.js';
import test from 'tape';
import { createReadStream } from 'fs';
import streamEqual from 'stream-equal';
test('a very large binary file piped into unbzip2-stream results in original file content', function (t) {
    t.plan(1);
    var source = createReadStream('test/fixtures/vmlinux.bin.bz2');
    var expected = createReadStream('test/fixtures/vmlinux.bin');
    var unbz2 = unbzip2Stream();
    source.pipe(unbz2);
    streamEqual(expected, unbz2, function (err, equal) {
        if (err)
            t.ok(false, err);
        t.ok(equal, 'same file contents');
    });
});