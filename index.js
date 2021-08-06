import through from 'through';
import bz2 from './lib/bzip2.js';
import bitIterator from './lib/bit_iterator.js';
var defaultExport = {};
var __exports;
__exports = unbzip2Stream;
defaultExport = __exports;
function unbzip2Stream() {
    var bufferQueue = [];
    var hasBytes = 0;
    var blockSize = 0;
    var broken = false;
    var done = false;
    var bitReader = null;
    var streamCRC = null;
    function decompressBlock(push) {
        if (!blockSize) {
            blockSize = bz2.header(bitReader);
            streamCRC = 0;
            return true;
        } else {
            var bufsize = 100000 * blockSize;
            var buf = new Int32Array(bufsize);
            var chunk = [];
            var f = function (b) {
                chunk.push(b);
            };
            streamCRC = bz2.decompress(bitReader, f, buf, bufsize, streamCRC);
            if (streamCRC === null) {
                blockSize = 0;
                return false;
            } else {
                push(Buffer.from(chunk));
                return true;
            }
        }
    }
    var outlength = 0;
    function decompressAndQueue(stream) {
        if (broken)
            return;
        try {
            return decompressBlock(function (d) {
                stream.queue(d);
                if (d !== null) {
                    outlength += d.length;
                } else {
                }
            });
        } catch (e) {
            stream.emit('error', e);
            broken = true;
            return false;
        }
    }
    return through(function write(data) {
        bufferQueue.push(data);
        hasBytes += data.length;
        if (bitReader === null) {
            bitReader = bitIterator(function () {
                return bufferQueue.shift();
            });
        }
        while (!broken && hasBytes - bitReader.bytesRead + 1 >= (25000 + 100000 * blockSize || 4)) {
            decompressAndQueue(this);
        }
    }, function end(x) {
        while (!broken && bitReader && hasBytes > bitReader.bytesRead) {
            decompressAndQueue(this);
        }
        if (!broken) {
            if (streamCRC !== null)
                this.emit('error', new Error('input stream ended prematurely'));
            this.queue(null);
        }
    });
}
export default defaultExport;