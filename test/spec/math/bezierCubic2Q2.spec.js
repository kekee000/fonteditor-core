define(
    function (require) {

        var bezierCubic2Q2 = require('math/bezierCubic2Q2');

        var p0 = {
            x: 50,
            y: 50
        };

        var c0 = {
            x: 80,
            y: 60
        };

        var c1 = {
            x: 60,
            y: 80
        };

        var p1 = {
            x: 100,
            y: 100
        };

        describe('三次bezier曲线转二次', function () {


            it('test c0=p0, c1 = p1', function () {
                var result = bezierCubic2Q2(p0, p0, p1, p1);
                expect(result[0]).toEqual([
                    {
                        x: 50,
                        y: 50
                    },
                    {
                        x: 75,
                        y: 75
                    },
                    {
                        x: 100,
                        y: 100
                    }
                ]);
                expect(result[1]).toBeUndefined();
            });


            it('normal', function () {
                var result = bezierCubic2Q2(p0, c0, c1, p1);

                expect(result.length).toBe(2);

                expect(result[0][1]).toEqual({
                    x: 69.0625,
                    y: 57.8125
                });

                expect(result[0][2]).toEqual({
                    x: 71.25,
                    y: 71.25
                });

                expect(result[0][2]).toEqual(result[1][0]);

                expect(result[1][1]).toEqual({
                    x: 73.4375,
                    y: 84.6875
                });
            });


        });

    }
);
