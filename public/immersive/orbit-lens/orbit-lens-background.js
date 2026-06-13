/*!
 * Orbit Lens WebGL backdrop
 * Dedicated raw WebGL background for the Orbit Lens hero.
 */
(function (global) {
  "use strict";

  var VERSION = "1.0.0";
  var BACKDROP_SOURCE = "/immersive/orbit-lens/orbit-lens-background.js";
  var DEFAULT_CONFIG = {
    palette: {
      bg: "#02070d",
      deep: "#081426",
      accent: "#7de9ff"
    },
    atmosphere: {
      intensity: 0.98,
      haze: 0.88,
      beam: 0.92,
      tint: 0.7,
      drift: 0.18
    }
  };

  var VERTEX_SHADER = [
    "attribute vec2 aPosition;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = aPosition * 0.5 + 0.5;",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAGMENT_SHADER = [
    "precision highp float;",
    "",
    "uniform float uTime;",
    "uniform vec2 uResolution;",
    "uniform vec3 uBaseColor;",
    "uniform vec3 uDeepColor;",
    "uniform vec3 uAccentColor;",
    "uniform float uIntensity;",
    "uniform float uHaze;",
    "uniform float uBeam;",
    "uniform float uTint;",
    "uniform float uDrift;",
    "uniform float uDebug;",
    "uniform vec2 uPointer;",
    "uniform float uPointerStrength;",
    "",
    "varying vec2 vUv;",
    "",
    "float hash(vec2 p) {",
    "  p = fract(p * vec2(123.34, 456.21));",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",
    "",
    "float noise(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  float a = hash(i);",
    "  float b = hash(i + vec2(1.0, 0.0));",
    "  float c = hash(i + vec2(0.0, 1.0));",
    "  float d = hash(i + vec2(1.0, 1.0));",
    "  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);",
    "}",
    "",
    "float fbm(vec2 p) {",
    "  float value = 0.0;",
    "  float amplitude = 0.5;",
    "  mat2 rotate = mat2(0.82, -0.58, 0.58, 0.82);",
    "  for (int i = 0; i < 5; i++) {",
    "    value += amplitude * noise(p);",
    "    p = rotate * p * 2.02 + vec2(13.7, 8.1);",
    "    amplitude *= 0.5;",
    "  }",
    "  return value;",
    "}",
    "",
    "float ring(vec2 uv, vec2 center, float radius, float width, float aspect) {",
    "  vec2 q = vec2((uv.x - center.x) * aspect, uv.y - center.y);",
    "  float dist = length(q);",
    "  return exp(-pow((dist - radius) / max(width, 0.001), 2.0));",
    "}",
    "",
    "float ellipse(vec2 uv, vec2 center, vec2 radius, float aspect) {",
    "  vec2 q = vec2((uv.x - center.x) * aspect, uv.y - center.y) / radius;",
    "  return smoothstep(1.0, 0.0, dot(q, q));",
    "}",
    "",
    "float lineGlow(float value, float width) {",
    "  return exp(-pow(value / max(width, 0.0005), 2.0));",
    "}",
    "",
    "void main() {",
    "  vec2 uv = vUv;",
    "  float aspect = uResolution.x / max(uResolution.y, 1.0);",
    "  vec2 centered = uv - 0.5;",
    "  centered.x *= aspect;",
    "",
    "  float time = uTime * (0.08 + uDrift * 0.16);",
    "  vec2 pointer = vec2(0.5 + uPointer.x * 0.08, 0.5 - uPointer.y * 0.06);",
    "  vec2 pointerDelta = uv - pointer;",
    "  float pointerField = exp(-dot(pointerDelta * vec2(aspect, 1.0), pointerDelta * vec2(aspect, 1.0)) * 14.0) * uPointerStrength;",
    "",
    "  vec3 bg = mix(uBaseColor, uDeepColor, smoothstep(0.0, 1.0, uv.y));",
    "  bg += uAccentColor * 0.02 * fbm(vec2(uv.x * 2.6 + time * 0.5, uv.y * 1.8 - time * 0.28));",
    "  vec3 color = bg;",
    "",
    "  vec2 orbitCenter = vec2(0.715, 0.505);",
    "  vec2 lensShift = vec2(0.012 * sin(time * 1.7), 0.008 * cos(time * 1.4));",
    "  vec2 lensUv = vec2((uv.x - orbitCenter.x - lensShift.x) * aspect, uv.y - orbitCenter.y - lensShift.y);",
    "  float radial = length(lensUv);",
    "  float angle = atan(lensUv.y, lensUv.x);",
    "",
    "  float halo = ring(uv, orbitCenter, 0.37, 0.09, aspect);",
    "  float outerRing = ring(uv, orbitCenter + vec2(0.008, -0.004), 0.28, 0.017, aspect);",
    "  float innerRing = ring(uv, orbitCenter + vec2(-0.006, 0.004), 0.18, 0.012, aspect);",
    "  float farRing = ring(uv, orbitCenter + vec2(0.012, -0.01), 0.45, 0.024, aspect);",
    "",
    "  float aperture = ellipse(uv, orbitCenter, vec2(0.16, 0.23), aspect);",
    "  float shell = ellipse(uv, orbitCenter + vec2(0.013, -0.008), vec2(0.32, 0.43), aspect);",
    "  float shellCut = smoothstep(0.08, 0.9, shell) * (1.0 - smoothstep(0.0, 0.18, radial));",
    "",
    "  float orbitBands = 0.0;",
    "  orbitBands += smoothstep(0.92, 1.0, abs(sin(angle * 5.0 + time * 1.2 + fbm(vec2(angle * 2.0, radial * 10.0)) * 0.6)));",
    "  orbitBands += smoothstep(0.94, 1.0, abs(sin(angle * 9.0 - time * 0.8)));",
    "  orbitBands *= smoothstep(0.44, 0.08, abs(radial - 0.28));",
    "",
    "  float scan = lineGlow(uv.y - (0.39 + 0.06 * sin(uv.x * 4.3 + time * 2.3)), 0.012);",
    "  scan *= smoothstep(0.12, 0.92, uv.x);",
    "  float beam = lineGlow(uv.x - (0.605 + 0.04 * sin(time * 0.85)), 0.018);",
    "  beam *= smoothstep(0.14, 0.9, uv.y);",
    "",
    "  float leftGlow = ellipse(uv, vec2(0.23, 0.58), vec2(0.28, 0.42), aspect);",
    "  float lowerGlow = ellipse(uv, vec2(0.44, 0.86), vec2(0.36, 0.11), aspect);",
    "  float rightBloom = ellipse(uv, vec2(0.82, 0.26), vec2(0.2, 0.28), aspect);",
    "",
    "  float haze = fbm(vec2(uv.x * 3.8 + time * 0.9, uv.y * 2.4 - time * 0.5));",
    "  float haze2 = fbm(vec2(uv.x * 7.5 - time * 1.3, uv.y * 6.0 + time * 0.7));",
    "  float grain = fbm(uv * vec2(34.0, 20.0) + time * 0.65);",
    "",
    "  color += mix(uDeepColor, uAccentColor, 0.22) * leftGlow * (0.05 + uHaze * 0.04);",
    "  color += uAccentColor * lowerGlow * (0.06 + uHaze * 0.05);",
    "  color += mix(uAccentColor, vec3(0.78, 0.92, 1.0), 0.22) * rightBloom * 0.16;",
    "  color += uAccentColor * (halo * 0.22 + farRing * 0.18 + outerRing * 0.95 + innerRing * 0.72) * (0.65 + uBeam * 0.62);",
    "  color += vec3(0.8, 0.93, 1.0) * aperture * 0.16;",
    "  color += vec3(0.94, 0.98, 1.0) * shellCut * 0.03;",
    "  color += uAccentColor * orbitBands * (0.24 + uTint * 0.2);",
    "  color += uAccentColor * scan * (0.12 + uBeam * 0.16);",
    "  color += vec3(0.76, 0.88, 1.0) * beam * (0.08 + uBeam * 0.12);",
    "  color += uAccentColor * haze * 0.02;",
    "  color += vec3(0.5, 0.72, 1.0) * haze2 * 0.02;",
    "  color += vec3(0.9, 0.98, 1.0) * pow(max(orbitBands - 0.55, 0.0), 2.0) * 0.05;",
    "  color += vec3(0.9, 0.98, 1.0) * pointerField * 0.03;",
    "",
    "  float ringCore = smoothstep(0.36, 0.12, radial);",
    "  float ringLight = smoothstep(0.41, 0.0, abs(radial - 0.28));",
    "  color += uAccentColor * ringLight * (0.12 + uIntensity * 0.08);",
    "  color += vec3(0.9, 0.98, 1.0) * ringCore * 0.03;",
    "",
    "  float floorReflection = exp(-pow((uv.y - 0.82) / 0.08, 2.0)) * exp(-pow((uv.x - 0.64) / 0.26, 2.0));",
    "  color += uAccentColor * floorReflection * 0.12;",
    "  color += vec3(0.75, 0.86, 1.0) * floorReflection * 0.06;",
    "",
    "  float edgeDark = smoothstep(1.12, 0.16, length(centered * vec2(0.92, 1.05)));",
    "  float upperFade = smoothstep(0.58, 0.96, uv.y);",
    "  float sideFade = smoothstep(0.06, 0.56, abs(centered.x));",
    "  color *= mix(0.2, 1.0, edgeDark);",
    "  color = mix(color, uDeepColor * 0.36, upperFade * 0.16);",
    "  color = mix(color, uBaseColor * 0.52, sideFade * 0.06);",
    "  color = max(color, vec3(0.0, 0.0, 0.0));",
    "  color = 1.0 - exp(-color * (1.1 + uIntensity * 0.22));",
    "  color += vec3(grain * 0.006);",
    "  color = pow(color, vec3(0.95));",
    "",
    "  if (uDebug > 0.5) {",
    "    color = mix(color, vec3(0.95, 0.2, 0.9), 0.1);",
    "  }",
    "",
    "  gl_FragColor = vec4(color, 1.0);",
    "}"
  ].join("\n");

  var UNIFORM_NAMES = [
    "uTime",
    "uResolution",
    "uBaseColor",
    "uDeepColor",
    "uAccentColor",
    "uIntensity",
    "uHaze",
    "uBeam",
    "uTint",
    "uDrift",
    "uDebug",
    "uPointer",
    "uPointerStrength"
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function clampUnit(value, fallback) {
    return typeof value === "number" && Number.isFinite(value) ? clamp(value, 0, 1) : fallback;
  }

  function lerp(current, target, amount) {
    return current + (target - current) * amount;
  }

  function parseColor(value, fallback) {
    var base = fallback ? fallback.slice() : [0.03, 0.07, 0.14];
    var color;
    var hex;

    if (Array.isArray(value) && value.length >= 3) {
      return [
        clampUnit(value[0], base[0]),
        clampUnit(value[1], base[1]),
        clampUnit(value[2], base[2])
      ];
    }

    if (typeof value !== "string") return base;

    color = value.trim();
    if (color.charAt(0) === "#") {
      hex = color.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255,
          parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255,
          parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255
        ];
      }
      if (hex.length >= 6) {
        return [
          parseInt(hex.slice(0, 2), 16) / 255,
          parseInt(hex.slice(2, 4), 16) / 255,
          parseInt(hex.slice(4, 6), 16) / 255
        ];
      }
    }

    return base;
  }

  function copyAtmosphere(source) {
    var input = source || {};
    return {
      intensity: clampUnit(input.intensity, DEFAULT_CONFIG.atmosphere.intensity),
      haze: clampUnit(input.haze, DEFAULT_CONFIG.atmosphere.haze),
      beam: clampUnit(input.beam, DEFAULT_CONFIG.atmosphere.beam),
      tint: clampUnit(input.tint, DEFAULT_CONFIG.atmosphere.tint),
      drift: clampUnit(input.drift, DEFAULT_CONFIG.atmosphere.drift)
    };
  }

  function resolveConfig(preset, overrides) {
    var source = typeof preset === "object" ? preset : DEFAULT_CONFIG;
    var nextOverrides = overrides || {};
    return {
      palette: Object.assign({}, DEFAULT_CONFIG.palette, source.palette || {}, nextOverrides.palette || {}),
      atmosphere: Object.assign({}, DEFAULT_CONFIG.atmosphere, source.atmosphere || {}, nextOverrides.atmosphere || {})
    };
  }

  function resolveTarget(target) {
    if (typeof target === "string") {
      return document.querySelector(target);
    }
    return target;
  }

  function prefersReducedMotion() {
    return typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    var log;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      log = gl.getShaderInfoLog(shader) || "Unknown shader error";
      gl.deleteShader(shader);
      throw new Error("Orbit Lens background shader failed: " + log);
    }
    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    var program = gl.createProgram();
    var vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    var log;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      log = gl.getProgramInfoLog(program) || "Unknown program error";
      gl.deleteProgram(program);
      throw new Error("Orbit Lens background program failed: " + log);
    }

    return program;
  }

  function createCanvas(className) {
    var canvas = document.createElement("canvas");
    canvas.className = "orbit-lens-webgl-background__canvas" + (className ? " " + className : "");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";
    return canvas;
  }

  function OrbitLensBackground(target, options) {
    if (typeof document === "undefined") {
      throw new Error("Orbit Lens background needs a browser document.");
    }

    this.options = options || {};
    this.container = resolveTarget(target);

    if (!this.container) {
      throw new Error("Orbit Lens background target was not found.");
    }

    this.canvas = createCanvas(this.options.className);
    this.gl = this.canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    }) || this.canvas.getContext("experimental-webgl");

    if (!this.gl) {
      throw new Error("WebGL is not available in this browser.");
    }

    if (this.options.addHostClass !== false) {
      this.container.classList.add("orbit-lens-webgl-background-host");
    }

    if (this.options.manageContainer !== false && window.getComputedStyle(this.container).position === "static") {
      this.container.style.position = "relative";
    }

    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.maxDpr = Number.isFinite(this.options.maxDpr) ? Math.max(1, this.options.maxDpr) : 1.8;
    this.reducedMotion = typeof this.options.reducedMotion === "boolean"
      ? this.options.reducedMotion
      : prefersReducedMotion();
    this.pointerEnabled = this.options.pointer !== false;
    this.time = 0;
    this.running = false;
    this.raf = 0;
    this.lastFrame = 0;
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0 };
    this.currentPalette = { bg: [0.03, 0.07, 0.14], deep: [0.03, 0.08, 0.19], accent: [0.49, 0.91, 1.0] };
    this.targetPalette = { bg: this.currentPalette.bg.slice(), deep: this.currentPalette.deep.slice(), accent: this.currentPalette.accent.slice() };
    this.currentAtmosphere = copyAtmosphere(DEFAULT_CONFIG.atmosphere);
    this.targetAtmosphere = copyAtmosphere(DEFAULT_CONFIG.atmosphere);

    this._onFrame = this._onFrame.bind(this);
    this._onResize = this.resize.bind(this);
    this._onPointerMove = this._handlePointerMove.bind(this);
    this._onPointerLeave = this._handlePointerLeave.bind(this);

    this._initGL();
    this._bindEvents();
    this.resize();

    this.setPreset(this.options.preset || DEFAULT_CONFIG);

    if (this.options.autoplay !== false) {
      this.play();
    }
  }

  OrbitLensBackground.prototype._initGL = function () {
    var gl = this.gl;
    var positionLocation;

    this.program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    this.uniforms = {};
    UNIFORM_NAMES.forEach(function (name) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }, this);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    gl.useProgram(this.program);
    positionLocation = gl.getAttribLocation(this.program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0.01, 0.02, 0.05, 1);
  };

  OrbitLensBackground.prototype._bindEvents = function () {
    if (this.pointerEnabled) {
      this.container.addEventListener("pointermove", this._onPointerMove, { passive: true });
      this.container.addEventListener("pointerleave", this._onPointerLeave, { passive: true });
    }

    if (typeof ResizeObserver === "function") {
      this.resizeObserver = new ResizeObserver(this._onResize);
      this.resizeObserver.observe(this.container);
    }

    window.addEventListener("resize", this._onResize, { passive: true });
  };

  OrbitLensBackground.prototype._handlePointerMove = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    var width = Math.max(rect.width, 1);
    var height = Math.max(rect.height, 1);
    this.pointer.targetX = ((event.clientX - rect.left) / width) * 2 - 1;
    this.pointer.targetY = 1 - ((event.clientY - rect.top) / height) * 2;
  };

  OrbitLensBackground.prototype._handlePointerLeave = function () {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
  };

  OrbitLensBackground.prototype.resize = function () {
    var rect = this.container.getBoundingClientRect();
    var width = Math.max(1, Math.floor(rect.width));
    var height = Math.max(1, Math.floor(rect.height));
    var dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);

    if (width !== this.width || height !== this.height || dpr !== this.dpr) {
      this.width = width;
      this.height = height;
      this.dpr = dpr;
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  OrbitLensBackground.prototype._update = function (delta) {
    this.time += delta;
    this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 1 - Math.exp(-delta * 8));
    this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 1 - Math.exp(-delta * 8));
    this.pointer.strength = lerp(this.pointer.strength, Math.min(1, Math.hypot(this.pointer.targetX, this.pointer.targetY)), 1 - Math.exp(-delta * 4));

    this.currentPalette.bg[0] = lerp(this.currentPalette.bg[0], this.targetPalette.bg[0], 1 - Math.exp(-delta * 2));
    this.currentPalette.bg[1] = lerp(this.currentPalette.bg[1], this.targetPalette.bg[1], 1 - Math.exp(-delta * 2));
    this.currentPalette.bg[2] = lerp(this.currentPalette.bg[2], this.targetPalette.bg[2], 1 - Math.exp(-delta * 2));
    this.currentPalette.deep[0] = lerp(this.currentPalette.deep[0], this.targetPalette.deep[0], 1 - Math.exp(-delta * 2));
    this.currentPalette.deep[1] = lerp(this.currentPalette.deep[1], this.targetPalette.deep[1], 1 - Math.exp(-delta * 2));
    this.currentPalette.deep[2] = lerp(this.currentPalette.deep[2], this.targetPalette.deep[2], 1 - Math.exp(-delta * 2));
    this.currentPalette.accent[0] = lerp(this.currentPalette.accent[0], this.targetPalette.accent[0], 1 - Math.exp(-delta * 2));
    this.currentPalette.accent[1] = lerp(this.currentPalette.accent[1], this.targetPalette.accent[1], 1 - Math.exp(-delta * 2));
    this.currentPalette.accent[2] = lerp(this.currentPalette.accent[2], this.targetPalette.accent[2], 1 - Math.exp(-delta * 2));

    this.currentAtmosphere.intensity = lerp(this.currentAtmosphere.intensity, this.targetAtmosphere.intensity, 1 - Math.exp(-delta * 2));
    this.currentAtmosphere.haze = lerp(this.currentAtmosphere.haze, this.targetAtmosphere.haze, 1 - Math.exp(-delta * 2));
    this.currentAtmosphere.beam = lerp(this.currentAtmosphere.beam, this.targetAtmosphere.beam, 1 - Math.exp(-delta * 2));
    this.currentAtmosphere.tint = lerp(this.currentAtmosphere.tint, this.targetAtmosphere.tint, 1 - Math.exp(-delta * 2));
    this.currentAtmosphere.drift = lerp(this.currentAtmosphere.drift, this.targetAtmosphere.drift, 1 - Math.exp(-delta * 2));
  };

  OrbitLensBackground.prototype._draw = function () {
    var gl = this.gl;
    var uniforms = this.uniforms;

    gl.useProgram(this.program);
    gl.uniform1f(uniforms.uTime, this.time);
    gl.uniform2f(uniforms.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform3f(uniforms.uBaseColor, this.currentPalette.bg[0], this.currentPalette.bg[1], this.currentPalette.bg[2]);
    gl.uniform3f(uniforms.uDeepColor, this.currentPalette.deep[0], this.currentPalette.deep[1], this.currentPalette.deep[2]);
    gl.uniform3f(uniforms.uAccentColor, this.currentPalette.accent[0], this.currentPalette.accent[1], this.currentPalette.accent[2]);
    gl.uniform1f(uniforms.uIntensity, this.currentAtmosphere.intensity);
    gl.uniform1f(uniforms.uHaze, this.currentAtmosphere.haze);
    gl.uniform1f(uniforms.uBeam, this.currentAtmosphere.beam);
    gl.uniform1f(uniforms.uTint, this.currentAtmosphere.tint);
    gl.uniform1f(uniforms.uDrift, this.currentAtmosphere.drift);
    gl.uniform1f(uniforms.uDebug, 0);
    gl.uniform2f(uniforms.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(uniforms.uPointerStrength, this.pointer.strength);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  OrbitLensBackground.prototype._onFrame = function (now) {
    var seconds = now * 0.001;
    var delta = this.lastFrame ? clamp(seconds - this.lastFrame, 0.001, 0.05) : 0.016;
    this.lastFrame = seconds;
    this._update(delta);
    this._draw();

    if (this.running) {
      this.raf = window.requestAnimationFrame(this._onFrame);
    }
  };

  OrbitLensBackground.prototype.play = function () {
    if (!this.running) {
      this.running = true;
      this.lastFrame = 0;
      this.raf = window.requestAnimationFrame(this._onFrame);
    }
    return this;
  };

  OrbitLensBackground.prototype.pause = function () {
    this.running = false;
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    return this;
  };

  OrbitLensBackground.prototype.setPreset = function (preset, overrides) {
    var config = resolveConfig(preset || DEFAULT_CONFIG, overrides);
    this.targetPalette = {
      bg: parseColor(config.palette.bg, this.targetPalette.bg),
      deep: parseColor(config.palette.deep, this.targetPalette.deep),
      accent: parseColor(config.palette.accent, this.targetPalette.accent)
    };
    this.targetAtmosphere = copyAtmosphere(config.atmosphere);
    return this;
  };

  OrbitLensBackground.prototype.setPalette = function (palette) {
    var next = palette || {};
    this.targetPalette = {
      bg: parseColor(next.bg, this.targetPalette.bg),
      deep: parseColor(next.deep, this.targetPalette.deep),
      accent: parseColor(next.accent, this.targetPalette.accent)
    };
    return this;
  };

  OrbitLensBackground.prototype.setAtmosphere = function (atmosphere) {
    this.targetAtmosphere = copyAtmosphere(Object.assign({}, this.targetAtmosphere, atmosphere || {}));
    return this;
  };

  OrbitLensBackground.prototype.setReducedMotion = function (reducedMotion) {
    this.reducedMotion = Boolean(reducedMotion);
    return this;
  };

  OrbitLensBackground.prototype.destroy = function () {
    this.pause();

    if (this.pointerEnabled) {
      this.container.removeEventListener("pointermove", this._onPointerMove);
      this.container.removeEventListener("pointerleave", this._onPointerLeave);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    window.removeEventListener("resize", this._onResize);

    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    if (this.gl) {
      this.gl.deleteBuffer(this.buffer);
      this.gl.deleteProgram(this.program);
    }

    return this;
  };

  global.KoolBerkWebGLBackground = {
    version: VERSION,
    presets: { orbit: DEFAULT_CONFIG },
    mount: function (target, options) {
      return new OrbitLensBackground(target, options);
    },
    Background: OrbitLensBackground
  };

  global.__koolBerkBackgroundScriptSource = BACKDROP_SOURCE;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.KoolBerkWebGLBackground;
  }
})(typeof window !== "undefined" ? window : globalThis);
