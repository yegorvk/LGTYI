import { DefaultGradientSettings, type GradientSettings } from "../Terrain/PointColor";

/** High level render settings used in the UI */
 export interface RenderSettings {
    wireframe: boolean;
    gradient: boolean;
    lighting: boolean;
    wireframeOpacity: number;
    wireframeLineWidth: number;
    dynamicScene?: boolean;
    gradientSettings?: GradientSettings;
    textures?: boolean;
}

export const DefaultRenderSettings: RenderSettings = {
    wireframe: false,
    gradient: true,
    lighting: true,
    wireframeOpacity: 0.1,
    wireframeLineWidth: 2,
    dynamicScene: true,
    textures: false,
    gradientSettings: DefaultGradientSettings
}