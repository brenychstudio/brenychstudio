import type { PublicLocale } from "../../data/projectRegistry.types";
import type { DirectorStep, PresenterCta } from "./directorContract";

const PRIVATE_PREVIEW = import.meta.env?.VITE_STUDIO_AVATAR_MEDIA === "private-preview";

export type PresenterAnswerId = "studio" | "products" | "games" | "immersive" | "ai" | "start";

export type PresenterAnswer = {
  id: PresenterAnswerId;
  question: string;
  // Caption cues; joined with single spaces they are the exact recorded transcript.
  cues: readonly string[];
  // What the website shows while the answer plays, cue by cue.
  plan: readonly DirectorStep[];
  cta: PresenterCta;
};

export type PresenterCopy = {
  trigger: string;
  region: string;
  disclosure: string;
  intro: string;
  questions: string;
  close: string;
  stop: string;
  replay: string;
  back: string;
  voice: string;
  receipt: { running: string; done: string; failed: string; interrupted: string };
  // What the portrait is doing: it is never shown as speaking unless a recorded clip really plays.
  media: { loading: string; pending: string; unavailable: string };
  answers: readonly PresenterAnswer[];
};

// Studio voice ("we"); every claim is adapted from approved site copy (STUDIO-AGENT-00 source map, games.ts, OfferV2,
// homeSpatialPresentation). Receipts name only what the director confirmed on screen.
export const presenterCopy: Record<PublicLocale, PresenterCopy> = {
  en: {
    trigger: "Meet the studio",
    region: "Studio presenter",
    disclosure: PRIVATE_PREVIEW ? "AI presenter · pre-recorded" : "Guided studio tour · scripted",
    intro: "Choose a question. We answer and show you the work on the site.",
    questions: "Questions",
    close: "Close",
    stop: "Stop",
    replay: "Replay",
    back: "Back",
    voice: "Voice",
    receipt: { running: "Opening", done: "On screen", failed: "Not confirmed", interrupted: "Tour paused — you took over" },
    media: { loading: "Loading the recorded answer", pending: PRIVATE_PREVIEW ? "Preview — animated clip pending · transcript" : "Scripted tour · text guidance", unavailable: "Video and voice unavailable · transcript" },
    answers: [
      {
        id: "studio",
        question: "What does Brenych Studio do?",
        cues: [
          "We're an independent product engineering and creative technology practice, founded by Rostyslav Brenych in Barcelona.",
          "Product engineering meets creative technology.",
          "Software, controlled AI and spatial experiences — built with intention.",
        ],
        plan: [{ atCue: 0, action: { kind: "anchor", id: "ecosystem" }, receipt: "Home · Ecosystem" }],
        cta: { kind: "route", path: "/work", label: "Open Work" },
      },
      {
        id: "products",
        question: "Show me your products",
        cues: [
          "We build products inside the studio and present them with their current state, evidence and access boundary intact.",
          "Two are public: Weekfield — beta, controlled access —",
          "and Print Border Studio — prototype, adaptation available.",
        ],
        plan: [
          { atCue: 0, action: { kind: "product", projectId: "weekfield" }, receipt: "Products · Weekfield" },
          { atCue: 2, action: { kind: "product", projectId: "print-border-studio" }, receipt: "Products · Print Border Studio" },
        ],
        cta: { kind: "route", path: "/products", label: "Open Products" },
      },
      {
        id: "games",
        question: "Show me your games",
        cues: [
          "We're developing four original game worlds.",
          "BLACK START comes first: a near-future action-adventure in pre-production.",
          "PROJECT MARS 2158 is hard-sci-fi strategy with direct control — a playable prototype in the editor.",
          "SHIFT WORLD and PROJECT TERRITORIES complete the line-up.",
        ],
        plan: [
          { atCue: 0, action: { kind: "route", path: "/games", game: "black-start" }, receipt: "Games · BLACK START" },
          { atCue: 2, action: { kind: "game", slug: "project-mars-2158" }, receipt: "Games · PROJECT MARS 2158" },
          { atCue: 3, action: { kind: "game", slug: "shift-world" }, receipt: "Games · SHIFT WORLD" },
        ],
        cta: { kind: "stay", label: "Continue on Games" },
      },
      {
        id: "immersive",
        question: "Show me your immersive work",
        cues: [
          "We build real-time 3D, WebGL / WebGPU, XR and cinematic interfaces.",
          "WHISPER is a public spatial proof in active development.",
          "WEBHERO is a web-first visual system for cinematic stages, living images and spatial presentation.",
        ],
        plan: [
          { atCue: 0, action: { kind: "spatial", proof: "whisper" }, receipt: "Spatial · WHISPER" },
          { atCue: 2, action: { kind: "spatial", proof: "webhero" }, receipt: "Spatial · WEBHERO" },
        ],
        cta: { kind: "route", path: "/immersive", label: "Open Immersive" },
      },
      {
        id: "ai",
        question: "Do you build AI-powered applications?",
        cues: [
          "Yes. AI-native products, MCP and WebMCP, agent workflows and evaluation systems.",
          "We build controlled AI workflows and agent-facing systems with explicit tools, evidence, approval boundaries and human review where actions have consequences.",
        ],
        plan: [
          { atCue: 0, action: { kind: "route", path: "/offer" }, receipt: "Offer" },
          { atCue: 1, action: { kind: "offer-system", system: "ai-agent-systems" }, receipt: "Offer · AI & Agent Systems" },
        ],
        cta: { kind: "stay", label: "Continue on Offer" },
      },
      {
        id: "start",
        question: "How do we start a project?",
        cues: [
          "Open the project form: pick a direction and add a short note.",
          "We reply with the cleanest next step.",
          "You can also email us directly from the same form.",
        ],
        plan: [{ atCue: 0, action: { kind: "anchor", id: "collaboration" }, receipt: "Home · Collaborate" }],
        cta: { kind: "project", label: "Open the project form" },
      },
    ],
  },
  es: {
    trigger: "Conoce el estudio",
    region: "Presentador del estudio",
    disclosure: PRIVATE_PREVIEW ? "Presentador IA · pregrabado" : "Recorrido guiado · predefinido",
    intro: "Elige una pregunta. Respondemos y te mostramos el trabajo en la web.",
    questions: "Preguntas",
    close: "Cerrar",
    stop: "Detener",
    replay: "Repetir",
    back: "Volver",
    voice: "Voz",
    receipt: { running: "Abriendo", done: "En pantalla", failed: "Sin confirmar", interrupted: "Recorrido en pausa: tomaste el control" },
    media: { loading: "Cargando la respuesta grabada", pending: PRIVATE_PREVIEW ? "Vista previa — clip animado pendiente · transcripción" : "Recorrido predefinido · guía de texto", unavailable: "Vídeo y voz no disponibles · transcripción" },
    answers: [
      {
        id: "studio",
        question: "¿Qué hace Brenych Studio?",
        cues: [
          "Somos una práctica independiente de ingeniería de producto y tecnología creativa, fundada por Rostyslav Brenych en Barcelona.",
          "Ingeniería de producto y tecnología creativa.",
          "Software, IA controlada y experiencias espaciales — construidos con intención.",
        ],
        plan: [{ atCue: 0, action: { kind: "anchor", id: "ecosystem" }, receipt: "Inicio · Ecosistema" }],
        cta: { kind: "route", path: "/work", label: "Abrir Casos" },
      },
      {
        id: "products",
        question: "Muéstrame vuestros productos",
        cues: [
          "Desarrollamos productos dentro del estudio y los presentamos con su estado, evidencia y límites de acceso actuales.",
          "Hay dos públicos: Weekfield — beta, acceso controlado —",
          "y Print Border Studio — prototipo, adaptación disponible.",
        ],
        plan: [
          { atCue: 0, action: { kind: "product", projectId: "weekfield" }, receipt: "Productos · Weekfield" },
          { atCue: 2, action: { kind: "product", projectId: "print-border-studio" }, receipt: "Productos · Print Border Studio" },
        ],
        cta: { kind: "route", path: "/products", label: "Abrir Productos" },
      },
      {
        id: "games",
        question: "Muéstrame vuestros juegos",
        cues: [
          "Estamos desarrollando cuatro mundos de juego originales.",
          "BLACK START va primero: acción y aventura en un futuro cercano, en preproducción.",
          "PROJECT MARS 2158: estrategia de ciencia ficción dura con control directo, prototipo jugable en el editor.",
          "SHIFT WORLD y PROJECT TERRITORIES completan la serie.",
        ],
        plan: [
          { atCue: 0, action: { kind: "route", path: "/games", game: "black-start" }, receipt: "Juegos · BLACK START" },
          { atCue: 2, action: { kind: "game", slug: "project-mars-2158" }, receipt: "Juegos · PROJECT MARS 2158" },
          { atCue: 3, action: { kind: "game", slug: "shift-world" }, receipt: "Juegos · SHIFT WORLD" },
        ],
        cta: { kind: "stay", label: "Seguir en Juegos" },
      },
      {
        id: "immersive",
        question: "Muéstrame vuestro trabajo inmersivo",
        cues: [
          "Creamos 3D en tiempo real, WebGL / WebGPU, XR e interfaces cinematográficas.",
          "WHISPER es una prueba espacial pública en desarrollo activo.",
          "WEBHERO es un sistema visual web para stages cinematográficos, imágenes vivas y presentación espacial.",
        ],
        plan: [
          { atCue: 0, action: { kind: "spatial", proof: "whisper" }, receipt: "Espacial · WHISPER" },
          { atCue: 2, action: { kind: "spatial", proof: "webhero" }, receipt: "Espacial · WEBHERO" },
        ],
        cta: { kind: "route", path: "/immersive", label: "Abrir XR" },
      },
      {
        id: "ai",
        question: "¿Creáis aplicaciones con IA?",
        cues: [
          "Sí. Productos AI-native, MCP y WebMCP, workflows de agentes y sistemas de evaluación.",
          "Construimos workflows de IA controlados y sistemas orientados a agentes con herramientas explícitas, evidencia, límites de aprobación y revisión humana allí donde las acciones tienen consecuencias.",
        ],
        plan: [
          { atCue: 0, action: { kind: "route", path: "/offer" }, receipt: "Servicios" },
          { atCue: 1, action: { kind: "offer-system", system: "ai-agent-systems" }, receipt: "Servicios · IA y Sistemas de Agentes" },
        ],
        cta: { kind: "stay", label: "Seguir en Servicios" },
      },
      {
        id: "start",
        question: "¿Cómo empezamos un proyecto?",
        cues: [
          "Abre el formulario de proyecto: elige una dirección y añade una nota breve.",
          "Te responderemos con el siguiente paso más limpio.",
          "También puedes escribirnos directamente desde el mismo formulario.",
        ],
        plan: [{ atCue: 0, action: { kind: "anchor", id: "collaboration" }, receipt: "Inicio · Colaborar" }],
        cta: { kind: "project", label: "Abrir el formulario" },
      },
    ],
  },
};
