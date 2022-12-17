export interface RenderOptions {
    useWireframe?: boolean;
    wireframeColor?: number;
    wireframeOpacity?: number;
    wireframeLineWidth?: number;
    prepareForLighting?: boolean;
}

export const DefaultRenderOptions: RenderOptions = {
    useWireframe: true,
    wireframeOpacity: 0.15,
    wireframeColor: 0xFFFFFF,
    wireframeLineWidth: 1.3,
    prepareForLighting: true
}