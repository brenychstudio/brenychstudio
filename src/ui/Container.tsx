export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[min(94vw,1180px)] 2xl:w-[min(90vw,1320px)] min-[1900px]:w-[min(86vw,1400px)]">
      {children}
    </div>
  );
}
