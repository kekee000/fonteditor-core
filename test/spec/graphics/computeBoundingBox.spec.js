define(
    function (require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');

        var p0 = {
            x: 50,
            y: 50,
            onCurve: true
        };

        var c0 = {
            x: 80,
            y: 60
        };

        var c1 = {
            x: 200,
            y: 200
        };

        var p1 = {
            x: 100,
            y: 100,
            onCurve: true
        };

        describe('计算包围盒', function () {



            it('test computeBounding', function () {

                var result = computeBoundingBox.computeBounding([]);
                expect(result).toBe(false);

                var result = computeBoundingBox.computeBounding([p0]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 0,
                    height: 0
                });

                var result = computeBoundingBox.computeBounding([p0, p1]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50
                });


                var result = computeBoundingBox.computeBounding([p0, c1, p1]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 150,
                    height: 150
                });
            });


            it('test quadraticBezier', function () {

                var result = computeBoundingBox.quadraticBezier(p0, p0, p0);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 0,
                    height: 0
                });

                var result = computeBoundingBox.quadraticBezier(p0, p0, p1);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50
                });

                var result = computeBoundingBox.quadraticBezier(p0, c0, p1);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50
                });

                var result = computeBoundingBox.quadraticBezier(p0, c1, p1);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 90,
                    height: 90
                });
            });

            it('test computePath', function () {
                var result = computeBoundingBox.computePath([p0]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 0,
                    height: 0
                });

                var result = computeBoundingBox.computePath([p0, p1]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50
                });


                var result = computeBoundingBox.computePath([p0, c1, p1]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 90,
                    height: 90
                });
            });


            it('test computePathBox', function () {

                var result = computeBoundingBox.computePathBox([]);
                expect(result).toBe(false);

                var result = computeBoundingBox.computePathBox([p0]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 0,
                    height: 0
                });

                var result = computeBoundingBox.computePathBox([p0, p1]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50
                });


                var result = computeBoundingBox.computePathBox([p0, c1, p1]);
                expect(result).toEqual({
                    x: 50,
                    y: 50,
                    width: 150,
                    height: 150
                });
            });



        });

    }
);
