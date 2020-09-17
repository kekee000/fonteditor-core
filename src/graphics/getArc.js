/**
 * @file 使用插值法获取椭圆弧度，以支持svg arc命令
 * @author mengke01(kekee000@gmail.com)
 *
 * modify from:
 * https://github.com/fontello/svgpath/blob/master/lib/a2c.js
 * references:
 * http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 */

import bezierCubic2Q2 from '../math/bezierCubic2Q2';


const TAU = Math.PI * 2;

function vectorAngle(ux, uy, vx, vy) {
    // Calculate an angle between two vectors
    const sign = (ux * vy - uy * vx < 0) ? -1 : 1;
    const umag = Math.sqrt(ux * ux + uy * uy);
    const vmag = Math.sqrt(ux * ux + uy * uy);
    const dot = ux * vx + uy * vy;
    let div = dot / (umag * vmag);

    if (div > 1 || div < -1) {
        // rounding errors, e.g. -1.0000000000000002 can screw up this
        div = Math.max(div, -1);
        div = Math.min(div, 1);
    }

    return sign * Math.acos(div);
}

function correctRadii(midx, midy, rx, ry) {
    // Correction of out-of-range radii
    rx = Math.abs(rx);
    ry = Math.abs(ry);

    const Λ = (midx * midx) / (rx * rx) + (midy * midy) / (ry * ry);
    if (Λ > 1) {
        rx *= Math.sqrt(Λ);
        ry *= Math.sqrt(Λ);
    }

    return [rx, ry];
}


function getArcCenter(x1, y1, x2, y2, fa, fs, rx, ry, sin_φ, cos_φ) {
    // Convert from endpoint to center parameterization,
    // see http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes

    // Step 1.
    //
    // Moving an ellipse so origin will be the middlepoint between our two
    // points. After that, rotate it to line up ellipse axes with coordinate
    // axes.
    //
    const x1p = cos_φ * (x1 - x2) / 2 + sin_φ * (y1 - y2) / 2;
    const y1p = -sin_φ * (x1 - x2) / 2 + cos_φ * (y1 - y2) / 2;

    const rx_sq = rx * rx;
    const ry_sq = ry * ry;
    const x1p_sq = x1p * x1p;
    const y1p_sq = y1p * y1p;

    // Step 2.
    //
    // Compute coordinates of the centre of this ellipse (cx', cy')
    // in the new coordinate system.
    //
    let radicant = (rx_sq * ry_sq) - (rx_sq * y1p_sq) - (ry_sq * x1p_sq);

    if (radicant < 0) {
        // due to rounding errors it might be e.g. -1.3877787807814457e-17
        radicant = 0;
    }

    radicant /= (rx_sq * y1p_sq) + (ry_sq * x1p_sq);
    radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

    const cxp = radicant * rx / ry * y1p;
    const cyp = radicant * -ry / rx * x1p;

    // Step 3.
    //
    // Transform back to get centre coordinates (cx, cy) in the original
    // coordinate system.
    //
    const cx = cos_φ * cxp - sin_φ * cyp + (x1 + x2) / 2;
    const cy = sin_φ * cxp + cos_φ * cyp + (y1 + y2) / 2;

    // Step 4.
    //
    // Compute angles (θ1, Δθ).
    //
    const v1x = (x1p - cxp) / rx;
    const v1y = (y1p - cyp) / ry;
    const v2x = (-x1p - cxp) / rx;
    const v2y = (-y1p - cyp) / ry;

    const θ1 = vectorAngle(1, 0, v1x, v1y);
    let Δθ = vectorAngle(v1x, v1y, v2x, v2y);

    if (fs === 0 && Δθ > 0) {
        Δθ -= TAU;
    }
    if (fs === 1 && Δθ < 0) {
        Δθ += TAU;
    }

    return [cx, cy, θ1, Δθ];
}

