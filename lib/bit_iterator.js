var __exports;
var BITMASK = [
    0,
    1,
    3,
    7,
    15,
    31,
    63,
    127,
    255
];
__exports = function bitIterator(nextBuffer) {
    var bit = 0;
    var byte = 0;
    var bytes = nextBuffer();
    var f = function (n) {
        if (n === null && bit != 0) {
            bit = 0;
            byte++;
            return;
        }
        var result = 0;
        while (n > 0) {
            if (byte >= bytes.length) {
                byte = 0;
                bytes = nextBuffer();
            }
            var left = 8 - bit;
            if (bit === 0 && n > 0)
                f.bytesRead++;
            if (n >= left) {
                result <<= left;
                result |= BITMASK[left] & bytes[byte++];
                bit = 0;
                n -= left;
            } else {
                result <<= n;
                result |= (bytes[byte] & BITMASK[n] << 8 - n - bit) >> 8 - n - bit;
                bit += n;
                n = 0;
            }
        }
        return result;
    };
    f.bytesRead = 0;
    return f;
};
module.exports = __exports;