import type {Panels} from "./Pages";
import type {RenderSettings} from "../../Renderer/RenderSettings";
import {DefaultGeneratorOptions, type GeneratorOptions} from "../../Terrain/GeneratorOptions";

export class UIEventsHandler {
    private readonly dispatcher: Function;
    private useColorFor2D: boolean = false;
    public setPanel: (panel: Panels) => void;
    public generatorOptions: GeneratorOptions;

    public constructor(dispatcher: Function) {
        this.dispatcher = dispatcher;
        this.generatorOptions = DefaultGeneratorOptions;
    }
    public setGeneratorOptions(generatorOptions: GeneratorOptions) {
        this.generatorOptions = generatorOptions;
    }

    public getGenData(): GeneratorOptions {
        return this.generatorOptions;
    }

    public Import() {
        this.dispatcher('import_map');
    }

    public Add() {
        this.dispatcher('add_map');
    }

    public Substr() {
        this.dispatcher('substr_map');
    }

    public ExcelExport() {
        this.dispatcher('excel_export_map');
    }

    public ImageExport() {
        this.dispatcher('image_export_map');
    }

    public ImageImport() {
        this.dispatcher('image_import_map');
    }

    public settingsSave(mode: string[], wireframeLineWidth: number, wireframeOpacity: number) {
        const renderSettings: RenderSettings = {
            wireframe: mode.includes("2"),
            gradient: mode.includes("3"),
            lighting: mode.includes("1") && mode.includes("3"),
            wireframeOpacity: wireframeOpacity,
            wireframeLineWidth: wireframeLineWidth
        }
        this.dispatcher('settings_save', {render: renderSettings});
    }

    public d2SettingsSwitch() {
        this.useColorFor2D = !this.useColorFor2D;
        this.dispatcher('settings_save_2d', {useColors: this.useColorFor2D});
    }

    public Export(seed: number, width: number, height: number, maxAltitude: number, minAltitude: number, levelOfDetail: number, roughnessCoefficient: number, waterLevel: number) {
        this.dispatcher('export_map', {
            genOpt: {
                seed,
                width,
                height,
                maxAltitude,
                minAltitude,
                levelOfDetail,
                roughnessCoefficient,
                waterLevel
            }
        });
    }
}