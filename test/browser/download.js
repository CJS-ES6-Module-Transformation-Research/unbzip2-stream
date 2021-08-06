import { get } from 'http';
import unbzip2Stream from '../../index.js';
import through from 'through';
import concat from 'concat-stream';
import test from 'tape';
test('http stream piped into unbzip2-stream results in original file content', function (t) {
    t.plan(1);
    get({
        path: '/test/fixtures/text.bz2',
        responseType: 'arraybuffer'
    }, function (res) {
        res.pipe(unbzip2Stream()).pipe(concat(function (data) {
            var expected = 'Hello World!\nHow little you are. now.\n\n';
            t.equal(data.toString('ascii'), expected);
        }));
    });
});