function approximateUnitArc(θ1, Δθ) {
    // Approximate one unit arc segment with bézier curves,
    // see http://math.stackexchange.com/questions/873224/
    //      calculate-control-points-of-cubic-bezier-curve-approximating-a-part-of-a-circle
    const α = 4 / 3 * Math.tan(Δθ / 4);

    const x1 = Math.cos(θ1);
    const y1 = Math.sin(θ1);
    const x2 = Math.cos(θ1 + Δθ);
    const y2 = Math.sin(θ1 + Δθ);

    return [x1, y1, x1 - y1 * α, y1 + x1 * α, x2 + y2 * α, y2 - x2 * α, x2, y2];
}


function a2c(x1, y1, x2, y2, fa, fs, rx, ry, φ) {
    const sin_φ = Math.sin(φ * TAU / 360);
    const cos_φ = Math.cos(φ * TAU / 360);

    // Make sure radii are valid
    //
    const x1p = cos_φ * (x1 - x2) / 2 + sin_φ * (y1 - y2) / 2;
    const y1p = -sin_φ * (x1 - x2) / 2 + cos_φ * (y1 - y2) / 2;

    if (x1p === 0 && y1p === 0) {
        // we're asked to draw line to itself
        return [];
    }

    if (rx === 0 || ry === 0) {
        // one of the radii is zero
        return [];
    }

    const radii = correctRadii(x1p, y1p, rx, ry);
    rx = radii[0];
    ry = radii[1];

    // Get center parameters (cx, cy, θ1, Δθ)
    //
    const cc = getArcCenter(x1, y1, x2, y2, fa, fs, rx, ry, sin_φ, cos_φ);

    const result = [];
    let θ1 = cc[2];
    let Δθ = cc[3];

    // Split an arc to multiple segments, so each segment
    // will be less than τ/4 (= 90°)
    //
    const segments = Math.max(Math.ceil(Math.abs(Δθ) / (TAU / 4)), 1);
    Δθ /= segments;

    for (let i = 0; i < segments; i++) {
        result.push(approximateUnitArc(θ1, Δθ));
        θ1 += Δθ;
    }

    // We have a bezier approximation of a unit circle,
    // now need to transform back to the original ellipse
    //
    return result.map(curve => {
        for (let i = 0; i < curve.length; i += 2) {
            let x = curve[i + 0];
            let y = curve[i + 1];

            // scale
            x *= rx;
            y *= ry;

            // rotate
            const xp = cos_φ * x - sin_φ * y;
            const yp = sin_φ * x + cos_φ * y;

            // translate
            curve[i + 0] = xp + cc[0];
            curve[i + 1] = yp + cc[1];
        }

        return curve;
    });
}

/**
 * 获取椭圆弧度
 *
 * @param {number} rx 椭圆长半轴
 * @param {number} ry 椭圆短半轴
 * @param {number} angle 旋转角度
 * @param {number} largeArc 是否大圆弧
 * @param {number} sweep 是否延伸圆弧
 * @param {Object} p0 分割点1
 * @param {Object} p1 分割点2
 * @return {Array} 分割后的路径
 */
export default function getArc(rx, ry, angle, largeArc, sweep, p0, p1) {
    const result = a2c(p0.x, p0.y, p1.x, p1.y, largeArc, sweep, rx, ry, angle);
    const path = [];

    if (result.length) {
        path.push({
            x: result[0][0],
            y: result[0][1],
            onCurve: true
        });

        // 将三次曲线转换成二次曲线
        result.forEach(c => {
            const q2Array = bezierCubic2Q2({
                x: c[0],
                y: c[1]
            }, {
                x: c[2],
                y: c[3]
            }, {
                x: c[4],
                y: c[5]
            }, {
                x: c[6],
                y: c[7]
            });

            q2Array[0][2].onCurve = true;
            path.push(q2Array[0][1]);
            path.push(q2Array[0][2]);
            if (q2Array[1]) {
                q2Array[1][2].onCurve = true;
                path.push(q2Array[1][1]);
                path.push(q2Array[1][2]);
            }
        });
    }

    return path;
}
