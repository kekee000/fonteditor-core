/**
 * @file 按X轴平移变换, 变换中心为图像中心点
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var computeBoundingBox = require('./computeBoundingBox');

        /**
         * path倾斜变换
         *
         * @param {Object} contour 坐标点
         * @param {number} angle 角度
         *
         * @return {Object} contour 坐标点
         */
        function pathSkewX(contour, angle) {
            angle = angle === undefined ? 0 : angle;
            var y = computeBoundingBox.computePath(contour).y;
            var tan = Math.tan(angle);
            var p;
            // x 平移
            for (var i = 0, l = contour.length; i < l; i++) {
                p = contour[i];
                p.x += tan * (p.y - y);
            }
            return contour;
        }

        return pathSkewX;
    }
);
