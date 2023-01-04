export function lerp(v1: number, v2: number, a: number): number {
    return a*v2+v1*(1-a);
}

export const INF: number = 10000;