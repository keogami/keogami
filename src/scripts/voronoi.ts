type GL = WebGL2RenderingContext;

export type SetupGlslInit<Attrib extends string, Uniform extends string> = {
  gl: GL
  attribs: Record<Attrib, string>
  uniforms: Record<Uniform, string>
}

async function loadFile(path: string): Promise<string> {
  const res = await fetch(path);

  if (res.status !== 200) {
    throw new Error(`${path}: Not Found`);
  }

  return res.text();
}

function compileShader({ src, shaderType, gl, debugName }: { src: string, shaderType: number, gl: GL, debugName: string }): WebGLShader {
  const shader = gl.createShader(shaderType);
  if (!shader) {
    throw new Error(`Couldn't create shader for: ${debugName}`)
  }

  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    throw new Error(`Couldn't compile shader: ${debugName}`, {
      cause: gl.getShaderInfoLog(shader) ?? 'no clue why'
    })
  }

  return shader
}

function createProgram({ gl, vertex, fragment }: { gl: GL, vertex: WebGLShader, fragment: WebGLShader }): WebGLProgram {
  const program = gl.createProgram()
  if (!program) {
    throw new Error("Couldn't create webgl program");
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    throw new Error("Couldn't link shaders to the glsl program", {
      cause: gl.getProgramInfoLog(program) ?? 'no clue why'
    })
  }

  return program
}

type Positions<Attrib extends string, Uniform extends string> = {
  attribs: Record<Attrib, number>
  uniforms: Record<Uniform, WebGLUniformLocation>
}

export async function setupGlsl<
  Attrib extends string = string,
  Uniform extends string = string,
>({ gl, attribs: attribsMap, uniforms: uniformsMap }: SetupGlslInit<Attrib, Uniform>): Promise<Positions<Attrib, Uniform>> {
  const [fragmentSrc, vertexSrc] = await Promise.all([
    loadFile('/shaders/voronoi.fragment.glsl'),
    loadFile('/shaders/voronoi.vertex.glsl'),
  ])

  const fragment = compileShader({
    src: fragmentSrc,
    gl, shaderType: gl.FRAGMENT_SHADER, debugName: 'fragment'
  })
  const vertex = compileShader({
    src: vertexSrc,
    gl, shaderType: gl.VERTEX_SHADER, debugName: 'vertex'
  })

  const program = createProgram({ gl, vertex, fragment })

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)

  const attribKeys = Object.keys(attribsMap) as Attrib[]
  const attribs = Object.fromEntries(attribKeys.map(key => {
    const name = attribsMap[key]
    const position = gl.getAttribLocation(program, name)
    if (position < 0) {
      throw new Error(`The following attribute is not defined: ${name}`)
    }

    return [key, position]
  })) as Record<Attrib, number>

  const uniformKeys = Object.keys(uniformsMap) as Uniform[]
  const uniforms = Object.fromEntries(uniformKeys.map(key => {
    const name = uniformsMap[key]
    const position = gl.getUniformLocation(program, name)

    return [key, position]
  })) as Record<Uniform, WebGLUniformLocation>

  return {
    attribs,
    uniforms
  }
}

export function drawSomething({ gl, attribs, uniforms }: { gl: GL, attribs: Record<"aPosition", number>, uniforms: Record<"resolution", WebGLUniformLocation> }) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const vertices = new Float32Array([
    -1, -1,
    -1, 1,
    1, 1,
    1, 1,
    1, -1,
    -1, -1,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao)

  gl.enableVertexAttribArray(attribs.aPosition)

  gl.vertexAttribPointer(attribs.aPosition, 2, gl.FLOAT, false, 0, 0)

  gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
