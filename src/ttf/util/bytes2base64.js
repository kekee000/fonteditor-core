/**
 * @file 二进制byte流转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var btoa = typeof window !== 'undefined' ? window.btoa : function (str) {
             return new Buffer(str, 'binary').toString('base64');
         };

        /**
         * 二进制byte流转base64编码
         *
         * @param {ArrayBuffer|Array} buffer ArrayBuffer对象
         * @return {string} base64编码
         */
        function bytes2base64(buffer) {
            var str = '';
            var length;
            var i;
            // ArrayBuffer
            if (buffer instanceof ArrayBuffer) {
                length = buffer.byteLength;
                var view = new DataView(buffer, 0, length);
                for (i = 0; i < length; i++) {
                    str += String.fromCharCode(view.getUint8(i, false));
                }
            }
            // Array
            else if (buffer.length) {
                length = buffer.length;
                for (i = 0; i < length; i++) {
                    str += String.fromCharCode(buffer[i]);
                }
            }

            return btoa(str);
        }

        return bytes2base64;
    }
);
