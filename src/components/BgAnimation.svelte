<script lang="ts">
  import { onMount } from "svelte";
  import { draw, setupGlsl } from "@scripts/voronoi.ts";

  let canvas: HTMLCanvasElement;
  let gl: WebGL2RenderingContext;
  let screen: DOMRect;
  let mouse: DOMPoint;
  let delayedMouse: DOMPoint;
  let opacity: number = 1.0;

  $: if (screen) {
    canvas.width = screen.width;
    canvas.height = screen.height;
  }

  function lerp(start: number, end: number, amount: number) {
    return (1 - amount) * start + amount * end;
  };

  function moveMouse(to: DOMPointInit) {
    mouse = DOMPoint.fromPoint(to);
    opacity = lerp(opacity, 1.0, 0.08);
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
    delayedMouse = new DOMPoint(screen.width / 2, screen.height / 2);

    const { attribs, uniforms } = await setupGlsl({
      gl,
      attribs: {
        aPosition: "a_position",
      },
      uniforms: {
        resolution: "u_resolution",
        mouse: "u_mouse",
        time: "u_time",
        opacity: "u_opacity",
      }
    });

    addEventListener("resize", resizeScreen);
    addEventListener('pointermove', e => moveMouse({ x: e.clientX, y: e.clientY}))
    addEventListener('touchmove', e => moveMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY}))

    function drawLoop(time: DOMHighResTimeStamp) {
      delayedMouse.x = lerp(delayedMouse.x, mouse.x, 0.05);
      delayedMouse.y = lerp(delayedMouse.y, mouse.y, 0.05);
      opacity = lerp(opacity, 0.0, 0.03);
      draw({ gl, attribs, uniforms, screen, time, mouse: delayedMouse, opacity });
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
