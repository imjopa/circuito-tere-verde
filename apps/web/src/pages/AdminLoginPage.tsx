import { Leaf, Lock } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, authError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const success = await login(email, password);
      if (success) return navigate("/admin/dashboard");
    },
    [login, navigate, email, password],
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [setEmail],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [setPassword],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-10 px-8 shadow-lg">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-green-700">
            <Leaf className="size-6 text-white" aria-hidden />
          </div>
          <span className="font-display text-base font-semibold text-green-800">
            Circuito Terê Verde
          </span>
        </div>

        <h1 className="mb-1.5 text-center text-xl text-gray-900">Bem-vindo de volta</h1>
        <p className="mb-8 text-center text-sm text-gray-500">Acesso restrito a administradores</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-500">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="admin@tereverde.com.br"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-500">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
          </div>

          {authError && (
            <p
              className="rounded-md bg-red-100 px-3.5 py-2.5 text-center text-sm text-red-800"
              role="alert"
            >
              {authError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verificando..." : "Entrar no painel"}
          </Button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Ambiente seguro — dados criptografados
        </p>
      </div>
    </div>
  );
}
