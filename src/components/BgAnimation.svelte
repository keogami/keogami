<script lang="ts">
  import { onMount } from "svelte";
  import { draw, setupGlsl } from "@scripts/voronoi.ts";

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
    if (!screen) {
      screen = new DOMRect(0, 0, innerWidth, innerHeight);
      return
    }
    screen.width = innerWidth;
    screen.height = innerHeight;
  }

  onMount(async () => {
    resizeScreen();
    const context = canvas.getContext("webgl2");
    if (!context) {
      return;
    }

    gl = context;
    moveMouse({ x: screen.width / 2, y: screen.height / 2});

    const { attribs, uniforms } = await setupGlsl({
      gl,
      attribs: {
        aPosition: "a_position",
      },
      uniforms: {
        resolution: "u_resolution",
        mouse: "u_mouse",
      }
    });

    addEventListener("resize", resizeScreen);
    addEventListener('pointermove', e => moveMouse({ x: e.clientX, y: e.clientY}))

    function drawLoop(time: DOMHighResTimeStamp) {
      draw({ gl, attribs, uniforms, screen, time, mouse });
      requestAnimationFrame(drawLoop)
    }

    requestAnimationFrame(drawLoop)
  });
</script>

<canvas bind:this={canvas}></canvas>

<style lang="sass">
  canvas
    position: fixed
    left: 0
    top: 0
    z-index: -1
</style>
