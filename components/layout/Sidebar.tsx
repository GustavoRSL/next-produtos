"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBarIcon, CubeIcon } from "@heroicons/react/24/outline";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ChartBarIcon,
  },
  {
    name: "Produtos",
    href: "/produtos",
    icon: CubeIcon,
  },
];

export function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 z-50 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">PS</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            ProdStock
          </span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                href={item.href}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <span className={isActive ? "font-medium" : ""}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
