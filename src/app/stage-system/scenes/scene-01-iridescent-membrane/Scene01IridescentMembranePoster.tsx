type PosterProps = {
  className?: string;
};

export default function Scene01IridescentMembranePoster({ className = "" }: PosterProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-[#020206] ${className}`}
      style={{
        aspectRatio: "16 / 9",
        backgroundImage:
          "radial-gradient(circle at 18% 18%, rgba(75,255,220,0.14), transparent 0 22%), radial-gradient(circle at 78% 20%, rgba(255,94,225,0.12), transparent 0 15%), radial-gradient(circle at 58% 82%, rgba(255,225,110,0.1), transparent 0 16%), radial-gradient(circle at 38% 66%, rgba(105,170,255,0.08), transparent 0 20%), linear-gradient(180deg, #05050a 0%, #010102 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_58%,transparent_32%,rgba(0,0,0,0.64)_100%)]" />
      <div className="absolute inset-[12%] rounded-[40%] bg-[radial-gradient(circle_at_30%_20%,rgba(255,244,138,0.9),transparent_0_22%),radial-gradient(circle_at_70%_30%,rgba(121,255,227,0.5),transparent_0_24%),radial-gradient(circle_at_65%_70%,rgba(255,143,240,0.4),transparent_0_20%),radial-gradient(circle_at_50%_50%,rgba(18,19,28,0.9),rgba(8,8,14,0.2)_72%,transparent_100%)] blur-[18px]" />
      <div className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.22em] text-white/45">
        scene 01 poster
      </div>
    </div>
  );
}
