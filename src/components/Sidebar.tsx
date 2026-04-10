"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", exact: true, iconPath: null },
  {
    href: "/resources/s3",
    label: "S3",
    exact: false,
    iconPath: "/icons/aws/s3.svg",
  },
  {
    href: "/resources/dynamodb",
    label: "DynamoDB",
    exact: false,
    iconPath: "/icons/aws/dynamodb.svg",
  },
  {
    href: "/resources/lambda",
    label: "Lambda",
    exact: false,
    iconPath: "/icons/aws/lambda.svg",
  },
  {
    href: "/resources/sqs",
    label: "SQS",
    exact: false,
    iconPath: "/icons/aws/simple-queue-service.svg",
  },
  {
    href: "/resources/sns",
    label: "SNS",
    exact: false,
    iconPath: "/icons/aws/simple-notification-service.svg",
  },
  {
    href: "/resources/secretsmanager",
    label: "Secrets Mgr",
    exact: false,
    iconPath: "/icons/aws/secrets-manager.svg",
  },
] as const;

function GridIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string, exact: boolean): boolean {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className={`${collapsed ? "w-14" : "w-52"} shrink-0 flex flex-col bg-zinc-950 border-r border-zinc-800/60 h-screen overflow-y-auto overflow-x-hidden transition-[width] duration-200`}
    >
      {/* Logo + Toggle */}
      <div
        className={`flex items-center border-b border-zinc-800/60 h-16 ${
          collapsed ? "justify-center px-2" : "px-4 justify-between"
        }`}
      >
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-widest text-zinc-100 uppercase truncate">
              MiniStack ⚡
            </p>
            <p className="text-[10px] tracking-wider text-zinc-500 uppercase mt-0.5 truncate">
              Local AWS Instance
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      {/* Nav */}
      <nav
        className={`flex-1 ${collapsed ? "px-1.5" : "px-3"} py-4 space-y-0.5`}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center py-2 rounded text-sm transition-colors ${
                collapsed ? "justify-center px-2" : "gap-2.5 px-3"
              } ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {item.iconPath ? (
                <Image
                  src={item.iconPath}
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                  className="shrink-0 opacity-80"
                />
              ) : (
                <GridIcon />
              )}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* TODO: Settings */}
    </aside>
  );
}
