/*!
 * KOOL BERK WebGL background extract
 * Standalone raw WebGL build generated from src/components/r3f/SonicAtmosphereShaderMaterial.js.
 */
(function (global) {
  "use strict";

  var VERSION = "1.0.0";
  var DEFAULT_PRESET = "identity";
  var DEFAULT_ATMOSPHERE = {
    intensity: 0.62,
    haze: 0.58,
    beam: 0.55,
    tint: 0.24,
    drift: 0.35
  };
  var AUDIO_INPUT_GAIN = 1.58;
  var AUDIO_RESPONSE_GAIN = 1.0;
  var AUDIO_RESPONSE = {
    bassPressure: 0.62,
    energyHaze: 0.44,
    beatGlow: 0.28,
    highShimmer: 0.22,
    progressDrift: 0.28
  };
  var AUDIO_SMOOTHING = {
    bass: 0.092,
    lowMid: 0.078,
    mid: 0.058,
    energy: 0.074,
    high: 0.045,
    brightness: 0.045,
    progress: 0.034,
    playState: 0.085,
    beatAttack: 0.075,
    beatDecay: 0.956
  };
  var PRESETS = {
  "identity": {
    "label": "KOOL BERK",
    "palette": {
      "bg": "#030712",
      "deep": "#050915",
      "accent": "#7eb6ff"
    },
    "atmosphere": {
      "intensity": 0.62,
      "haze": 0.55,
      "beam": 0.5,
      "tint": 0.18,
      "drift": 0.3
    }
  },
  "lo-fi": {
    "label": "LO-FI",
    "palette": {
      "bg": "#080604",
      "deep": "#17110b",
      "accent": "#d18a46"
    },
    "atmosphere": {
      "intensity": 0.64,
      "haze": 0.52,
      "beam": 0.42,
      "tint": 0.22,
      "drift": 0.32
    }
  },
  "monah": {
    "label": "MONAH",
    "palette": {
      "bg": "#090303",
      "deep": "#170606",
      "accent": "#c92f2f"
    },
    "atmosphere": {
      "intensity": 0.68,
      "haze": 0.5,
      "beam": 0.38,
      "tint": 0.2,
      "drift": 0.28
    }
  },
  "nich": {
    "label": "NICH",
    "palette": {
      "bg": "#050506",
      "deep": "#111113",
      "accent": "#b8bcc5"
    },
    "atmosphere": {
      "intensity": 0.56,
      "haze": 0.54,
      "beam": 0.4,
      "tint": 0.12,
      "drift": 0.24
    }
  },
  "zmina": {
    "label": "ZMINA",
    "palette": {
      "bg": "#030406",
      "deep": "#080b10",
      "accent": "#5d8db8"
    },
    "atmosphere": {
      "intensity": 0.58,
      "haze": 0.62,
      "beam": 0.55,
      "tint": 0.18,
      "drift": 0.22
    }
  },
  "live": {
    "label": "Live",
    "palette": {
      "bg": "#050505",
      "deep": "#111318",
      "accent": "#a8b4c8"
    },
    "atmosphere": {
      "intensity": 0.52,
      "haze": 0.46,
      "beam": 0.36,
      "tint": 0.1,
      "drift": 0.2
    }
  },
  "contact": {
    "label": "Contact",
    "palette": {
      "bg": "#04070a",
      "deep": "#071016",
      "accent": "#82d8d1"
    },
    "atmosphere": {
      "intensity": 0.5,
      "haze": 0.42,
      "beam": 0.32,
      "tint": 0.1,
      "drift": 0.18
    }
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
  var FRAGMENT_SHADER = "\nprecision highp float;\n\nuniform float uTime;\nuniform vec2 uResolution;\nuniform vec3 uBaseColor;\nuniform vec3 uDeepColor;\nuniform vec3 uAccentColor;\nuniform float uIntensity;\nuniform float uHaze;\nuniform float uBeam;\nuniform float uTint;\nuniform float uDrift;\nuniform float uDebug;\nuniform vec2 uPointer;\nuniform float uPointerStrength;\nuniform float uAudioBass;\nuniform float uAudioLowMid;\nuniform float uAudioMid;\nuniform float uAudioHigh;\nuniform float uAudioEnergy;\nuniform float uAudioBeat;\nuniform float uAudioBrightness;\nuniform float uAudioProgress;\nuniform float uIsPlaying;\nuniform float uAudioBassPressure;\nuniform float uAudioEnergyHaze;\nuniform float uAudioBeatGlow;\nuniform float uAudioHighShimmer;\nuniform float uAudioProgressDrift;\n\nvarying vec2 vUv;\n\nfloat hash(vec2 p) {\n  p = fract(p * vec2(123.34, 456.21));\n  p += dot(p, p + 45.32);\n  return fract(p.x * p.y);\n}\n\nfloat noise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n\n  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n}\n\nfloat fbm(vec2 p) {\n  float value = 0.0;\n  float amplitude = 0.5;\n  mat2 rotate = mat2(0.82, -0.58, 0.58, 0.82);\n\n  for (int i = 0; i < 6; i++) {\n    value += amplitude * noise(p);\n    p = rotate * p * 2.04 + vec2(17.3, 9.2);\n    amplitude *= 0.5;\n  }\n\n  return value;\n}\n\nfloat ridge(float value) {\n  float shaped = 1.0 - abs(value * 2.0 - 1.0);\n  return shaped * shaped * (3.0 - 2.0 * shaped);\n}\n\nfloat ridgedFbm(vec2 p) {\n  float value = 0.0;\n  float amplitude = 0.56;\n  mat2 rotate = mat2(0.72, -0.69, 0.69, 0.72);\n\n  for (int i = 0; i < 5; i++) {\n    value += amplitude * ridge(noise(p));\n    p = rotate * p * 2.18 + vec2(8.6, 19.1);\n    amplitude *= 0.52;\n  }\n\n  return value;\n}\n\nfloat softEllipse(vec2 p, vec2 center, vec2 radius) {\n  vec2 q = (p - center) / radius;\n  return smoothstep(1.0, 0.0, dot(q, q));\n}\n\nfloat cloudArc(vec2 p, vec2 center, vec2 radius, float width) {\n  vec2 q = (p - center) / radius;\n  float arc = abs(length(q) - 1.0);\n  return smoothstep(width, 0.0, arc);\n}\n\nfloat lineGlow(float value, float width) {\n  return exp(-pow(value / max(width, 0.001), 2.0));\n}\n\nfloat star(vec2 p, vec2 center, float size) {\n  vec2 q = abs((p - center) / size);\n  float rays = smoothstep(1.0, 0.0, min(q.x, q.y));\n  float core = smoothstep(0.18, 0.0, length(q));\n  return max(rays * 0.4, core);\n}\n\nvoid main() {\n  vec2 uv = vUv;\n  float aspect = uResolution.x / max(uResolution.y, 1.0);\n  vec2 centered = uv - 0.5;\n  centered.x *= aspect;\n\n  float playResponse = 0.38 + uIsPlaying * 0.62;\n  float audioBass = clamp(uAudioBass * playResponse, 0.0, 1.6);\n  float audioLowMid = clamp(uAudioLowMid * playResponse, 0.0, 1.6);\n  float audioMid = clamp(uAudioMid * playResponse, 0.0, 1.6);\n  float audioHigh = clamp(uAudioHigh * playResponse, 0.0, 1.6);\n  float audioEnergy = clamp(uAudioEnergy * playResponse, 0.0, 1.6);\n  float audioBeat = clamp(uAudioBeat * playResponse, 0.0, 1.8);\n  float audioBrightness = clamp(uAudioBrightness * playResponse, 0.0, 1.6);\n  float audioBody = clamp((audioLowMid + audioMid) * 0.5, 0.0, 1.3);\n  float bassPressure = audioBass * uAudioBassPressure;\n  float energyHaze = audioEnergy * uAudioEnergyHaze;\n  float beatGlow = audioBeat * uAudioBeatGlow;\n  float highShimmer = (audioHigh * 0.74 + audioBrightness * 0.26) * uAudioHighShimmer;\n  float structuralShift = uAudioProgress * uAudioProgressDrift * 8.0;\n  float beatEnvelope = smoothstep(0.12, 0.9, beatGlow);\n  float beatFlow = beatEnvelope * beatEnvelope * (0.54 + beatEnvelope * 0.2);\n  float bassEnvelope = smoothstep(0.03, 0.58, bassPressure);\n  float waveEnvelope = clamp(bassEnvelope * 0.58 + energyHaze * 0.34 + beatFlow * 0.18, 0.0, 1.0);\n  float audioMotion = clamp(bassPressure * 0.66 + energyHaze * 0.4 + waveEnvelope * 0.34, 0.0, 1.2);\n  float reactiveHaze = uHaze * (1.0 + energyHaze);\n  float reactiveBeam = uBeam + beatFlow * 0.1 + energyHaze * 0.08;\n  float reactiveTint = uTint + highShimmer * 0.34 + audioBody * 0.018;\n  float time = uTime * (0.12 + uDrift * 0.22 + energyHaze * 0.08 + beatFlow * 0.014) + structuralShift * 0.16;\n\n  if (uDebug > 0.5) {\n    float debugGlow = smoothstep(1.08, 0.0, length(centered * vec2(0.68, 0.94)));\n    float debugBeam = smoothstep(0.64, 0.0, abs(uv.x - 0.52)) * smoothstep(0.05, 0.82, uv.y);\n    float debugFog = smoothstep(0.24, 0.86, fbm(uv * 7.0 + vec2(time * 0.42, -time * 0.2)));\n    vec3 debugColor = vec3(0.01, 0.035, 0.1);\n    debugColor += vec3(0.05, 0.16, 0.38) * debugGlow * 1.35;\n    debugColor += uAccentColor * (debugBeam * 0.72 + debugFog * 0.34);\n    gl_FragColor = vec4(debugColor, 1.0);\n    return;\n  }\n\n  vec2 sceneUv = vec2(centered.x * 0.58 + 0.5, uv.y);\n  vec2 pointerUv = vec2(0.5 + uPointer.x * 0.5, 0.5 + uPointer.y * 0.5);\n  vec2 pointerDelta = uv - pointerUv;\n  float pointerField = exp(-dot(pointerDelta * vec2(aspect, 1.0), pointerDelta * vec2(aspect, 1.0)) * 7.5) * uPointerStrength;\n  float radialDistance = length(centered * vec2(0.88, 1.1));\n  float waveSpeed = 0.31 + energyHaze * 0.08 + bassEnvelope * 0.065;\n  float waveFrontA = fract(time * waveSpeed + structuralShift * 0.025);\n  float waveFrontB = fract(waveFrontA + 0.46);\n  float waveRadiusA = mix(0.08, 1.1, waveFrontA);\n  float waveRadiusB = mix(0.08, 1.1, waveFrontB);\n  float waveLifeA = smoothstep(0.02, 0.16, waveFrontA) * (1.0 - smoothstep(0.78, 1.0, waveFrontA));\n  float waveLifeB = smoothstep(0.02, 0.16, waveFrontB) * (1.0 - smoothstep(0.78, 1.0, waveFrontB));\n  float waveMask = smoothstep(1.18, 0.08, radialDistance) * smoothstep(0.0, 0.18, waveEnvelope + beatFlow * 0.18);\n  float rhythmRing = (\n    lineGlow(radialDistance - waveRadiusA, 0.072 + bassEnvelope * 0.026) * waveLifeA +\n    lineGlow(radialDistance - waveRadiusB, 0.105 + energyHaze * 0.026) * waveLifeB * 0.52\n  ) * waveMask;\n  vec2 rhythmVector = normalize(centered + vec2(0.001, -0.003)) * rhythmRing * (0.014 + waveEnvelope * 0.046);\n  vec2 slowFlow = vec2(time * 0.1 + structuralShift * 0.035 + waveEnvelope * 0.012, -time * 0.055 + structuralShift * 0.018);\n  vec2 counterFlow = vec2(-time * 0.075 - structuralShift * 0.025, time * 0.04 + structuralShift * 0.014 - waveEnvelope * 0.008);\n\n  vec3 voidBlack = vec3(0.0015, 0.0045, 0.011);\n  vec3 ink = mix(vec3(0.002, 0.008, 0.02), uDeepColor * 0.72, 0.42);\n  vec3 stormBlue = mix(vec3(0.025, 0.095, 0.225), uBaseColor * 1.45, 0.24);\n  vec3 lowBlue = vec3(0.025, 0.075, 0.16);\n  vec3 electricBlue = mix(vec3(0.2, 0.52, 1.0), uAccentColor, 0.16 + uTint * 0.08);\n  vec3 ice = vec3(0.72, 0.86, 1.0);\n  vec3 signalColor = mix(uAccentColor, ice, 0.36);\n\n  float verticalGrade = smoothstep(0.02, 1.0, uv.y);\n  vec3 color = mix(voidBlack, ink, 0.55 + verticalGrade * 0.2);\n\n  vec2 warp = vec2(\n    fbm(sceneUv * vec2(2.3 + audioMotion * 0.1, 1.6) + slowFlow * (1.6 + waveEnvelope * 0.16)),\n    fbm(sceneUv * vec2(2.0, 1.9 + audioMotion * 0.2) - counterFlow * (1.3 + bassEnvelope * 0.3))\n  ) - 0.5;\n\n  sceneUv += (pointerUv - 0.5) * 0.018 * uPointerStrength + rhythmVector;\n  vec2 cloudUv = sceneUv + warp * (0.18 + uDrift * 0.08 + bassPressure * 0.16 + waveEnvelope * 0.075) - pointerDelta * pointerField * 0.035;\n  cloudUv += rhythmVector * (1.34 + bassEnvelope * 0.58);\n  float broadNoise = fbm(cloudUv * vec2(2.3 + bassEnvelope * 0.12, 1.5 + waveEnvelope * 0.075) + slowFlow);\n  float detailNoise = ridgedFbm(cloudUv * vec2(7.8 + waveEnvelope * 0.52, 5.2 + audioMotion * 0.42) - counterFlow * (2.1 + waveEnvelope * 0.24));\n  float vaporNoise = fbm(cloudUv * vec2(14.0 + waveEnvelope * 0.86, 8.0 + bassEnvelope * 0.52) + vec2(-time * (0.18 + waveEnvelope * 0.055), time * 0.09));\n  float rhythmTexture = ridgedFbm(cloudUv * vec2(12.8, 6.9) + rhythmVector * 6.8 - counterFlow * 2.0);\n  float stormTexture = clamp(detailNoise * 0.86 + ridge(broadNoise) * 0.36 + vaporNoise * 0.16 + rhythmTexture * waveEnvelope * 0.08, 0.0, 1.52);\n\n  float leftShelfPath = abs(uv.y - (0.27 + 0.11 * sin(sceneUv.x * (7.2 + waveEnvelope * 0.22) - 0.65 + rhythmRing * waveEnvelope * 0.055)));\n  float leftShelf = smoothstep(0.18, 0.0, leftShelfPath);\n  leftShelf *= smoothstep(0.62, -0.34, sceneUv.x) * smoothstep(0.08, 0.24, uv.y) * smoothstep(0.62, 0.18, uv.y);\n  float leftCloud = max(\n    softEllipse(sceneUv, vec2(0.16, 0.38), vec2(0.42, 0.26)),\n    cloudArc(sceneUv, vec2(0.25, 0.12), vec2(0.58, 0.28), 0.22)\n  );\n  leftCloud = max(leftCloud, leftShelf * 0.78);\n  leftCloud *= smoothstep(0.1, 0.92, stormTexture);\n\n  float rightTower = softEllipse(sceneUv, vec2(0.92, 0.68), vec2(0.23, 0.4));\n  rightTower += cloudArc(sceneUv, vec2(0.9, 0.5), vec2(0.25 + bassEnvelope * 0.018, 0.36 + waveEnvelope * 0.018), 0.2) * 0.62;\n  rightTower *= smoothstep(0.16, 0.88, stormTexture + broadNoise * 0.28);\n  float rightRim = rightTower * smoothstep(0.38, 1.0, detailNoise + vaporNoise * 0.3);\n\n  float upperRift = cloudArc(sceneUv, vec2(0.53 + rhythmRing * waveEnvelope * 0.008, 0.34), vec2(0.66 + bassEnvelope * 0.028, 0.42 + waveEnvelope * 0.014), 0.12);\n  upperRift *= smoothstep(0.43, 0.94, uv.y) * smoothstep(0.34, 1.0, stormTexture);\n\n  float horizonMask = lineGlow(uv.y - 0.205, 0.054);\n  float horizonBreak = softEllipse(sceneUv, vec2(0.73, 0.23), vec2(0.24, 0.08));\n  horizonBreak += softEllipse(sceneUv, vec2(0.33, 0.22), vec2(0.24, 0.065)) * 0.55;\n  horizonBreak *= smoothstep(0.34, 1.0, stormTexture + vaporNoise * 0.2);\n  float horizonCloud = horizonMask * (0.16 + horizonBreak * 0.86 + broadNoise * 0.18);\n\n  float leftRimArc = cloudArc(sceneUv, vec2(0.25, 0.12), vec2(0.6, 0.29), 0.075);\n  leftRimArc *= smoothstep(0.64, 0.08, uv.y) * smoothstep(0.76, -0.14, sceneUv.x);\n  leftRimArc *= smoothstep(0.34, 1.0, detailNoise + vaporNoise * 0.26);\n\n  float rightRimArc = cloudArc(sceneUv, vec2(0.9, 0.51), vec2(0.27, 0.39), 0.07);\n  rightRimArc *= smoothstep(0.38, 0.98, uv.y) * smoothstep(0.44, 1.0, detailNoise);\n\n  float floorSpark = softEllipse(sceneUv, vec2(0.76, 0.2), vec2(0.2, 0.045));\n  floorSpark *= smoothstep(0.42, 1.0, detailNoise + vaporNoise * 0.18);\n\n  float sideRidgeNoise = ridgedFbm(sceneUv * vec2(12.5 + waveEnvelope * 0.48, 7.2 + audioMotion * 0.42) + warp * (0.85 + waveEnvelope * 0.075) + vec2(-time * 0.2, time * 0.06));\n  float leftBreakPocket = softEllipse(sceneUv, vec2(0.2, 0.37), vec2(0.28, 0.12));\n  leftBreakPocket *= smoothstep(0.72, 0.12, uv.y) * smoothstep(0.62, -0.18, sceneUv.x);\n  float rightBreakPocket = softEllipse(sceneUv, vec2(0.88, 0.69), vec2(0.2, 0.31));\n  rightBreakPocket *= smoothstep(0.34, 0.95, uv.y) * smoothstep(0.52, 1.0, sceneUv.x);\n  float horizonBreakPocket = softEllipse(sceneUv, vec2(0.72, 0.18), vec2(0.26, 0.08)) * horizonMask;\n  float stormBreakPocket = leftBreakPocket + rightBreakPocket + horizonBreakPocket * 0.85;\n  float stormFilaments = stormBreakPocket * (0.18 + 0.82 * smoothstep(0.32 - waveEnvelope * 0.015, 0.9, sideRidgeNoise + vaporNoise * 0.18 + rhythmTexture * waveEnvelope * 0.06));\n  float stormGlow = stormBreakPocket * (0.28 + 0.72 * smoothstep(0.12, 0.72, sideRidgeNoise + broadNoise * 0.22 + rhythmRing * waveEnvelope * 0.06));\n\n  float screenRidge = ridgedFbm(uv * vec2(9.5 + waveEnvelope * 0.44, 5.6 + bassEnvelope * 0.34) + vec2(-time * 0.24, time * 0.08) + rhythmVector * 1.45);\n  float screenVapor = fbm(uv * vec2(18.0 + audioMotion * 0.86, 8.0 + waveEnvelope * 0.24) + vec2(time * (0.12 + waveEnvelope * 0.03), -time * 0.1));\n  float leftScreenPocket = softEllipse(uv, vec2(0.12, 0.43), vec2(0.22, 0.2));\n  leftScreenPocket *= smoothstep(0.7, 0.12, uv.y);\n  float rightScreenPocket = softEllipse(uv, vec2(0.88, 0.66), vec2(0.2, 0.32));\n  rightScreenPocket *= smoothstep(0.26, 0.96, uv.y);\n  float lowScreenPocket = softEllipse(uv, vec2(0.78, 0.18), vec2(0.18, 0.07));\n  float screenStorm = leftScreenPocket + rightScreenPocket + lowScreenPocket * 0.76;\n  float screenFilaments = screenStorm * (0.2 + 0.8 * smoothstep(0.28 - waveEnvelope * 0.014, 0.86, screenRidge + screenVapor * 0.2));\n  float screenGlow = screenStorm * (0.34 + 0.66 * smoothstep(0.1, 0.68, screenRidge + broadNoise * 0.18 + rhythmRing * waveEnvelope * 0.055));\n\n  float cloudMass = clamp(\n    leftCloud * 0.78 + rightTower * 0.9 + upperRift * 0.42 + horizonCloud * 0.48 + stormGlow * 0.58 + screenGlow * 0.72,\n    0.0,\n    1.75\n  );\n  float audioPressureField = smoothstep(0.9, 0.0, length(centered * vec2(0.68, 0.98))) * bassPressure;\n  float rhythmCloudLift = rhythmRing * waveEnvelope * smoothstep(0.08, 0.95, cloudMass + stormBreakPocket + screenStorm);\n  cloudMass = clamp(cloudMass + audioPressureField * 0.25 + energyHaze * 0.078 + rhythmCloudLift * 0.18, 0.0, 1.88);\n  float sweepPhase = fract(uTime * (0.22 + energyHaze * 0.035) + structuralShift * 0.035);\n  float sweepGate = smoothstep(0.025, 0.1, sweepPhase) * (1.0 - smoothstep(0.48, 0.74, sweepPhase));\n  float sweepAxis = uv.x + uv.y * 0.18;\n  float sweepCenter = mix(-0.24, 1.22, smoothstep(0.0, 1.0, sweepPhase));\n  float sweepBody = lineGlow(sweepAxis - sweepCenter, 0.06 + energyHaze * 0.018);\n  float sweepCore = lineGlow(sweepAxis - sweepCenter, 0.018 + highShimmer * 0.012);\n  float sweepCloudMask = smoothstep(0.08, 0.95, cloudMass + stormBreakPocket * 0.44 + screenStorm * 0.34 + horizonCloud * 0.24);\n  float cinematicSweep = sweepBody * sweepGate * sweepCloudMask;\n  float brightRidges = smoothstep(0.34, 0.98, stormTexture) * cloudMass;\n  float blueBreaks = leftCloud * smoothstep(0.52, 1.0, detailNoise);\n  blueBreaks += rightRim * 1.25 + horizonBreak * horizonMask * 1.25;\n  blueBreaks += upperRift * smoothstep(0.5, 1.0, vaporNoise) * 0.62;\n\n  color += stormBlue * cloudMass * (0.24 + reactiveHaze * 0.34);\n  color += lowBlue * broadNoise * smoothstep(0.08, 0.78, cloudMass) * 0.25;\n  color += mix(electricBlue, signalColor, 0.18) * cinematicSweep * (0.18 + uIntensity * 0.1 + waveEnvelope * 0.07);\n  color += ice * sweepCore * sweepGate * sweepCloudMask * (0.04 + highShimmer * 0.065);\n  color += electricBlue * blueBreaks * (0.16 + reactiveBeam * 0.32);\n  color += electricBlue * (leftRimArc * 0.58 + rightRimArc * 0.7 + floorSpark * 0.46) * (0.44 + reactiveBeam * 0.84);\n  color += stormBlue * stormGlow * (0.68 + reactiveHaze * 0.46);\n  color += electricBlue * stormFilaments * (0.72 + reactiveBeam * 0.7);\n  color += stormBlue * screenGlow * (0.92 + reactiveHaze * 0.58);\n  color += electricBlue * screenFilaments * (1.0 + reactiveBeam * 0.92);\n  color += ice * pow(stormFilaments, 2.0) * (0.08 + uIntensity * 0.18);\n  color += ice * pow(screenFilaments, 1.55) * (0.16 + uIntensity * 0.36);\n  color += ice * pow(max(brightRidges - 0.4, 0.0), 2.0) * (0.2 + uIntensity * 0.32);\n\n  float centerVoid = smoothstep(0.72, 0.1, length(centered * vec2(0.58, 0.9)));\n  color = mix(color, mix(voidBlack * 0.68, uDeepColor * 0.3, bassPressure * 1.2), centerVoid * (0.52 + bassPressure * 0.18));\n  color += stormBlue * audioPressureField * 0.18;\n\n  float halo = smoothstep(0.94, 0.0, length(centered * vec2(0.78, 1.06)));\n  float innerHalo = smoothstep(0.33, 0.0, length(centered * vec2(1.1, 1.28)));\n  color += mix(stormBlue, electricBlue, 0.28) * halo * (0.052 + reactiveTint * 0.26);\n  color += electricBlue * innerHalo * (0.025 + reactiveTint * 0.07);\n\n  float shaftA = lineGlow(centered.x * 0.76 + centered.y * 0.19, 0.28);\n  shaftA *= smoothstep(-0.44, 0.16, centered.y) * smoothstep(0.94, 0.06, uv.y);\n  float shaftB = lineGlow(centered.x * 0.42 - centered.y * 0.32 - 0.1, 0.22);\n  shaftB *= smoothstep(0.1, 0.76, uv.y) * smoothstep(1.0, 0.26, uv.y);\n  color += electricBlue * (shaftA * 0.06 + shaftB * 0.055) * (0.45 + reactiveBeam);\n  color += electricBlue * pointerField * (0.035 + reactiveTint * 0.12);\n  color += ice * pow(pointerField, 2.0) * (0.018 + reactiveBeam * 0.045);\n  float technoPulse = rhythmRing * beatFlow * (stormBreakPocket * 0.5 + screenStorm * 0.36 + horizonMask * 0.12);\n  float scanLine = lineGlow(uv.y - (0.18 + 0.06 * sin(time * 0.9 + structuralShift)), 0.012 + bassEnvelope * 0.01);\n  scanLine *= smoothstep(0.08, 0.84, uv.x) * smoothstep(0.72, 0.08, uv.y) * beatFlow;\n  color += signalColor * (shaftA * 0.055 + rightRimArc * 0.08 + floorSpark * 0.055 + halo * 0.024) * beatFlow;\n  color += signalColor * (technoPulse * 0.11 + scanLine * 0.08);\n\n  float horizonLine = lineGlow(uv.y - 0.192, 0.016);\n  color += electricBlue * horizonLine * (0.055 + horizonBreak * 0.2) * (0.52 + reactiveBeam);\n\n  float floorArea = smoothstep(0.37, 0.02, uv.y);\n  float floorFade = smoothstep(0.0, 0.35, uv.y);\n  float floorNoise = fbm(vec2(uv.x * 9.2 + warp.x, uv.y * 24.0 - time * 0.45));\n  float wetStreaks = smoothstep(0.72, 1.0, floorNoise) * floorArea * floorFade;\n  float centerReflection = lineGlow(uv.x - 0.62, 0.14) * lineGlow(uv.y - 0.105, 0.09);\n  float rightReflection = lineGlow(uv.x - 0.78, 0.12) * lineGlow(uv.y - 0.16, 0.055);\n  float leftReflection = lineGlow(uv.x - 0.28, 0.18) * lineGlow(uv.y - 0.16, 0.07);\n  float mirroredCloud = floorArea * smoothstep(0.18, 0.82, fbm(vec2(sceneUv.x * 5.0, (0.38 - uv.y) * 8.0) + slowFlow));\n\n  color = mix(color, voidBlack * 0.58, floorArea * 0.34);\n  color += stormBlue * mirroredCloud * floorArea * (0.055 + reactiveHaze * 0.08);\n  color += electricBlue * (centerReflection * 0.26 + rightReflection * 0.22 + leftReflection * 0.1) * (0.38 + uIntensity + energyHaze * 0.18);\n  color += electricBlue * wetStreaks * (0.025 + reactiveBeam * 0.06);\n\n  float pressureWave = sin((length(centered * vec2(1.0, 1.2)) * 9.2) - time * 1.9);\n  pressureWave = smoothstep(0.68, 1.0, pressureWave) * smoothstep(1.08, 0.18, length(centered));\n  color += signalColor * pressureWave * reactiveTint * (0.026 + uIntensity * 0.07 + bassPressure * 0.1) * smoothstep(0.2, 1.0, cloudMass + floorArea);\n\n  float shimmerNoise = ridgedFbm(uv * vec2(34.0, 22.0) + vec2(time * 0.7 + structuralShift * 0.3, -time * 0.32));\n  float shimmerMask = smoothstep(0.68, 1.0, shimmerNoise) * (cloudMass * 0.56 + halo * 0.44);\n  color += signalColor * shimmerMask * highShimmer * (0.1 + audioBrightness * 0.08);\n\n  float glint = star(uv, vec2(0.105, 0.46), 0.024) * 0.5;\n  glint += star(uv, vec2(0.91, 0.18), 0.014) * 0.22;\n  color += ice * glint * (0.16 + uBeam * 0.2);\n\n  float vignette = smoothstep(1.22, 0.08, length(centered * vec2(0.66, 0.9)));\n  float topDrop = smoothstep(0.56, 1.0, uv.y) * smoothstep(0.9, 0.0, abs(centered.x));\n  float negativeSky = smoothstep(0.04, 0.72, cloudMass + halo * 0.24 + floorArea * 0.28);\n  color *= mix(0.48, 1.0, negativeSky);\n  color *= mix(0.1, 1.0, vignette);\n  color = mix(color, voidBlack * 0.44, topDrop * 0.18);\n  color = max(color, voidBlack * 0.34);\n  color = 1.0 - exp(-color * (0.98 + uIntensity * 0.2));\n  color = pow(color, vec3(0.92));\n\n  gl_FragColor = vec4(color, 1.0);\n}\n";
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
    "uPointerStrength",
    "uAudioBass",
    "uAudioLowMid",
    "uAudioMid",
    "uAudioHigh",
    "uAudioEnergy",
    "uAudioBeat",
    "uAudioBrightness",
    "uAudioProgress",
    "uIsPlaying",
    "uAudioBassPressure",
    "uAudioEnergyHaze",
    "uAudioBeatGlow",
    "uAudioHighShimmer",
    "uAudioProgressDrift"
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function clampUnit(value, fallback) {
    return typeof value === "number" && Number.isFinite(value) ? clamp(value, 0, 1) : fallback;
  }

  function clampAudio(value, max) {
    var resolvedMax = typeof max === "number" ? max : 1;
    if (!Number.isFinite(value)) {
      return 0;
    }
    return Math.min(Math.max(value, 0), resolvedMax);
  }

  function shapeAudio(value, power, gain) {
    return clampAudio(Math.pow(clampAudio(value), power) * gain);
  }

  function lerp(current, target, amount) {
    return current + (target - current) * amount;
  }

  function dampScalar(current, target, delta, speed) {
    return lerp(current, target, 1 - Math.exp(-delta * (speed || 1.5)));
  }

  function smoothAudio(current, target, delta, amount) {
    var frameAmount = 1 - Math.pow(1 - clamp(amount, 0.001, 0.999), delta * 60);
    return lerp(current, target, frameAmount);
  }

  function lerpColor(current, target, amount) {
    current[0] = lerp(current[0], target[0], amount);
    current[1] = lerp(current[1], target[1], amount);
    current[2] = lerp(current[2], target[2], amount);
    return current;
  }

  function normalizeChannel(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) {
      return 0;
    }
    return clamp(number > 1 ? number / 255 : number, 0, 1);
  }

  function parseColor(value, fallback) {
    var backup = fallback ? fallback.slice() : [0.03, 0.07, 0.14];
    var color;
    var hex;
    var parts;
    var start;
    var end;

    if (Array.isArray(value) && value.length >= 3) {
      return [normalizeChannel(value[0]), normalizeChannel(value[1]), normalizeChannel(value[2])];
    }

    if (typeof value !== "string") {
      return backup;
    }

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

    if (color.indexOf("rgb") === 0) {
      start = color.indexOf("(");
      end = color.indexOf(")");

      if (start >= 0 && end > start) {
        parts = color.slice(start + 1, end).split(",").map(function (part) {
          return part.trim();
        });

        if (parts.length >= 3) {
          return [normalizeChannel(parts[0]), normalizeChannel(parts[1]), normalizeChannel(parts[2])];
        }
      }
    }

    return backup;
  }

  function copyAtmosphere(source) {
    var input = source || {};
    return {
      intensity: clampUnit(input.intensity, DEFAULT_ATMOSPHERE.intensity),
      haze: clampUnit(input.haze, DEFAULT_ATMOSPHERE.haze),
      beam: clampUnit(input.beam, DEFAULT_ATMOSPHERE.beam),
      tint: clampUnit(input.tint, DEFAULT_ATMOSPHERE.tint),
      drift: clampUnit(input.drift, DEFAULT_ATMOSPHERE.drift)
    };
  }

  function resolveConfig(preset, overrides) {
    var source = typeof preset === "object" ? preset : PRESETS[preset] || PRESETS[DEFAULT_PRESET];
    var nextOverrides = overrides || {};
    return {
      palette: Object.assign({}, source.palette || {}, nextOverrides.palette || {}),
      atmosphere: Object.assign(
        {},
        DEFAULT_ATMOSPHERE,
        source.atmosphere || {},
        nextOverrides.atmosphere || {}
      )
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
      throw new Error("KOOL BERK background shader failed: " + log);
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
      throw new Error("KOOL BERK background program failed: " + log);
    }

    return program;
  }

  function normalizeAudio(audio) {
    var input = audio || {};
    return {
      isPlaying: Boolean(input.isPlaying),
      progress: clampAudio(input.progress || 0),
      bands: input.bands || input
    };
  }

  function createCanvas(className) {
    var canvas = document.createElement("canvas");
    canvas.className = "kb-webgl-background__canvas" + (className ? " " + className : "");
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

  function KoolBerkBackground(target, options) {
    var config;

    if (typeof document === "undefined") {
      throw new Error("KOOL BERK background needs a browser document.");
    }

    this.options = options || {};
    this.container = resolveTarget(target);

    if (!this.container) {
      throw new Error("KOOL BERK background target was not found.");
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
      this.container.classList.add("kb-webgl-background-host");
    }

    if (this.options.manageContainer !== false && window.getComputedStyle(this.container).position === "static") {
      this.container.style.position = "relative";
    }

    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.maxDpr = Number.isFinite(this.options.maxDpr) ? Math.max(1, this.options.maxDpr) : 1.75;
    this.reducedMotion = typeof this.options.reducedMotion === "boolean"
      ? this.options.reducedMotion
      : prefersReducedMotion();
    this.pointerEnabled = this.options.pointer !== false;
    this.time = 0;
    this.running = false;
    this.raf = 0;
    this.lastFrame = 0;
    this.pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0
    };
    this.audio = normalizeAudio(this.options.audio);
    this.audioState = {
      bass: 0,
      lowMid: 0,
      mid: 0,
      high: 0,
      energy: 0,
      beat: 0,
      brightness: 0,
      progress: 0,
      isPlaying: 0
    };

    config = resolveConfig(this.options.preset || DEFAULT_PRESET, this.options);
    this.currentPalette = {
      bg: parseColor(config.palette.bg),
      deep: parseColor(config.palette.deep),
      accent: parseColor(config.palette.accent)
    };
    this.targetPalette = {
      bg: this.currentPalette.bg.slice(),
      deep: this.currentPalette.deep.slice(),
      accent: this.currentPalette.accent.slice()
    };
    this.currentAtmosphere = copyAtmosphere(config.atmosphere);
    this.targetAtmosphere = copyAtmosphere(config.atmosphere);

    this._onFrame = this._onFrame.bind(this);
    this._onResize = this.resize.bind(this);
    this._onPointerMove = this._handlePointerMove.bind(this);
    this._onPointerLeave = this._handlePointerLeave.bind(this);

    this._initGL();
    this._bindEvents();
    this.resize();

    if (this.options.autoplay !== false) {
      this.play();
    }
  }

  KoolBerkBackground.prototype._initGL = function () {
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
    gl.clearColor(0.002, 0.005, 0.012, 1);
  };

  KoolBerkBackground.prototype._bindEvents = function () {
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

  KoolBerkBackground.prototype._handlePointerMove = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    var width = Math.max(rect.width, 1);
    var height = Math.max(rect.height, 1);
    this.pointer.targetX = ((event.clientX - rect.left) / width) * 2 - 1;
    this.pointer.targetY = 1 - ((event.clientY - rect.top) / height) * 2;
  };

  KoolBerkBackground.prototype._handlePointerLeave = function () {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
  };

  KoolBerkBackground.prototype.resize = function () {
    var rect = this.container.getBoundingClientRect();
    var dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), this.maxDpr);
    var width = Math.max(1, Math.round(rect.width * dpr));
    var height = Math.max(1, Math.round(rect.height * dpr));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.width = width;
    this.height = height;
    this.gl.viewport(0, 0, width, height);
    return this;
  };

  KoolBerkBackground.prototype._update = function (delta) {
    var speed = this.reducedMotion ? 0.025 : 0.72;
    var inputGain = this.reducedMotion ? AUDIO_INPUT_GAIN * 0.55 : AUDIO_INPUT_GAIN;
    var responseGain = this.reducedMotion ? AUDIO_RESPONSE_GAIN * 0.62 : AUDIO_RESPONSE_GAIN;
    var audio = this.audio || {};
    var bands = audio.bands || {};
    var isPlaying = audio.isPlaying ? 1 : 0;
    var audioState = this.audioState;
    var targetBass = isPlaying ? shapeAudio(bands.bass || 0, 0.72, inputGain * 1.65) : 0;
    var targetLowMid = isPlaying ? shapeAudio(bands.lowMid || 0, 0.78, inputGain * 1.25) : 0;
    var targetMid = isPlaying ? shapeAudio(bands.mid || 0, 0.84, inputGain * 1.05) : 0;
    var targetHigh = isPlaying ? shapeAudio(bands.high || 0, 0.92, inputGain * 0.92) : 0;
    var targetEnergy = isPlaying ? shapeAudio(bands.energy || 0, 0.76, inputGain * 1.45) : 0;
    var targetBrightness = isPlaying ? shapeAudio(bands.brightness || 0, 0.88, inputGain * 0.5) : 0;
    var targetProgress = isPlaying ? audio.progress || 0 : 0;
    var targetBeat = isPlaying ? clampAudio((bands.beat || 0) * inputGain * 0.92) : 0;

    this.time += delta * speed;
    lerpColor(this.currentPalette.bg, this.targetPalette.bg, 1 - Math.exp(-delta * 1.4));
    lerpColor(this.currentPalette.deep, this.targetPalette.deep, 1 - Math.exp(-delta * 1.4));
    lerpColor(this.currentPalette.accent, this.targetPalette.accent, 1 - Math.exp(-delta * 1.3));
    this.currentAtmosphere.intensity = dampScalar(this.currentAtmosphere.intensity, this.targetAtmosphere.intensity, delta);
    this.currentAtmosphere.haze = dampScalar(this.currentAtmosphere.haze, this.targetAtmosphere.haze, delta);
    this.currentAtmosphere.beam = dampScalar(this.currentAtmosphere.beam, this.targetAtmosphere.beam, delta);
    this.currentAtmosphere.tint = dampScalar(this.currentAtmosphere.tint, this.targetAtmosphere.tint, delta);
    this.currentAtmosphere.drift = dampScalar(
      this.currentAtmosphere.drift,
      this.reducedMotion ? this.targetAtmosphere.drift * 0.08 : this.targetAtmosphere.drift,
      delta
    );
    this.pointer.x = dampScalar(this.pointer.x, this.pointer.targetX, delta, 2.8);
    this.pointer.y = dampScalar(this.pointer.y, this.pointer.targetY, delta, 2.8);
    this.pointer.strength = dampScalar(this.pointer.strength, this.reducedMotion || !this.pointerEnabled ? 0 : 1, delta, 1.8);

    audioState.bass = smoothAudio(audioState.bass, targetBass, delta, AUDIO_SMOOTHING.bass);
    audioState.lowMid = smoothAudio(audioState.lowMid, targetLowMid, delta, AUDIO_SMOOTHING.lowMid);
    audioState.mid = smoothAudio(audioState.mid, targetMid, delta, AUDIO_SMOOTHING.mid);
    audioState.high = smoothAudio(audioState.high, targetHigh, delta, AUDIO_SMOOTHING.high);
    audioState.energy = smoothAudio(audioState.energy, targetEnergy, delta, AUDIO_SMOOTHING.energy);
    audioState.brightness = smoothAudio(audioState.brightness, targetBrightness, delta, AUDIO_SMOOTHING.brightness);
    audioState.progress = smoothAudio(audioState.progress, clampAudio(targetProgress), delta, AUDIO_SMOOTHING.progress);
    audioState.isPlaying = smoothAudio(audioState.isPlaying, isPlaying, delta, AUDIO_SMOOTHING.playState);
    audioState.beat = Math.max(
      audioState.beat * Math.pow(AUDIO_SMOOTHING.beatDecay, delta * 60),
      smoothAudio(audioState.beat, clampAudio(targetBeat), delta, AUDIO_SMOOTHING.beatAttack)
    );

    this.audioResponseGain = responseGain;
  };

  KoolBerkBackground.prototype._draw = function () {
    var gl = this.gl;
    var uniforms = this.uniforms;
    var atmosphere = this.currentAtmosphere;
    var audio = this.audioState;
    var responseGain = this.audioResponseGain || 1;

    gl.useProgram(this.program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.uTime, this.time);
    gl.uniform2f(uniforms.uResolution, this.width, this.height);
    gl.uniform3f(uniforms.uBaseColor, this.currentPalette.bg[0], this.currentPalette.bg[1], this.currentPalette.bg[2]);
    gl.uniform3f(uniforms.uDeepColor, this.currentPalette.deep[0], this.currentPalette.deep[1], this.currentPalette.deep[2]);
    gl.uniform3f(uniforms.uAccentColor, this.currentPalette.accent[0], this.currentPalette.accent[1], this.currentPalette.accent[2]);
    gl.uniform1f(uniforms.uIntensity, atmosphere.intensity);
    gl.uniform1f(uniforms.uHaze, atmosphere.haze);
    gl.uniform1f(uniforms.uBeam, atmosphere.beam);
    gl.uniform1f(uniforms.uTint, atmosphere.tint);
    gl.uniform1f(uniforms.uDrift, atmosphere.drift);
    gl.uniform1f(uniforms.uDebug, 0);
    gl.uniform2f(uniforms.uPointer, this.pointer.x, this.pointer.y);
    gl.uniform1f(uniforms.uPointerStrength, this.pointer.strength);
    gl.uniform1f(uniforms.uAudioBass, audio.bass);
    gl.uniform1f(uniforms.uAudioLowMid, audio.lowMid);
    gl.uniform1f(uniforms.uAudioMid, audio.mid);
    gl.uniform1f(uniforms.uAudioHigh, audio.high);
    gl.uniform1f(uniforms.uAudioEnergy, audio.energy);
    gl.uniform1f(uniforms.uAudioBeat, audio.beat);
    gl.uniform1f(uniforms.uAudioBrightness, audio.brightness);
    gl.uniform1f(uniforms.uAudioProgress, audio.progress);
    gl.uniform1f(uniforms.uIsPlaying, audio.isPlaying);
    gl.uniform1f(uniforms.uAudioBassPressure, AUDIO_RESPONSE.bassPressure * responseGain);
    gl.uniform1f(uniforms.uAudioEnergyHaze, AUDIO_RESPONSE.energyHaze * responseGain);
    gl.uniform1f(uniforms.uAudioBeatGlow, AUDIO_RESPONSE.beatGlow * responseGain);
    gl.uniform1f(uniforms.uAudioHighShimmer, AUDIO_RESPONSE.highShimmer * responseGain);
    gl.uniform1f(uniforms.uAudioProgressDrift, AUDIO_RESPONSE.progressDrift * responseGain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  KoolBerkBackground.prototype._onFrame = function (now) {
    var seconds = now * 0.001;
    var delta = this.lastFrame ? clamp(seconds - this.lastFrame, 0.001, 0.05) : 0.016;

    this.lastFrame = seconds;
    this._update(delta);
    this._draw();

    if (this.running) {
      this.raf = window.requestAnimationFrame(this._onFrame);
    }
  };

  KoolBerkBackground.prototype.play = function () {
    if (!this.running) {
      this.running = true;
      this.lastFrame = 0;
      this.raf = window.requestAnimationFrame(this._onFrame);
    }
    return this;
  };

  KoolBerkBackground.prototype.pause = function () {
    this.running = false;
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    return this;
  };

  KoolBerkBackground.prototype.setPreset = function (preset, overrides) {
    var config = resolveConfig(preset || DEFAULT_PRESET, overrides);
    this.targetPalette = {
      bg: parseColor(config.palette.bg, this.targetPalette.bg),
      deep: parseColor(config.palette.deep, this.targetPalette.deep),
      accent: parseColor(config.palette.accent, this.targetPalette.accent)
    };
    this.targetAtmosphere = copyAtmosphere(config.atmosphere);
    return this;
  };

  KoolBerkBackground.prototype.setPalette = function (palette) {
    var next = palette || {};
    this.targetPalette = {
      bg: parseColor(next.bg, this.targetPalette.bg),
      deep: parseColor(next.deep, this.targetPalette.deep),
      accent: parseColor(next.accent, this.targetPalette.accent)
    };
    return this;
  };

  KoolBerkBackground.prototype.setAtmosphere = function (atmosphere) {
    this.targetAtmosphere = copyAtmosphere(Object.assign({}, this.targetAtmosphere, atmosphere || {}));
    return this;
  };

  KoolBerkBackground.prototype.setAudio = function (audio) {
    this.audio = normalizeAudio(audio);
    return this;
  };

  KoolBerkBackground.prototype.setReducedMotion = function (reducedMotion) {
    this.reducedMotion = Boolean(reducedMotion);
    return this;
  };

  KoolBerkBackground.prototype.destroy = function () {
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
    presets: PRESETS,
    mount: function (target, options) {
      return new KoolBerkBackground(target, options);
    },
    Background: KoolBerkBackground
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.KoolBerkWebGLBackground;
  }
})(typeof window !== "undefined" ? window : globalThis);
