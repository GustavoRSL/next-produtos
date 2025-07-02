"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { HomeIcon } from "@heroicons/react/24/outline";

import { useAuthStore } from "@/lib/stores/auth";

export default function NotFoundPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  // Redirecionamento automático após 5 segundos
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

      return () => clearTimeout(timer);
    } else {
      // Redirecionar para a página apropriada com base na autenticação
      const redirectPath = isAuthenticated ? "/dashboard" : "/auth";

      router.push(redirectPath);
    }
  }, [countdown, router, isAuthenticated]);

  // Caminho para redirecionar baseado no estado de autenticação
  const redirectPath = isAuthenticated ? "/dashboard" : "/auth";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Página não encontrada
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Redirecionando para {isAuthenticated ? "Dashboard" : "Login"} em{" "}
          {countdown} segundos...
        </p>

        <Link legacyBehavior passHref href={redirectPath}>
          <Button
            as="a"
            className="w-full"
            color="primary"
            size="lg"
            startContent={<HomeIcon className="w-5 h-5" />}
          >
            Voltar para {isAuthenticated ? "Dashboard" : "Login"}
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Next CRUD Produtos
        </p>
      </div>
    </div>
  );
}
