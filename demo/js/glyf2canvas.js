/**
 * @file glyf2canvas.js
 * @author mengke01
 * @date
 * @description
 * glyf 的canvas绘制
 */

import drawPath from './drawPath';

/**
 * glyf canvas绘制
 *
 * @param {Object} glyf glyf数据
 * @param {CanvasRenderingContext2D} ctx canvas的context
 * @param {Object} options 绘制参数
 */
export default function glyf2canvas(glyf, ctx, options = {}) {

    if (!glyf) {
        return;
    }

    ctx.save();

    if (options.stroke) {
        ctx.strokeWidth = options.strokeWidth || 1;
        ctx.strokeStyle = options.strokeStyle || 'black';
    }
    else {
        ctx.fillStyle = options.fillStyle || 'black';
    }

    let height = glyf.yMax;
    let x = options.x || 0;
    let y = height + (options.y || 0);
    let scale = options.scale || 1;
    let i;
    let l;
    let contours;

    ctx.scale(scale, -scale);
    ctx.translate(x, -y);

    // 处理glyf轮廓
    ctx.beginPath();

    if (!glyf.compound) {

        contours = glyf.contours;
        for (i = 0, l = contours.length; i < l; i++) {
            drawPath(ctx, contours[i]);
        }
    }
    // 复合图元绘制
    else {
        let glyfs = glyf.glyfs;
        glyfs.forEach(function (g) {

            ctx.save();
            let transform = g.transform;
            ctx.transform(
                transform.a,
                transform.b,
                transform.c,
                transform.d,
                transform.e,
                transform.f
            );

            contours = g.glyf.contours;
            for (i = 0, l = contours.length; i < l; i++) {
                drawPath(ctx, contours[i]);
            }

            ctx.restore();
        });
    }

    if (false !== options.stroke) {
        ctx.stroke();
    }

    if (false !== options.fill) {
        ctx.fill();
    }

    ctx.restore();
}
