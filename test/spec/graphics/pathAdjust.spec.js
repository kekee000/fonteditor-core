define(
    function (require) {
        var lang = require('common/lang');
        var pathAdjust = require('graphics/pathAdjust');

        var path = [
            {
                x: 50,
                y: 50
            },
            {
                x: 100,
                y: 100
            }
        ];

        describe('调整路径', function () {

            it('test default', function () {

                var result = pathAdjust(lang.clone(path));
                expect(result).toEqual([
                    {
                        x: 50,
                        y: 50
                    },
                    {
                        x: 100,
                        y: 100
                    }
                ]);

                var result = pathAdjust(lang.clone(path), 1, 1);
                expect(result).toEqual([
                    {
                        x: 50,
                        y: 50
                    },
                    {
                        x: 100,
                        y: 100
                    }
                ]);

                var result = pathAdjust(lang.clone(path), 1, 1, 0, 0);
                expect(result).toEqual([
                    {
                        x: 50,
                        y: 50
                    },
                    {
                        x: 100,
                        y: 100
                    }
                ]);
            });

            it('test scale', function () {

                var result = pathAdjust(lang.clone(path), 2, 2);
                expect(result).toEqual([
                    {
                        x: 100,
                        y: 100
                    },
                    {
                        x: 200,
                        y: 200
                    }
                ]);

                var result = pathAdjust(lang.clone(path), 0.5, 1);
                expect(result).toEqual([
                    {
                        x: 25,
                        y: 50
                    },
                    {
                        x: 50,
                        y: 100
                    }
                ]);

                var result = pathAdjust(lang.clone(path), 1, 2, 0, 0);
                expect(result).toEqual([
                    {
                        x: 50,
                        y: 100
                    },
                    {
                        x: 100,
                        y: 200
                    }
                ]);
            });


            it('test offset', function () {

                var result = pathAdjust(lang.clone(path), 1, 1, 10, 10);
                expect(result).toEqual([
                    {
                        x: 60,
                        y: 60
                    },
                    {
                        x: 110,
                        y: 110
                    }
                ]);

                var result = pathAdjust(lang.clone(path), 2, 2, 10, 10);
                expect(result).toEqual([
                    {
                        x: 120,
                        y: 120
                    },
                    {
                        x: 220,
                        y: 220
                    }
                ]);
            });

        });

    }
);
