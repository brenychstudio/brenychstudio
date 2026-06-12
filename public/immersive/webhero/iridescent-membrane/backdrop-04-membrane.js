(function () {
  const DEFAULT_OPTIONS = {
    performanceMode: "full",
    pointerReactive: true,
    density: 0.78,
    glow: 0.78,
    palette: {
      background: "#03050a",
      washA: "rgba(92, 210, 255, 0.46)",
      washB: "rgba(238, 102, 255, 0.3)",
      line: "rgba(178, 242, 255, 0.44)",
      spark: "rgba(246, 255, 255, 0.88)",
      textShield: "rgba(2, 5, 12, 0.72)",
    },
  };

  const MEMBRANE_RIBBONS = [
    { x: "-10%", y: "20%", width: "64%", height: "34%", rotate: "-14deg", delay: "-1.2s" },
    { x: "22%", y: "14%", width: "72%", height: "42%", rotate: "9deg", delay: "-4.7s" },
    { x: "48%", y: "42%", width: "60%", height: "32%", rotate: "-8deg", delay: "-7.4s" },
    { x: "4%", y: "58%", width: "58%", height: "28%", rotate: "13deg", delay: "-10.1s" },
  ];

  const vertexShaderSource = `
    attribute vec2 aPosition;

    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision highp float;

    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform vec2 uPointerVelocity;
    uniform float uPointerEnergy;
    uniform float uTime;

    float hash(vec2 p) {
      p = fract(p * vec2(127.1, 311.7));
      p += dot(p, p + 37.19);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 m = mat2(1.62, 1.18, -1.18, 1.62);

      for (int i = 0; i < 6; i++) {
        v += noise(p) * a;
        p = m * p + vec2(8.31, 2.77);
        a *= 0.5;
      }

      return v;
    }

    vec2 rotate2d(vec2 p, float a) {
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c) * p;
    }

    float softEllipse(vec2 uv, vec2 center, vec2 scale, float feather) {
      vec2 q = (uv - center) / scale;
      return 1.0 - smoothstep(0.0, feather, length(q));
    }

    float spectralRibbon(vec2 uv, float y, float width, float phase, float speed) {
      float flow = fbm(vec2(uv.x * 2.4 + phase, uv.y * 1.6 - uTime * 0.035));
      float wave = y
        + sin(uv.x * 5.8 + phase + uTime * speed) * 0.045
        + sin(uv.x * 13.0 - phase * 0.8 + uTime * speed * 0.54) * 0.018
        + (flow - 0.5) * 0.08;
      float d = abs(uv.y - wave);
      float core = 1.0 - smoothstep(0.0, width, d);
      float aura = 1.0 - smoothstep(0.0, width * 5.5, d);
      return core * 0.42 + aura * 0.58;
    }

    float membraneVein(vec2 uv, float seed) {
      vec2 p = uv - 0.5;
      p.x *= uResolution.x / max(1.0, uResolution.y);
      p = rotate2d(p, seed * 0.72 + sin(uTime * 0.05 + seed) * 0.08);
      float n = fbm(p * vec2(2.8, 5.4) + vec2(seed, uTime * 0.04));
      float ridge = sin((p.x + n * 0.18) * 18.0 + uTime * (0.18 + seed * 0.025));
      return smoothstep(0.62, 0.98, ridge * 0.5 + 0.5);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      float aspect = uResolution.x / max(1.0, uResolution.y);
      float t = uTime;
      vec2 pointer = mix(vec2(0.52, 0.48), uPointer, 0.92);

      vec2 pointerDelta = uv - pointer;
      pointerDelta.x *= aspect;
      float pointerDistance = length(pointerDelta);
      vec2 pointerNormal = pointerDistance > 0.0001
        ? vec2(pointerDelta.x / aspect, pointerDelta.y) / pointerDistance
        : vec2(0.0);
      float pressureRadius = 0.012 + uPointerEnergy * 0.018;
      float pointerPressure = exp(-(pointerDistance * pointerDistance) / pressureRadius);
      float pointerRipple = sin(pointerDistance * 68.0 - t * 6.4) * exp(-pointerDistance * 10.0) * uPointerEnergy;
      vec2 pointerWake = uPointerVelocity * pointerPressure * (0.036 + uPointerEnergy * 0.052);
      vec2 flowUv = uv - pointerNormal * (pointerPressure * 0.01 + pointerRipple * 0.0045) - pointerWake;
      vec2 aspectUv = flowUv;
      aspectUv.x *= aspect;

      vec3 ink = vec3(0.006, 0.009, 0.018);
      vec3 deep = vec3(0.018, 0.042, 0.082);
      vec3 cyan = vec3(0.22, 0.84, 1.0);
      vec3 violet = vec3(0.95, 0.42, 1.0);
      vec3 mint = vec3(0.44, 1.0, 0.84);

      vec3 color = mix(ink, deep, smoothstep(0.04, 0.82, uv.y));

      float breathing = fbm(aspectUv * vec2(1.65, 1.1) + vec2(t * 0.018, -t * 0.012));
      float pearl = fbm(aspectUv * vec2(3.7, 2.35) + vec2(-t * 0.035, t * 0.026));
      float membrane = softEllipse(
        flowUv,
        vec2(0.5 + (pointer.x - 0.5) * 0.11, 0.5 + (pointer.y - 0.5) * 0.08),
        vec2(0.58 + breathing * 0.09 + pointerPressure * 0.014, 0.33 + breathing * 0.05 + pointerPressure * 0.01),
        1.0
      );

      float upperPressure = softEllipse(flowUv, vec2(0.42, 0.27), vec2(0.62, 0.24), 1.0);
      float lowerPressure = softEllipse(flowUv, vec2(0.58, 0.72), vec2(0.72, 0.32), 1.0);
      color += cyan * upperPressure * 0.135;
      color += violet * lowerPressure * 0.15;
      color += mix(cyan, violet, breathing) * membrane * 0.205;
      color += mix(mint, violet, pearl) * smoothstep(0.46, 0.86, pearl) * membrane * 0.102;

      float ribbonA = spectralRibbon(flowUv, 0.34, 0.024, 0.3, 0.22);
      float ribbonB = spectralRibbon(flowUv, 0.52, 0.032, 2.4, -0.18);
      float ribbonC = spectralRibbon(flowUv, 0.68, 0.022, 4.9, 0.15);
      float ribbons = max(ribbonA, max(ribbonB * 0.82, ribbonC * 0.72));
      color += cyan * ribbonA * 0.18;
      color += violet * ribbonB * 0.18;
      color += mint * ribbonC * 0.115;
      color += vec3(0.9, 0.96, 1.0) * pow(ribbons, 3.2) * 0.055;

      float veins = 0.0;
      for (int i = 0; i < 7; i++) {
        veins += membraneVein(flowUv, float(i) * 1.17) * (0.12 + float(i) * 0.01);
      }
      color += mix(cyan, violet, uv.x) * veins * membrane * 0.12;

      float interference = 0.0;
      interference += sin((flowUv.x + breathing * 0.04) * 420.0 + t * 0.42) * 0.5 + 0.5;
      interference *= sin((flowUv.y - breathing * 0.02) * 280.0 - t * 0.35) * 0.5 + 0.5;
      color += mix(cyan, violet, uv.y) * pow(interference, 9.0) * membrane * 0.018;

      float pointerGlow = softEllipse(uv, pointer, vec2(0.16, 0.12), 1.0);
      float pointerRing = exp(-abs(pointerDistance - (0.052 + uPointerEnergy * 0.034)) * 54.0) * uPointerEnergy;
      float pointerCore = exp(-pointerDistance * pointerDistance / 0.004) * uPointerEnergy;
      vec3 pointerColor = mix(cyan, violet, pointer.x);
      color += pointerColor * pointerGlow * (0.012 + uPointerEnergy * 0.018);
      color += vec3(0.92, 0.98, 1.0) * pointerCore * 0.008;
      color += mix(mint, violet, 0.42) * pointerRing * 0.014;

      vec2 dustGrid = floor(uv * uResolution.xy * 0.45);
      float dust = smoothstep(0.992, 1.0, hash(dustGrid));
      float twinkle = 0.28 + 0.72 * sin(t * 0.9 + hash(dustGrid) * 6.283185);
      color += vec3(0.72, 0.91, 1.0) * dust * twinkle * 0.06;

      float copyZone = max(
        softEllipse(uv, vec2(0.22, 0.58), vec2(0.34, 0.45), 1.0),
        softEllipse(uv, vec2(0.72, 0.46), vec2(0.36, 0.32), 1.0)
      );
      color = mix(color, color * vec3(0.62, 0.7, 0.86), copyZone * 0.2);

      float vignette = smoothstep(0.94, 0.28, length((uv - 0.5) * vec2(1.08, 0.98)));
      color *= mix(0.34, 1.0, vignette);
      color += vec3(0.004, 0.006, 0.012) * fbm(uv * vec2(48.0, 34.0) + t * 0.02) * 0.06;
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luma), color, 1.12);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resolvePerformanceMode(root) {
    return root.dataset.backdropPerformance === "library" ? "library" : "full";
  }

  function getBackdropDprMax(root, fullDprMax) {
    if (resolvePerformanceMode(root) !== "library") return fullDprMax;
    const mobile = window.innerWidth < 768;
    return Math.min(fullDprMax, mobile ? 0.82 : 0.88);
  }

  function shouldRenderBackdropFrame(root, timestamp, lastFrameTime) {
    if (resolvePerformanceMode(root) !== "library") return true;
    return timestamp - lastFrameTime >= 1000 / 32;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function createProgram(gl) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  function applyVariables(root, options) {
    const palette = options.palette || DEFAULT_OPTIONS.palette;
    root.style.setProperty("--fsb-bg", palette.background);
    root.style.setProperty("--fsb-wash-a", palette.washA);
    root.style.setProperty("--fsb-wash-b", palette.washB);
    root.style.setProperty("--fsb-line", palette.line);
    root.style.setProperty("--fsb-spark", palette.spark);
    root.style.setProperty("--fsb-shield", palette.textShield);
    root.style.setProperty("--fsb-density", String(options.density));
    root.style.setProperty("--fsb-glow", String(options.glow));
  }

  function createLayer(className) {
    const node = document.createElement("div");
    node.className = className;
    return node;
  }

  function buildStructure(root) {
    root.innerHTML = "";

    root.appendChild(createLayer("fsb-layer fsb-base"));

    const canvas = document.createElement("canvas");
    canvas.className = "fsb-membrane-webgl";
    root.appendChild(canvas);

    root.appendChild(createLayer("fsb-layer fsb-soft-vault"));
    root.appendChild(createLayer("fsb-layer fsb-membrane-flow"));

    const ribbons = createLayer("fsb-membrane-ribbons");
    MEMBRANE_RIBBONS.forEach((ribbon) => {
      const span = document.createElement("span");
      span.className = "fsb-membrane-ribbon";
      span.style.setProperty("--fsb-ribbon-x", ribbon.x);
      span.style.setProperty("--fsb-ribbon-y", ribbon.y);
      span.style.setProperty("--fsb-ribbon-width", ribbon.width);
      span.style.setProperty("--fsb-ribbon-height", ribbon.height);
      span.style.setProperty("--fsb-ribbon-rotate", ribbon.rotate);
      span.style.setProperty("--fsb-ribbon-delay", ribbon.delay);
      ribbons.appendChild(span);
    });
    root.appendChild(ribbons);

    root.appendChild(createLayer("fsb-layer fsb-center-shield"));
    root.appendChild(createLayer("fsb-layer fsb-vignette"));

    return canvas;
  }

  function mount(element, userOptions) {
    if (!element) {
      throw new Error("Backdrop04Membrane.mount requires a DOM element.");
    }

    if (typeof element.__backdrop04Destroy === "function") {
      element.__backdrop04Destroy();
    }

    const options = {
      ...DEFAULT_OPTIONS,
      ...userOptions,
      palette: {
        ...DEFAULT_OPTIONS.palette,
        ...(userOptions && userOptions.palette ? userOptions.palette : {}),
      },
    };

    element.classList.add("wh-backdrop04", "field-scene-cinematic-backdrop");
    element.dataset.theme = "dark";
    element.dataset.variant = "membrane";
    element.dataset.backdropPerformance =
      options.performanceMode || element.dataset.backdropPerformance || "full";

    applyVariables(element, options);
    const canvas = buildStructure(element);

    const pointer = {
      x: 0.52,
      y: 0.48,
      targetX: 0.52,
      targetY: 0.48,
      velocityX: 0,
      velocityY: 0,
      targetVelocityX: 0,
      targetVelocityY: 0,
      energy: 0,
      targetEnergy: 0,
    };

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      const destroyWithoutGl = function () {
        delete element.__backdrop04Destroy;
      };
      element.__backdrop04Destroy = destroyWithoutGl;
      return { destroy: destroyWithoutGl, element: element };
    }

    const program = createProgram(gl);
    if (!program) {
      const destroyWithoutProgram = function () {
        delete element.__backdrop04Destroy;
      };
      element.__backdrop04Destroy = destroyWithoutProgram;
      return { destroy: destroyWithoutProgram, element: element };
    }

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const pointerVelocityLocation = gl.getUniformLocation(program, "uPointerVelocity");
    const pointerEnergyLocation = gl.getUniformLocation(program, "uPointerEnergy");
    const timeLocation = gl.getUniformLocation(program, "uTime");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    let mounted = true;
    let animationFrame = null;
    let lastFrameTime = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, getBackdropDprMax(element, 1.75));
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    }

    function handleMove(event) {
      if (!options.pointerReactive) return;

      const rect = canvas.getBoundingClientRect();
      const nextX = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      const nextY = clamp(1 - (event.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
      const dx = nextX - pointer.targetX;
      const dy = nextY - pointer.targetY;
      const speed = Math.hypot(dx, dy);

      pointer.targetX = nextX;
      pointer.targetY = nextY;
      pointer.targetVelocityX = clamp(dx * 2.7, -0.12, 0.12);
      pointer.targetVelocityY = clamp(dy * 2.7, -0.12, 0.12);
      pointer.targetEnergy = clamp(Math.max(pointer.targetEnergy, speed * 4.8), 0, 0.62);
    }

    function render(timestamp) {
      if (!mounted) return;

      if (!shouldRenderBackdropFrame(element, timestamp, lastFrameTime)) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timestamp;

      resize();

      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;
      pointer.velocityX += (pointer.targetVelocityX - pointer.velocityX) * 0.12;
      pointer.velocityY += (pointer.targetVelocityY - pointer.velocityY) * 0.12;
      pointer.energy += (pointer.targetEnergy - pointer.energy) * 0.1;
      pointer.targetVelocityX *= 0.8;
      pointer.targetVelocityY *= 0.8;
      pointer.targetEnergy *= 0.82;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      gl.uniform2f(pointerVelocityLocation, pointer.velocityX, pointer.velocityY);
      gl.uniform1f(pointerEnergyLocation, pointer.energy);
      gl.uniform1f(timeLocation, timestamp * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationFrame = window.requestAnimationFrame(render);
    }

    function destroy() {
      mounted = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      delete element.__backdrop04Destroy;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handleMove, { passive: true });
    resize();
    animationFrame = window.requestAnimationFrame(render);

    element.__backdrop04Destroy = destroy;
    return { destroy: destroy, element: element, canvas: canvas };
  }

  function autoMount() {
    const nodes = document.querySelectorAll("[data-backdrop04-membrane]");
    nodes.forEach(function (node) {
      if (node.__backdrop04Destroy) return;
      mount(node, {
        performanceMode: node.dataset.backdropPerformance || "full",
        pointerReactive: node.dataset.pointerReactive !== "false",
      });
    });
  }

  window.Backdrop04Membrane = {
    mount: mount,
    autoMount: autoMount,
    version: "1.0.0",
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }
})();
