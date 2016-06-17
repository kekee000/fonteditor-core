
define(
    function (require) {

        var TTFReader = require('ttf/ttfreader');
        var ttf2symbol = require('ttf/ttf2symbol');

        describe('ttf 转 symbol', function () {

            var fontObject = new TTFReader().read(require('data/baiduHealth.ttf'));
            var svg = ttf2symbol(fontObject);

            it('test genrate svg symbol', function () {
                expect(svg.length).toBeGreaterThan(1000);
                expect(svg.match(/<symbol\s/g).length).toBe(14);
            });
        });

    }
);
