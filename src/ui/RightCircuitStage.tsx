import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type PointerState = {
  x: number;
  y: number;
};

type Trace = {
  id: string;
  d: string;
  width: number;
  opacity: number;
  speed: number;
  delay: number;
  terminal?: {
    x: number;
    y: number;
    open?: boolean;
  };
};

type ModuleNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "chip" | "gate" | "bridge" | "bar";
};

type CircuitStageData = {
  traces: Trace[];
  ghostTraces: Trace[];
  revealTraces: Trace[];
  modules: ModuleNode[];
  terminals: Array<{ id: string; x: number; y: number; open?: boolean }>;
  dataNodes: Array<{ id: string; x: number; y: number; size: number; delay: number }>;
  microMarks: Array<{ id: string; x: number; y: number; w: number; h: number; o: number }>;
};

type RightCircuitStageProps = {
  className?: string;
  height?: number;
};

function pathFromPoints(points: Array<[number, number]>): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(2)},${point[1].toFixed(2)}`)
    .join("");
}

function createCircuitStage(): CircuitStageData {
  const traces: Trace[] = [
    { id: "left-a", d: pathFromPoints([[314,392],[276,392],[276,342],[242,308],[242,236],[214,208],[214,138]]), width: 2, opacity: 0.86, speed: 1.02, delay: 0, terminal: { x: 214, y: 138, open: true } },
    { id: "left-b", d: pathFromPoints([[314,412],[266,412],[266,470],[232,504],[232,646]]), width: 1.86, opacity: 0.8, speed: 0.84, delay: 0.14, terminal: { x: 232, y: 646, open: false } },
    { id: "left-c", d: pathFromPoints([[314,430],[286,430],[286,548],[256,578],[256,776]]), width: 1.76, opacity: 0.76, speed: 0.72, delay: 0.28, terminal: { x: 256, y: 776, open: true } },
    { id: "left-d", d: pathFromPoints([[276,342],[236,302],[236,214]]), width: 1.44, opacity: 0.66, speed: 0.66, delay: 0.2, terminal: { x: 236, y: 214, open: false } },
    { id: "left-e", d: pathFromPoints([[266,484],[212,484],[180,452],[124,452]]), width: 1.56, opacity: 0.72, speed: 0.9, delay: 0.18, terminal: { x: 124, y: 452, open: true } },
    { id: "left-f", d: pathFromPoints([[256,698],[210,744],[162,792],[112,842]]), width: 1.18, opacity: 0.6, speed: 0.56, delay: 0.38, terminal: { x: 112, y: 842, open: true } },
    { id: "right-a", d: pathFromPoints([[406,392],[446,392],[446,338],[484,300],[484,232],[514,202],[514,132]]), width: 2, opacity: 0.86, speed: 1.06, delay: 0.08, terminal: { x: 514, y: 132, open: true } },
    { id: "right-b", d: pathFromPoints([[406,412],[456,412],[456,466],[490,500],[490,646]]), width: 1.86, opacity: 0.8, speed: 0.82, delay: 0.16, terminal: { x: 490, y: 646, open: false } },
    { id: "right-c", d: pathFromPoints([[406,430],[438,430],[438,552],[470,584],[470,792]]), width: 1.76, opacity: 0.76, speed: 0.72, delay: 0.28, terminal: { x: 470, y: 792, open: true } },
    { id: "right-e", d: pathFromPoints([[456,484],[512,484],[548,448],[614,448]]), width: 1.56, opacity: 0.72, speed: 0.92, delay: 0.22, terminal: { x: 614, y: 448, open: false } },
    { id: "right-f", d: pathFromPoints([[438,552],[438,596],[474,632],[474,718]]), width: 1.2, opacity: 0.6, speed: 0.54, delay: 0.34, terminal: { x: 474, y: 718, open: false } },
    { id: "core-up-left", d: pathFromPoints([[338,364],[338,320],[316,298],[316,224]]), width: 1.28, opacity: 0.68, speed: 0.78, delay: 0.18, terminal: { x: 316, y: 224, open: false } },
    { id: "core-up-right", d: pathFromPoints([[382,364],[382,318],[404,296],[404,222]]), width: 1.28, opacity: 0.68, speed: 0.76, delay: 0.24, terminal: { x: 404, y: 222, open: false } },
    { id: "core-down-left", d: pathFromPoints([[338,456],[338,522],[310,550],[310,690]]), width: 1.28, opacity: 0.66, speed: 0.72, delay: 0.3, terminal: { x: 310, y: 690, open: false } },
    { id: "core-down-right", d: pathFromPoints([[382,456],[382,522],[410,550],[410,694]]), width: 1.28, opacity: 0.66, speed: 0.72, delay: 0.36, terminal: { x: 410, y: 694, open: false } },
    { id: "mid-link-left", d: pathFromPoints([[314,456],[286,456],[286,522]]), width: 1.16, opacity: 0.54, speed: 0.86, delay: 0.4 },
    { id: "mid-link-right", d: pathFromPoints([[406,392],[438,392],[438,430]]), width: 1.16, opacity: 0.54, speed: 0.84, delay: 0.24 },
    { id: "core-left-bridge", d: pathFromPoints([[314,404],[280,404],[258,426],[258,470]]), width: 1.06, opacity: 0.48, speed: 0.82, delay: 0.18 },
    { id: "core-right-bridge", d: pathFromPoints([[406,416],[438,416],[460,438],[460,486]]), width: 1.06, opacity: 0.48, speed: 0.82, delay: 0.26 },
  ];
  const ghostTraces: Trace[] = [
    { id: "ghost-a", d: pathFromPoints([[334,226],[334,166],[304,136]]), width: 0.92, opacity: 0.16, speed: 0.42, delay: 0.22 },
    { id: "ghost-b", d: pathFromPoints([[494,526],[546,578],[546,700]]), width: 0.92, opacity: 0.16, speed: 0.46, delay: 0.3 },
    { id: "ghost-c", d: pathFromPoints([[230,566],[184,612],[184,724]]), width: 0.92, opacity: 0.14, speed: 0.4, delay: 0.16 },
  ];
  const revealTraces: Trace[] = [
    { id: "reveal-up-main-left", d: pathFromPoints([[348,364],[348,296],[326,274],[326,188],[308,170]]), width: 1.24, opacity: 0.78, speed: 1.1, delay: 0 },
    { id: "reveal-up-main-right", d: pathFromPoints([[372,364],[372,296],[394,274],[394,188],[412,170]]), width: 1.24, opacity: 0.78, speed: 1.12, delay: 0.08 },
    { id: "reveal-up-left", d: pathFromPoints([[334,382],[300,348],[300,290],[266,256]]), width: 1.08, opacity: 0.5, speed: 0.96, delay: 0.18 },
    { id: "reveal-up-right", d: pathFromPoints([[386,382],[420,348],[420,290],[454,256]]), width: 1.08, opacity: 0.5, speed: 0.98, delay: 0.26 },
    { id: "reveal-down-main-left", d: pathFromPoints([[348,456],[348,538],[326,560],[326,662],[308,680]]), width: 1.24, opacity: 0.78, speed: 1.08, delay: 0.36 },
    { id: "reveal-down-main-right", d: pathFromPoints([[372,456],[372,538],[394,560],[394,662],[412,680]]), width: 1.24, opacity: 0.78, speed: 1.1, delay: 0.44 },
    { id: "reveal-down-left", d: pathFromPoints([[334,438],[300,472],[300,542],[266,576]]), width: 1.06, opacity: 0.48, speed: 0.96, delay: 0.54 },
    { id: "reveal-down-right", d: pathFromPoints([[386,438],[420,472],[420,542],[454,576]]), width: 1.06, opacity: 0.48, speed: 0.96, delay: 0.62 },
  ];
  const modules: ModuleNode[] = [
    { id: "chip-a", x: 276, y: 248, w: 18, h: 28, type: "chip" },
    { id: "chip-b", x: 548, y: 620, w: 18, h: 28, type: "chip" },
    { id: "chip-c", x: 218, y: 726, w: 18, h: 28, type: "chip" },
    { id: "gate-a", x: 592, y: 322, w: 16, h: 16, type: "gate" },
    { id: "gate-b", x: 270, y: 616, w: 16, h: 16, type: "gate" },
    { id: "bridge-a", x: 502, y: 278, w: 14, h: 22, type: "bridge" },
    { id: "bridge-b", x: 486, y: 688, w: 14, h: 22, type: "bridge" },
    { id: "bar-a", x: 606, y: 234, w: 18, h: 10, type: "bar" },
    { id: "bar-b", x: 146, y: 470, w: 18, h: 10, type: "bar" },
  ];
  const terminals = traces.filter((trace) => trace.terminal).map((trace) => ({ id: `${trace.id}-terminal`, x: trace.terminal!.x, y: trace.terminal!.y, open: trace.terminal!.open }));
  const microMarks = [{ id: "mm-1", x: 160, y: 248, w: 7, h: 3, o: 0.22 },{ id: "mm-2", x: 200, y: 224, w: 3, h: 7, o: 0.18 },{ id: "mm-3", x: 250, y: 188, w: 7, h: 3, o: 0.2 },{ id: "mm-4", x: 494, y: 192, w: 7, h: 7, o: 0.16 },{ id: "mm-5", x: 540, y: 214, w: 4, h: 9, o: 0.22 },{ id: "mm-6", x: 616, y: 256, w: 7, h: 3, o: 0.18 },{ id: "mm-7", x: 628, y: 392, w: 7, h: 3, o: 0.14 },{ id: "mm-8", x: 610, y: 540, w: 10, h: 10, o: 0.28 },{ id: "mm-9", x: 556, y: 680, w: 7, h: 3, o: 0.18 },{ id: "mm-10", x: 478, y: 776, w: 7, h: 3, o: 0.16 },{ id: "mm-11", x: 182, y: 764, w: 9, h: 3, o: 0.24 },{ id: "mm-12", x: 130, y: 476, w: 7, h: 3, o: 0.14 },{ id: "mm-13", x: 326, y: 164, w: 8, h: 8, o: 0.12 },{ id: "mm-14", x: 412, y: 594, w: 8, h: 3, o: 0.14 }];
  const dataNodes = [{ id: "dn-1", x: 300, y: 374, size: 2.4, delay: 0.1 },{ id: "dn-2", x: 262, y: 334, size: 2.2, delay: 0.42 },{ id: "dn-3", x: 238, y: 506, size: 2.5, delay: 0.82 },{ id: "dn-4", x: 446, y: 362, size: 2.3, delay: 0.2 },{ id: "dn-5", x: 472, y: 506, size: 2.5, delay: 0.62 },{ id: "dn-6", x: 518, y: 628, size: 2.3, delay: 1.04 },{ id: "dn-7", x: 220, y: 146, size: 2, delay: 0.18 },{ id: "dn-8", x: 112, y: 842, size: 2.1, delay: 0.9 },{ id: "dn-9", x: 360, y: 760, size: 2.2, delay: 0.56 }];
  return { traces, ghostTraces, revealTraces, modules, terminals, dataNodes, microMarks };
}

function ModuleGlyph({ module, time }: { module: ModuleNode; time: number }) {
  const pulse = 0.9 + Math.sin(time * 1.8 + module.x * 0.01 + module.y * 0.006) * 0.08;
  if (module.type === "chip") return <motion.g animate={{ opacity: 0.78 + pulse * 0.08 }} transition={{ duration: 0.22, ease: "linear" }}><rect x={module.x - module.w / 2} y={module.y - module.h / 2} width={module.w} height={module.h} rx={4} fill="white" stroke="rgba(0,0,0,0.88)" strokeWidth={2} /><rect x={module.x - module.w / 2 + 3} y={module.y - module.h / 2 + 6} width={module.w - 6} height={module.h - 12} rx={2} fill="rgba(0,0,0,0.1)" /></motion.g>;
  if (module.type === "gate") return <motion.g animate={{ rotate: Math.sin(time * 0.8 + module.x * 0.02) * 2 }} style={{ transformOrigin: `${module.x}px ${module.y}px` }} transition={{ duration: 0.24, ease: "linear" }}><rect x={module.x - module.w / 2} y={module.y - module.h / 2} width={module.w} height={module.h} rx={3} fill="rgba(0,0,0,0.9)" /></motion.g>;
  if (module.type === "bridge") return <rect x={module.x - module.w / 2} y={module.y - module.h / 2} width={module.w} height={module.h} rx={3} fill="white" stroke="rgba(0,0,0,0.74)" strokeWidth={1.6} />;
  return <rect x={module.x - module.w / 2} y={module.y - module.h / 2} width={module.w} height={module.h} rx={2} fill="rgba(0,0,0,0.88)" />;
}

function SignalDot({ cx, cy, size, offset, speed }: { cx: number; cy: number; size: number; offset: number; speed: number }) {
  return <motion.circle cx={cx} cy={cy} r={size} fill="rgba(0,0,0,0.92)" animate={{ opacity: [0.18, 1, 0.18], scale: [0.85, 1.08, 0.85] }} transition={{ repeat: Infinity, duration: speed, ease: "easeInOut", delay: offset }} style={{ transformOrigin: `${cx}px ${cy}px` }} />;
}

function CentralChip({ x, y, time }: { x: number; y: number; time: number }) {
  return <g><motion.circle cx={x} cy={y} r={66} fill="white" stroke="rgba(0,0,0,0.14)" strokeWidth={1.5} animate={{ opacity: 0.92 + Math.sin(time * 0.42) * 0.02 }} transition={{ duration: 0.28, ease: "linear" }} /><circle cx={x} cy={y} r={44} fill="white" stroke="rgba(0,0,0,0.82)" strokeWidth={2.4} /><circle cx={x} cy={y} r={18} fill="rgba(0,0,0,0.92)" /><circle cx={x} cy={y} r={7} fill="white" /><motion.circle cx={x} cy={y} r={84} fill="transparent" stroke="rgba(0,0,0,0.12)" strokeWidth={1} animate={{ opacity: [0.18, 0.34, 0.18] }} transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }} /></g>;
}

export default function RightCircuitStage({ className, height = 860 }: RightCircuitStageProps) {
  const [time, setTime] = useState(0);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const targetRef = useRef<PointerState>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      targetRef.current.x += (0 - targetRef.current.x) * 0.0016;
      targetRef.current.y += (0 - targetRef.current.y) * 0.0016;
      setPointer((prev) => ({ x: prev.x + (targetRef.current.x - prev.x) * 0.04, y: prev.y + (targetRef.current.y - prev.y) * 0.04 }));
      setTime((prev) => prev + dt * 0.00096);
      if (mounted) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { mounted = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const stage = useMemo(() => createCircuitStage(), []);
  const groupX = pointer.x * 12;
  const groupY = pointer.y * 9;
  const glowX = pointer.x * 18;
  const glowY = pointer.y * 14;

  return (
    <div className={["relative w-full overflow-hidden", className].filter(Boolean).join(" ")} style={{ height }}>
      <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-[46%] h-[54%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.032), rgba(0,0,0,0.008) 42%, rgba(0,0,0,0) 78%)", filter: "blur(38px)" }} animate={{ x: glowX, y: glowY, scale: 1.018 + Math.sin(time * 0.34) * 0.012, opacity: 0.8 + Math.sin(time * 0.42) * 0.03 }} transition={{ type: "spring", stiffness: 18, damping: 24, mass: 2.4 }} />
      <motion.svg viewBox="0 0 720 860" className="absolute inset-0 h-full w-full" animate={{ x: groupX, y: groupY }} transition={{ type: "spring", stiffness: 18, damping: 24, mass: 2.4 }} onMouseMove={(e) => { const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect(); targetRef.current = { x: ((e.clientX - rect.left) / rect.width - 0.5) * 1.12, y: ((e.clientY - rect.top) / rect.height - 0.5) * 1.12 }; }} onMouseLeave={() => { targetRef.current = { x: 0, y: 0 }; setHovered(false); }}>
        <g>{stage.ghostTraces.map((trace, index) => <motion.path key={trace.id} d={trace.d} fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth={trace.width} strokeLinecap="round" strokeLinejoin="round" opacity={trace.opacity} animate={{ opacity: trace.opacity * (0.9 + Math.sin(time * 0.46 + index * 0.26) * 0.08) }} transition={{ duration: 0.34, ease: "linear" }} />)}</g>
        <g>{stage.traces.map((trace, index) => <g key={trace.id}><path d={trace.d} fill="none" stroke="rgba(0,0,0,0.84)" strokeWidth={trace.width} strokeLinecap="round" strokeLinejoin="round" opacity={trace.opacity} /><motion.path d={trace.d} fill="none" stroke="rgba(0,0,0,0.98)" strokeWidth={trace.width + 0.28} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14 188" animate={{ strokeDashoffset: -(time * 170 * trace.speed + trace.delay * 120), opacity: 0.52 + Math.sin(time * 0.8 + index * 0.18) * 0.1 }} transition={{ duration: 0.08, ease: "linear" }} /></g>)}</g>
        <g>{stage.revealTraces.map((trace) => <g key={trace.id}><motion.path d={trace.d} fill="none" stroke="rgba(0,0,0,0.92)" strokeWidth={trace.width} strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? trace.opacity : 0 }} transition={{ duration: hovered ? 0.88 : 1.6, ease: [0.22, 1, 0.36, 1], delay: hovered ? trace.delay : 0 }} /><motion.path d={trace.d} fill="none" stroke="rgba(0,0,0,1)" strokeWidth={trace.width + 0.18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 140" initial={false} animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 0.58 : 0, strokeDashoffset: -(time * 140 * trace.speed) }} transition={{ duration: hovered ? 0.88 : 1.6, ease: [0.22, 1, 0.36, 1], delay: hovered ? trace.delay + 0.08 : 0 }} /></g>)}</g>
        <g>{stage.modules.map((module) => <ModuleGlyph key={module.id} module={module} time={time} />)}</g>
        <g>{stage.terminals.map((terminal, index) => <motion.g key={terminal.id} animate={{ opacity: 0.86 + Math.sin(time * 0.58 + index * 0.36) * 0.08 }} transition={{ duration: 0.34, ease: "linear" }}>{terminal.open ? <circle cx={terminal.x} cy={terminal.y} r={6.2} fill="white" stroke="rgba(0,0,0,0.88)" strokeWidth={2} /> : <circle cx={terminal.x} cy={terminal.y} r={3} fill="rgba(0,0,0,0.94)" />}</motion.g>)}</g>
        <g>{stage.dataNodes.map((node, index) => <SignalDot key={node.id} cx={node.x} cy={node.y} offset={node.delay} speed={1.8 + (index % 4) * 0.16} size={node.size} />)}</g>
        <g>{stage.microMarks.map((mark, index) => <motion.rect key={mark.id} x={mark.x} y={mark.y} width={mark.w} height={mark.h} fill="rgba(0,0,0,0.9)" animate={{ opacity: mark.o + Math.sin(time * 0.68 + index * 0.24) * 0.1 }} transition={{ duration: 0.34, ease: "linear" }} />)}</g>
        <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "pointer" }}>
          <CentralChip x={360} y={410} time={time} />
          <motion.circle cx={360} cy={410} r={88} fill="transparent" animate={{ opacity: hovered ? 0.08 : 0 }} transition={{ duration: 0.22, ease: "easeOut" }} />
        </g>
      </motion.svg>
    </div>
  );
}
