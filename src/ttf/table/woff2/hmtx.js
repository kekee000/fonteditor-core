/**
 * @file woff2 hmtx 表
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var table = require('../table');

        var hmtx = table.create(
            'hmtx',
            [],
            {

                read: function (reader, ttf) {
                    reader.seek(this.offset);
                    var flags = reader.readerUint8();
                    return {
                        flags: flags
                    };
                },

                write: function (writer, ttf) {
                },

                size: function (ttf) {
                    return '';
                }
            }
        );

        return hmtx;
    }
);
