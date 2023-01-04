import { DEFAULT_LAND_COLORS } from "../Terrain/PointColor";

 export interface RenderSettings {
    wireframe: boolean;
    gradient: boolean;
    lighting: boolean;
    wireframeOpacity: number;
    wireframeLineWidth: number;
    dynamicScene?: boolean;
    landColors?: Array<number>
}

export const DefaultRenderSettings: RenderSettings = {
    wireframe: false,
    gradient: true,
    lighting: true,
    wireframeOpacity: 0.1,
    wireframeLineWidth: 2,
    dynamicScene: true,
    landColors: DEFAULT_LAND_COLORS
}