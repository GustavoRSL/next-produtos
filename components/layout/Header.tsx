"use client";

import { Button } from "@heroui/react";
import {
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button isIconOnly variant="ghost">
              <BellIcon className="w-5 h-5 text-gray-600" />
            </Button>
            <Button isIconOnly variant="ghost">
              <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </div>
            <Button isIconOnly variant="ghost" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
