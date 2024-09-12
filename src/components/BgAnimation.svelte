<script lang="ts">
  import { onMount } from "svelte";
  import { drawSomething, setupGlsl } from "@scripts/voronoi.ts";

  let canvas: HTMLCanvasElement;
  let gl: WebGL2RenderingContext;
  let screen: DOMRect;
  let mouse: DOMPoint;

  $: if (screen) {
    canvas.width = screen.width;
    canvas.height = screen.height;
  }

  function moveMouse(to: DOMPointInit) {
    mouse = DOMPoint.fromPoint(to);
  }

  function resizeScreen() {
    screen = new DOMRect(0, 0, innerWidth, innerHeight);
  }

  onMount(async () => {
    resizeScreen();
    const context = canvas.getContext("webgl2");
    if (!context) {
      return;
    }

    gl = context;

    const { attribs, uniforms } = await setupGlsl({
      gl,
      attribs: {
        aPosition: "a_position",
      },
      uniforms: {
        resolution: "u_resolution"
      }
    });

    drawSomething({ gl, attribs, uniforms });
    addEventListener("resize", resizeScreen);
  });
</script>

<canvas
  on:pointermove={(e) => moveMouse({ x: e.clientX, y: e.clientY })}
  bind:this={canvas}
></canvas>

<style lang="sass">
  canvas
    position: fixed
    left: 0
    top: 0
    z-index: -1
</style>
