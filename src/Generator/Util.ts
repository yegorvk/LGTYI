import type { GeneratorOptions } from "./GeneratorOptions";

/**
 * Calc Distance between 2d Vectors
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export function distance2(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2, dy = y1 - y2;
    return dx*dx + dy*dy;
}

/**
 * Calculate distance between 2d Vectors.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2, dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
}

/**
 * @param heightmap
 * @param outMinAlt
 * @param outMaxAlt
 * @param pow
 */
export function map_pow(
    heightmap: Float32Array,
    outMinAlt: number,
    outMaxAlt: number,
    pow: number
) {
    let minAlt = Infinity, maxAlt = -Infinity;

    for (let i = 0; i < heightmap.length; i++) {
        minAlt = Math.min(minAlt, heightmap[i]);
        maxAlt = Math.max(maxAlt, heightmap[i]);
    }

    const altRange = maxAlt - minAlt;
    const outAltRange = outMaxAlt - outMinAlt;

    for (let i = 0; i < heightmap.length; i++) {
        heightmap[i] = outMinAlt + outAltRange * Math.pow((heightmap[i] - minAlt) / altRange, pow);
        heightmap[i] = Math.max(outMinAlt, Math.min(outMaxAlt, heightmap[i]));
    }
}

/**
 * @param heightmap
 * @param outMinAlt
 * @param outMaxAlt
 */
export function map_array(
    heightmap: Float32Array,
    outMinAlt: number,
    outMaxAlt: number
) {
    let minAlt = Infinity, maxAlt = -Infinity;

    for (let i = 0; i < heightmap.length; i++) {
        minAlt = Math.min(minAlt, heightmap[i]);
        maxAlt = Math.max(maxAlt, heightmap[i]);
    }

    const altRange = maxAlt - minAlt;
    const outAltRange = outMaxAlt - outMinAlt;

    for (let i = 0; i < heightmap.length; i++) {
        heightmap[i] = outMinAlt + outAltRange * ((heightmap[i] - minAlt) / altRange);
        heightmap[i] = Math.max(outMinAlt, Math.min(outMaxAlt, heightmap[i]));
    }
}

export function alt(altNorm: number, options: GeneratorOptions) {
    return altRaw(
        options.minAltitude,
        options.maxAltitude,
        options.waterLevel,
        altNorm
    );
}

function altRaw(min: number, max: number, waterLevel: number, altNorm: number): number {
    if (altNorm < 0)
        return waterLevel + (waterLevel - min) * altNorm;
    else
        return waterLevel + (max - waterLevel) * altNorm;
}

export function sigmoid_prime(x: number): number {
    const sigmoid_val = 1.0 / (1.0 + Math.exp(-x));
    if (sigmoid_val <= 10*Number.EPSILON) return 0;
    return sigmoid_val * (1.0 - sigmoid_val);
}

export function v_add(lhs: Float32Array, rhs: Float32Array) {
    for (let i = 0; i < lhs.length; i++)
        lhs[i] += rhs[i];
}

export function map(v: number, min: number, max: number, outMin: number, outMax: number): number {
    return ((v - min) / (max - min)) * (outMax - outMin) + outMin;
}