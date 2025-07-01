"use client";

import type { RegisterFormData, LoginFormData } from "@/lib/validations/auth";

import { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Link,
  Tabs,
  Tab,
  Divider,
} from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, loginSchema } from "@/lib/validations/auth";

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = (data: LoginFormData) => {
    console.log("Login data:", data);
    // TODO: Implementar lógica de login
  };

  const onSignupSubmit = (data: RegisterFormData) => {
    console.log("Signup data:", data);
    // TODO: Implementar lógica de registro
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative z-10">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-8">
            <span className="text-white font-bold text-xl">P</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Gerencie seus Produtos
            <br />
            de Qualquer Lugar
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Veja todas as análises e faça crescer seu negócio de qualquer lugar!
          </p>
        </div>

        <div className="relative z-10 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <div className="w-2 h-2 bg-slate-600 rounded-full" />
          <div className="w-2 h-2 bg-slate-600 rounded-full" />
          <div className="w-2 h-2 bg-slate-600 rounded-full" />
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardBody className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {isLoginMode ? "Entrar na sua conta" : "Criar uma conta"}
              </h2>
            </div>

            <Tabs
              className="mb-6"
              classNames={{
                tabList: "grid w-full grid-cols-2 bg-default-100 p-1 rounded-lg",
                cursor: "w-full bg-primary rounded-md",
                tab: "w-full h-12 rounded-md",
                tabContent: "group-data-[selected=true]:text-white w-full text-center",
              }}
              selectedKey={isLoginMode ? "login" : "signup"}
              onSelectionChange={(key) => setIsLoginMode(key === "login")}
            >
              <Tab key="login" title="Entrar" />
              <Tab key="signup" title="Registrar" />
            </Tabs>

            {isLoginMode ? (
              <form
                className="space-y-4"
                onSubmit={handleSubmitLogin(onLoginSubmit)}
              >
                <Input
                  {...registerLogin("email")}
                  errorMessage={loginErrors.email?.message}
                  isInvalid={!!loginErrors.email}
                  label="Email"
                  type="email"
                  variant="bordered"
                />

                <Input
                  {...registerLogin("password")}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <EyeSlashIcon className="w-5 h-5 text-default-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-default-400" />
                      )}
                    </button>
                  }
                  errorMessage={loginErrors.password?.message}
                  isInvalid={!!loginErrors.password}
                  label="Senha"
                  type={isPasswordVisible ? "text" : "password"}
                  variant="bordered"
                />

                <Button
                  className="w-full mt-6"
                  color="primary"
                  size="lg"
                  type="submit"
                >
                  Entrar
                </Button>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={handleSubmitSignup(onSignupSubmit)}
              >
                <Input
                  {...registerSignup("name")}
                  errorMessage={signupErrors.name?.message}
                  isInvalid={!!signupErrors.name}
                  label="Nome completo"
                  variant="bordered"
                />

                <Input
                  {...registerSignup("email")}
                  errorMessage={signupErrors.email?.message}
                  isInvalid={!!signupErrors.email}
                  label="Email empresarial"
                  type="email"
                  variant="bordered"
                />

                <div className="grid grid-cols-3 gap-2">
                  <Input
                    {...registerSignup("phone.country")}
                    defaultValue="BR"
                    label="País"
                    placeholder="+55"
                    variant="bordered"
                  />
                  <Input
                    {...registerSignup("phone.ddd")}
                    errorMessage={signupErrors.phone?.ddd?.message}
                    isInvalid={!!signupErrors.phone?.ddd}
                    label="DDD"
                    maxLength={3}
                    placeholder="11"
                    variant="bordered"
                  />
                  <Input
                    {...registerSignup("phone.number")}
                    errorMessage={signupErrors.phone?.number?.message}
                    isInvalid={!!signupErrors.phone?.number}
                    label="Telefone"
                    maxLength={9}
                    placeholder="999999999"
                    variant="bordered"
                  />
                </div>

                <Input
                  {...registerSignup("password")}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <EyeSlashIcon className="w-5 h-5 text-default-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-default-400" />
                      )}
                    </button>
                  }
                  errorMessage={signupErrors.password?.message}
                  isInvalid={!!signupErrors.password}
                  label="Senha"
                  type={isPasswordVisible ? "text" : "password"}
                  variant="bordered"
                />

                <Input
                  {...registerSignup("verifyPassword")}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeSlashIcon className="w-5 h-5 text-default-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-default-400" />
                      )}
                    </button>
                  }
                  errorMessage={signupErrors.verifyPassword?.message}
                  isInvalid={!!signupErrors.verifyPassword}
                  label="Confirmar senha"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  variant="bordered"
                />

                <div className="flex items-center gap-2 text-sm text-default-500">
                  <input className="rounded" type="checkbox" />
                  <span>
                    Aceito a{" "}
                    <Link href="#" size="sm">
                      Política de Privacidade
                    </Link>
                  </span>
                </div>

                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  color="primary"
                  size="lg"
                  type="submit"
                >
                  Criar uma Conta
                </Button>
              </form>
            )}

            <Divider className="my-6" />

            <div className="text-center">
              <span className="text-sm text-default-500">
                {isLoginMode ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <Link
                  href="#"
                  size="sm"
                  onPress={() => setIsLoginMode(!isLoginMode)}
                >
                  {isLoginMode ? "Registre-se" : "Entrar"}
                </Link>
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
