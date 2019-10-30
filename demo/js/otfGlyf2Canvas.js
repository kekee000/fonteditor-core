/**
 * @file otf的glyf绘制
 * @author mengke01(kekee000@gmail.com)
 */


function drawPath(ctx, contour) {
    let curPoint;
    let nextPoint;
    let nextNextPoint;
    ctx.moveTo(contour[0].x, contour[0].y);
    for (let i = 1, l = contour.length; i < l; i++) {
        curPoint = contour[i];
        if (curPoint.onCurve) {
            ctx.lineTo(curPoint.x, curPoint.y);
        }
        // 三次bezier曲线
        else {
            nextPoint = contour[i + 1];
            nextNextPoint = i === l - 2 ? contour[0] : contour[i + 2];
            ctx.bezierCurveTo(curPoint.x, curPoint.y, nextPoint.x, nextPoint.y, nextNextPoint.x, nextNextPoint.y);
            i += 2;
        }
    }
}

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

    let scale = options.scale || 1;
    let i;
    let l;

    ctx.scale(scale, -scale);
    ctx.translate(0, -options.height);

    // 处理glyf轮廓
    ctx.beginPath();
    let contours = glyf.contours;
    for (i = 0, l = contours.length; i < l; i++) {
        if (contours[i].length) {
            drawPath(ctx, contours[i]);
        }
    }

    if (false !== options.stroke) {
        ctx.stroke();
    }

    if (false !== options.fill) {
        ctx.fill();
    }

    ctx.restore();
}
