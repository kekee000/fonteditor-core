/**
 * @file woff2文档格式工具函数
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    var woff2TableTags = require('../enum/woff2TableTags');

    var woff2 = {

        getTableTag: function (flag) {
            return woff2TableTags[flag];
        },

        readUIntBase128: function (reader) {
            var accum = 0;
            for (i = 0; i < 5; i++) {
                var dataByte = reader.readUint8();

                // No leading 0's
                if (i == 0 && dataByte === 0x80) {
                    return false;
                }

                // If any of top 7 bits are set then << 7 would overflow
                if (accum & 0xFE000000) {
                    return false;
                }

                accum = (accum << 7) | (dataByte & 0x7F);

                // Spin until most significant bit of data byte is false
                if ((dataByte & 0x80) == 0) {
                    return accum;
                }
            }

            // UIntBase128 sequence exceeds 5 bytes
            return false;
        },

        read255UShort: function(reader) {
            var code;
            var value, value2;

            var oneMoreByteCode1    = 255;
            var oneMoreByteCode2    = 254;
            var wordCode            = 253;
            var lowestUCode         = 253;

            code = reader.readUint8();
            if (code === wordCode) {
                /* Read two more bytes and concatenate them to form UInt16 value*/
                value = reader.readUint8();
                value <<= 8;
                value &= 0xff00;
                value2 = reader.readUint8();
                value |= value2 & 0x00ff;
            }
            else if (code === oneMoreByteCode1) {
                value = reader.readUint8();
                value = (value + lowestUCode);
            }
            else if (code === oneMoreByteCode2) {
                value = reader.readUint8();
                value = (value + lowestUCode*2);
            }
            else {
                value = code;
            }

            return value;
        }
    };

    return woff2;
});
