"use client";

import { Button } from "@heroui/react";
import {
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth";
import { ThemeSwitch } from "@/components/theme-switch";

interface HeaderProps {
  title: string;
  onToggleSidebar?: () => void;
}

export function Header({ title, onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {onToggleSidebar && (
              <Button
                isIconOnly
                className="lg:hidden mr-2"
                variant="ghost"
                onClick={onToggleSidebar}
              >
                <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeSwitch />
            <Button isIconOnly className="hidden sm:flex" variant="ghost">
              <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button isIconOnly className="hidden md:flex" variant="ghost">
              <Cog6ToothIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px] md:max-w-none">
                {user?.name}
              </span>
            </div>
            <Button isIconOnly variant="ghost" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
