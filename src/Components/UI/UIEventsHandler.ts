import type {Panels} from "./Pages";
import {DefaultRenderSettings, type RenderSettings} from "../../Renderer/RenderSettings";
import {DefaultGeneratorOptions, type GeneratorOptions} from "../../Generator/GeneratorOptions";
import type {Color} from "../../Types/Color";
import type {GrayscaleColor} from "../../Types/GrayscaleColor";
import {DefaultGradientSettings} from "../../Terrain/PointColor";


/**
 * This class is used for handling UI elements.
 * It is responsible for saving render settings, generator options and sending all events from the UI buttons to the generator.
 *
 * */
export class UIEventsHandler {
    private readonly dispatcher: Function;
    private useColorFor2D: boolean = false;
    public setPanel: (panel: Panels) => void;
    private _generatorOptions: GeneratorOptions = DefaultGeneratorOptions;
    private _renderSettings: RenderSettings = DefaultRenderSettings;

    get renderTrueSettings(): RenderSettings {
        return this._renderSettings;
    }

    set renderTrueSettings(value: RenderSettings) {
        this._renderSettings = value;
        this.dispatcher('settings_save', {render: this._renderSettings});
    }

    get renderSettings(): any[] {
        const mode: string[] = [];
        if (this._renderSettings.wireframe) {
            mode.push("2");
        }
        if (this._renderSettings.gradient) {
            mode.push("3");
        }
        if (this._renderSettings.lighting) {
            mode.push("1");
        }
        return [mode, this._renderSettings.wireframeOpacity, this._renderSettings.wireframeLineWidth, this._renderSettings.dynamicScene, this._renderSettings.gradientSettings.landColors]
    }

    set generatorOptions(value: GeneratorOptions) {
        this._generatorOptions = value;
        this._generatorOptions.seed = (value.seed === null) ? 0 : value.seed;
        this._generatorOptions.roughness = value.roughness / 100;
    }

    get generatorOptions(): GeneratorOptions {
        return this._generatorOptions;
    }

    public constructor(dispatcher: Function) {
        this.dispatcher = dispatcher;
        this._generatorOptions = DefaultGeneratorOptions;
    }

    public setGeneratorOptions(generatorOptions: GeneratorOptions) {
        this._generatorOptions = generatorOptions;
    }

    public getGenData(): GeneratorOptions {
        return this._generatorOptions;
    }

    /**
     * @event
     */
    public Import() {
        this.dispatcher('import_map');
    }

    public FontSwitch() {
        this.dispatcher('font_switch');
    }

    /**
     * @event
     */
    public Add() {
        this.dispatcher('add_map');
    }

    /**
     * @event
     */
    public Substr() {
        this.dispatcher('substr_map');
    }

    /**
     * @event
     */
    public ExcelExport() {
        this.dispatcher('excel_export_map');
    }

    /**
     * @event
     */
    public ImageExport() {
        this.dispatcher('image_export_map');
    }

    /**
     * @event
     */
    public ImageImport(isAlphaMode: boolean, isColorMode: boolean, color: Color, grayscaleColor: GrayscaleColor, waterLevel: number, isInverted: boolean) {
        this.dispatcher('image_import_map', {
            grayscale: grayscaleColor,
            color: color,
            isAlphaMode: isAlphaMode,
            isColorMode: isColorMode,
            isInverted: isInverted,
            waterLevel: waterLevel
        });
    }

    /**
     * @event
     */
    public settingsSave(mode: string[], wireframeLineWidth: number, wireframeOpacity: number, dynamicScene: boolean, colors: string[]) {
        let colors16: any[] = colors.concat();
        for(let i = 0; i < colors.length; i++) {
            colors16[i] = parseInt('0x' + colors16[i].split('#')[1]);
        }

        const renderSettings: RenderSettings = {
            wireframe: mode.includes("2"),
            gradient: mode.includes("3"),
            lighting: mode.includes("1") && mode.includes("3"),
            wireframeOpacity: wireframeOpacity,
            wireframeLineWidth: wireframeLineWidth,
            dynamicScene: dynamicScene,
            gradientSettings: DefaultGradientSettings
        }
        renderSettings.gradientSettings.landColors = colors16;
        this._renderSettings = renderSettings;
        this.dispatcher('settings_save', {render: renderSettings});
    }

    /**
     * @event
     */
    public d2SettingsSwitch() {
        this.useColorFor2D = !this.useColorFor2D;
        this.dispatcher('settings_save_2d', {useColors: this.useColorFor2D});
    }

    /**
     * @event
     */
    public Export(seed: number, width: number, height: number, maxAltitude: number, minAltitude: number, levelOfDetail: number, roughness: number, waterLevel: number) {
        this.dispatcher('export_map', {
            genOpt: {
                seed,
                width,
                height,
                maxAltitude,
                minAltitude,
                levelOfDetail,
                roughness,
                waterLevel
            }
        });
    }
}