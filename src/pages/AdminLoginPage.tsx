import { useState } from "react";
import { Leaf, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { btnPrimary } from "../lib/variants/button";
import { formInput } from "../lib/variants/input";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, authError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-[380px] rounded-xl border border-gray-100 bg-white p-10 px-8 shadow-lg">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-green-700">
            <Leaf className="size-6 text-white" aria-hidden />
          </div>
          <span className="font-display text-base font-semibold text-green-800">
            Circuito Terê Verde
          </span>
        </div>

        <h1 className="mb-1.5 text-center text-[1.375rem] text-gray-900">Bem-vindo de volta</h1>
        <p className="mb-8 text-center text-sm text-gray-500">Acesso restrito a administradores</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[0.8125rem] font-medium text-gray-500">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tereverde.com.br"
              className={formInput()}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[0.8125rem] font-medium text-gray-500">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={formInput()}
            />
          </div>

          {authError && (
            <p
              className="rounded-md bg-red-100 px-3.5 py-2.5 text-center text-[0.8125rem] text-red-800"
              role="alert"
            >
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`${btnPrimary()} mt-2 w-full rounded-lg disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isLoading ? "Verificando..." : "Entrar no painel"}
          </button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Ambiente seguro — dados criptografados
        </p>
      </div>
    </div>
  );
}
