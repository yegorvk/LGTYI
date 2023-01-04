# LGTYI: Landscape Generator for TYI

The task of generating landscapes remains extremely relevant. It is found not only in computer games, but also in modern professional simulators for training specialists, in cinema, graphic works and other areas.

The project is a landscape generator, created in accordance with the task of the Tournament of Young Informatics 2022-2023. It implements detailed generation parameters (such as the size of the generated area, the range of altitudes, the roughness coefficient, the sea level, the number of biomes, the probability of the presence of certain types of landscape etc.), 2D and 3D visualization (and a control panel for their parameters), exporting, importing and other operations with  maps, saving and opening for projects and other features.

The project is written in TypeScript, Svelte (both are converted to JavaScript, HTML and CSS at the compilation stage), actually JavaScript, HTML and CSS. It is also using Electron.js. Rendering in 2D is implemented on HTML5 Canvas without external libraries. The 3D renderer uses Three.js (WebGL renderer) for GPU acceleration. Random generation is carried out using an algorithm based on Perlin noise.

## Installation and running

To install LGTYI, you may use the executable file, or you may assemble the project yourself.

If using an executable file, just download it, run it as an administrator and follow the on-screen instructions.

To assemble and run the project yourself:

1. Install Node.js:
	- Download the file from the [link](https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi);
	- Run the downloaded file as administrator;
	- Follow the on-screen instructions.
2. Install TypeScript by executing `npm i -g typescript` as an administrator.
3. Install Yarn by executing `npm i -g yarn` as an administrator.
4. Open the project folder in the console/terminal.
5. In the project folder execute `yarn` as an administrator.
6. To run LGTYI run `yarn electron-dev`.

## Implementation details

## Contents

The project structure:

<!-- UNDESCRIBED: assets, docs -->

- public
	- assets
	- docs
	- instruction
	- favicon.png
	- global.css
	- index.html
- src
	- Components
		- Notification
			- Notification.svelte
			- Notification.css
		- UI
			- InfoPages
				- HelpUiButtons.svelte
				- Info.svelte
				- InfoPanels.ts
				- Panel.svelte
			- Pages
			  - Generate.svelte
			  - ImageImport.svelte
			  - Main.svelte
			  - Operations.svelte
			  - Settings.svelte
			- Param
			  - Param.css
			  - Param.svelte
			- styles
				- Panel.css
			  - Burger.css
			  - Buttons.css
			  - Range.css
			  - UI.css
			- Pages.ts
			- UI.svelte
			- UIEventsHandler.ts
	  - LandscapeViewer3d.svetle
	  - Renderer2D.svelte
	- Docs
		- documentation.ts
		- files.ts
		- generator.ts
		- noise.ts
		- render.ts
		- shaders.ts
		- terrain.ts
		- types.ts
		- ui.ts
	- Files
	  - Adder.ts
	  - ExcelExporter.ts
	  - Exporter.ts
	  - ImageExporter.ts
	  - ImageImporter.ts
	  - Importer.ts
	  - Subtracter.ts
		- TextFileImport.ts
	- Fonts
	  - Comfortaa-Bold.ttf
	  - UbuntuCondensed-Regular.ttf
	- Generator
	  - Biome.ts
	  - Generator.ts
	  - GeneratorOptions.ts
	  - Util.ts
  - PerlinNoise
  	- PerlinNoise.js
  - Renderer
	  - RenderChunk.ts
	  - RenderOptions.ts
	  - RenderSettings.ts
	  - RenderTerrainTest.ts
	- Shaders
	  - phong.glsl.ts
	  - terrain.glsl.ts
	  - water.glsl.ts
	- Terrain
	  - Chunk.ts
	  - Heightmap.ts
	  - PointColor.ts
	- Types
	  - Color.ts
	  - Dimension.ts
	  - GrayscaleColor.ts
	  - SaveData.ts
	- App.svelte
	- CustomFlyControls.ts
	- Defaults.ts
	- index.ts
	- LoadScreen.css
	- math.ts
	- preload.js
- AUTHORS
- LICENSE
- main.js
- package.json
- package-lock.json
- README.md (***you're here!***)
- rollup.config.js
- rollup.config-1672844764418.cjs
- tsconfig.json
- typedoc.json
