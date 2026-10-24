/** "AI presenter · pre-recorded": in a narrow column it wraps at its separator, never inside a word. */
export default function PresenterDisclosure({ text }: { text: string }) {
  const parts = text.split(" · ");
  return <>{parts.map((part, index) => <span key={part}>
    <span className="studio-presence__nowrap">{part}{index < parts.length - 1 && " ·"}</span>{index < parts.length - 1 && " "}
  </span>)}</>;
}
