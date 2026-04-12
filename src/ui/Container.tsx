export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5 md:px-8 xl:px-10">{children}</div>;
}
