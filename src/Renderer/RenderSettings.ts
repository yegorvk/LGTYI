export interface RenderSettings {
    wireframe: boolean;
    gradient: boolean;
    lighting: boolean;
    wireframeOpacity: number;
    wireframeLineWidth: number;
}

export const DefaultRenderSettings: RenderSettings = {
    wireframe: true,
    gradient: true,
    lighting: true,
    wireframeOpacity: 0.1,
    wireframeLineWidth: 2
}