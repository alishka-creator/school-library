/* eslint-disable @next/next/no-img-element */
export function Avatar({ seed, size = 36 }: { seed: string; size?: number }) {
  const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e6f0ed`;
  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className="rounded-full border border-border bg-slate-light"
      style={{ width: size, height: size }}
    />
  );
}
