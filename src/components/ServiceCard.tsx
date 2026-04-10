import Link from "next/link";

interface Props {
  service: string;
  label: string;
  noun: string;
  icon: string;
}

export default function ServiceCard({ service, label, noun, icon }: Props) {
  return (
    <Link
      href={`/resources/${service}`}
      className="flex flex-col gap-2 p-5 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <span className="font-semibold text-zinc-100">{label}</span>
      <span className="text-xs text-zinc-500">{noun}</span>
    </Link>
  );
}
