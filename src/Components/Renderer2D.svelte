<script lang="ts">
    import type {Heightmap} from "../Terrain/Heightmap";
    import {onMount} from "svelte";
    import {colorGrayScaleFromAltitude, colorRGBFromAltitude} from "../Terrain/PointColor";

    export let useColors = true;

    let canvas: HTMLCanvasElement;
    let canvasContext = null

    export let data: Heightmap;

    let scale = 1.0;
    let offsetX = 0;
    let offsetY = 0;

    const pixels = new Uint8ClampedArray(4*data.width*data.height)

    for (let i = 0; i < data.height; i++) {
        for (let j = 0; j < data.width; j++) {
            const base = 4*(i*data.width+j)
            const alt = data.data[(i+data.offsetY)*data.width+(j+data.offsetX)]

            if (useColors) {
                const color = colorRGBFromAltitude(alt)

                pixels[base] = (color >> 16) & 0xFF;
                pixels[base+1] = (color >> 8) & 0xFF;
                pixels[base+2] = color & 0xFF;
            } else {
                const grayscale = colorGrayScaleFromAltitude(alt)
                pixels[base] = pixels[base+1] = pixels[base+2] = grayscale 
            }

            pixels[base+3] = 255
        }
    }

    const imgData = new ImageData(pixels, data.width, data.height)
    let imgBmp: ImageBitmap = null
    
    createImageBitmap(
        imgData
    ).then(
        (bmp) => {
            imgBmp = bmp
            draw(canvasContext)
        },
        (reason) => {
            console.error(reason)
        }
    )

    console.log(imgData)

    function draw(ctx: CanvasRenderingContext2D) {
        if (imgBmp === null || ctx === null) return;

        ctx.resetTransform()
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.translate(
            -offsetX + canvas.width * (1 - scale) / 2,
            -offsetY + canvas.height * (1 - scale) / 2
        )

        ctx.scale(scale, scale)

        ctx.drawImage(imgBmp, 0, 0, canvas.width, canvas.height);
    }

    function fixOffsets() {
        const contentWidth = scale * canvas.width;
        const contentHeight = scale * canvas.height;

        const dWidth = Math.max(0, contentWidth - canvas.width)
        const dHeight = Math.max(0, contentHeight - canvas.height)

        offsetX = Math.max(offsetX, -dWidth / 2)
        offsetX = Math.min(offsetX, dWidth / 2)

        offsetY = Math.max(offsetY, -dHeight / 2)
        offsetY = Math.min(offsetY, dHeight / 2)
    }

    onMount(() => {
        canvasContext = canvas.getContext('2d');

        canvas.onwheel = (event: WheelEvent) => {
            event.preventDefault()

            fixOffsets()

            const delta = event.deltaY * scale * 0.001
            const oldScale = scale

            scale -= delta
            scale = Math.max(0.125, Math.min(8.0, scale));

            offsetX *= (scale / oldScale)
            offsetY *= (scale / oldScale)

            fixOffsets()

            draw(canvasContext)
        };

        function resizeCanvas() {
            canvas.height = window.innerHeight - 8;
            canvas.width = canvas.height * (data.width / data.height);

            if (canvas.width > window.innerWidth) {
                canvas.width = window.innerWidth - 8;
                canvas.height = canvas.width * (data.height / data.width);
            }
        }

        window.onresize = () => {
            resizeCanvas()
            draw(canvasContext)
        }

        resizeCanvas()

        let pointerDown = false
        let lastX = 0, lastY = 0

        document.onpointerdown = beginDrag
        document.onpointermove = drag
        document.onpointerup = document.onpointercancel = endDrag

        function beginDrag(event: PointerEvent) {
            if (event.isPrimary && !pointerDown) {
                pointerDown = true
                lastX = event.x, lastY = event.y
            }
        }

        function drag(event: PointerEvent) {
            if (event.isPrimary && pointerDown) {
                const deltaX = event.x - lastX
                const deltaY = event.y - lastY

                offsetX -= deltaX * 0.02
                offsetY -= deltaY * 0.02

                fixOffsets()

                draw(canvasContext)
            }
        }

        function endDrag(event: PointerEvent) {
            if (event.isPrimary && pointerDown) {
                pointerDown = false
            }
        }

        draw(canvasContext)
    });
</script>

<canvas id="rendererD2"
        bind:this={canvas}/>