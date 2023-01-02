export interface RenderSettings {
    wireframe: boolean;
    gradient: boolean;
    lighting: boolean;
    wireframeOpacity: number;
    wireframeLineWidth: number;
    dynamicScene?: boolean;
}

export const DefaultRenderSettings: RenderSettings = {
    wireframe: false,
    gradient: true,
    lighting: true,
    wireframeOpacity: 0.1,
    wireframeLineWidth: 2,
    dynamicScene: false
}