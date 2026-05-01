export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[min(94vw,1180px)]">
      {children}
    </div>
  );
}
