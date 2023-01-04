# LGTYI: Landscape Generator for TYI

Задача генерації ландшафтів залишається надзвичайно актуальною. Вона зустрічається не тільки в комп’ютерних іграх, а й у сучасних професійних симуляторах для навчання спеціалістів, у кіно, графічних роботах та інших сферах життя.

Проєкт являє собою генератор рельєфу, створений відповідно до завдання Турніру юних інфроматиків 2022-2023. У ньому реалізовано детальні параметри генерації (такі як розміри ділянки, що генерується, діапазон висот, коефіцієнт посіченості поверхні, рівень моря, кількість біомів, імовірність наявності певних типів ландшафту тощо), 2D- та 3D-візуалізацію (та панель керування їх параметрами), можливість експорту, імпорту мап та інші операції з ними, можливість збереження та відкриття проєкту й інші функції.

Проєкт написаний на TypeScript, Svelte (на етапі компіляції перетворюються на JavaScript, HTML та CSS), власне JavaScript, HTML та CSS з використанням Electron.js. Рендеринг у 2D реалізовано на HTML5 Canvas без зовнішніх бібліотек. 3D-рендер використовує Three.js (WebGL-рендер) для GPU-прискорення. Випадкова генерація здійснюється за допомогою алгоритму, що заснований на шумі Перлина (Perlin noise).

## Установлення та запуск

Для установлення LGTYI ви можете скористатися виконуваним файлом, а можете зібрати проєкт самостійно.

У разі використання виконуваного файлу достатньо завантажити його, запустити від імені адміністратора та дотримуватись інструкцій на екрані.

Для самостійної зборки та запуску:

1. Установіть Node.js:
	- Завантажте файл за [посиланням](https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi);
	- Виконайте завантажений файл від імені адміністратора;
	- Дотримуйтесь інструкцій інсталятора.
2. Установіть TypeScript, виконавши від імені адміністратора команду `npm i -g typescript`.
3. Установіть Yarn, виконавши від імені адміністратора команду `npm i -g yarn`.
4. Перейдіть у теку проєкту в консолі/терміналі.
5. У теці проєкту виконайте від імені адміністратора команду `yarn`.
6. Для запуску LGTYI виконайте команду `yarn electron-dev`.

## Деталі реалізації

## Зміст

Структура проєкту:

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
