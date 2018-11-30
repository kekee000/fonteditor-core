/**
 * @file 根据transform参数变换轮廓
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var matrixUtil = require('../../graphics/matrix');
    var pathTransform = require('../../graphics/pathTransform');

    /**
     * 根据transform参数变换轮廓
     *
     * @param {Array} contours 轮廓集合
     * @param {Array} transforms 变换指令集合
     *     transforms = [{
     *         name: 'scale'
     *         params: [3,4]
     *     }]
     *
     * @return {Array} 变换后的轮廓数组
     */
    function contoursTransform(contours, transforms) {
        if (!contours || !contours.length || !transforms || !transforms.length) {
            return contours;
        }

        var matrix = [1, 0, 0, 1, 0, 0];
        for (var i = 0, l = transforms.length; i < l; i++) {
            var transform = transforms[i];
            var params = transform.params;
            switch (transform.name) {
                case 'translate':
                    matrix = matrixUtil.mul(matrix, [1, 0, 0, 1, params[0], params[1]]);
                    break;
                case 'scale':
                    matrix = matrixUtil.mul(matrix, [params[0], 0, 0, params[1], 0, 0]);
                    break;
                case 'matrix':
                    matrix = matrixUtil.mul(matrix,
                        [params[0], params[1], params[2], params[3], params[4], params[5]]);
                    break;
                case 'rotate':
                    var radian = params[0] * Math.PI / 180;
                    if (params.length > 1) {

                        matrix = matrixUtil.multiply(
                            matrix,
                            [1, 0, 0, 1, -params[1], -params[2]],
                            [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian), 0, 0],
                            [1, 0, 0, 1, params[1], params[2]]
                        );
                    }
                    else {
                        matrix = matrixUtil.mul(
                            matrix, [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian), 0, 0]);
                    }
                    break;
                case 'skewX':
                    matrix = matrixUtil.mul(matrix,
                        [1, 0, Math.tan(params[0] * Math.PI / 180), 1, 0, 0]);
                    break;
                case 'skewY':
                    matrix = matrixUtil.mul(matrix,
                        [1, Math.tan(params[0] * Math.PI / 180), 0, 1, 0, 0]);
                    break;
            }
        }

        contours.forEach(function (p) {
            pathTransform(p, matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        });

        return contours;
    }


    return contoursTransform;
});
