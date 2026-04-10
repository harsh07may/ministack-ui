import Image from "next/image";
import Link from "next/link";

interface Props {
  service: string;
  label: string;
  noun: string;
  iconPath: string;
}

export default function ServiceCard({ service, label, noun, iconPath }: Props) {
  return (
    <Link
      href={`/resources/${service}`}
      className="group flex items-center gap-3 p-4 rounded-lg bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all duration-150"
    >
      <Image
        src={iconPath}
        alt=""
        width={32}
        height={32}
        unoptimized
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm text-zinc-100 truncate">{label}</p>
        <p className="text-xs text-zinc-500">{noun}</p>
      </div>
      <svg
        className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 shrink-0 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
