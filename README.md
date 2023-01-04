# LGTYI: Landscape Generator for TYI

## Вступ

Задача генерації ландшафтів залишається надзвичайно актуальною. Вона зустрічається не тільки в комп’ютерних іграх, а й у сучасних професійних симуляторах для навчання спеціалістів, у кіно, графічних роботах та інших сферах життя.

Проєкт створений відповідно до завдання Турніру юних інфроматиків 2022-2023 та являє собою генератор рельєфу з 2D- та 3D-візуалізацією, можливістю експорту та імпорту й іншими функціями. Він написаний на TypeScript, Svelte (на етапі компіляції перетворюються на JavaScript, HTML та CSS), власне JavaScript, HTML та CSS з використанням Electron.js. Рендеринг у 2D реалізовано на HTML5 Canvas без зовнішніх бібліотек. 3D-рендер використовує Three.js (WebGL-рендер) для GPU-прискорення. Випадкова генерація здійснюється за допомогою алгоритму, що заснований на шумі Перлина (Perlin noise).

## Установлення



## Інші розділи інструкції

## Зміст

Структура проєкту:

<!-- UNDESCRIBED: assets, docs -->

- docs
- public
	- assets
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
				- Pages
					- Help.svelte
					- Info.svelte
					- Tips.svelte 
				- HelpUiButtons.svelte
				- InfoPanels.ts
				- Panel.css
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
- AUTHORS
- LICENSE
- main.js
- package.json
- package-lock.json
- preload.js
- README.md (***you're here!***)
- rollup.config.js
- tsconfig.json
- typedoc.json
