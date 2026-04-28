import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CloudSun, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Sifreler eslesmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Sifre en az 6 karakter olmali.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kayit yapilamadi.";
      setError(translateAuthError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <img
        src="/backgrounds/clear.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/75 to-slate-950/95" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl border border-border/70 bg-card/80 p-2">
            <CloudSun className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modern Weather App</h1>
            <p className="text-sm text-muted-foreground">Hesap olustur, hemen baslayalim</p>
          </div>
        </div>

        <Card className="border-border/60 bg-card/85 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Kayit Ol</CardTitle>
            <CardDescription>Email ve sifre ile yeni bir hesap olustur</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200">
                <p className="font-medium">Kayit basarili!</p>
                <p>
                  <strong>{email}</strong> adresine bir dogrulama maili gonderdik. Linke tikla, sonra giris yapabilirsin.
                </p>
                <p className="text-xs text-emerald-300/70">4 saniye icinde giris sayfasina yonlendirilirsin...</p>
              </div>
            ) : (
            <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Sifre
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="passwordConfirm" className="text-sm font-medium text-foreground">
                  Sifre (tekrar)
                </label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="********"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={loading} className="mt-2 gap-2">
                <UserPlus className="h-4 w-4" />
                {loading ? "Kayit yapiliyor..." : "Kayit Ol"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Zaten hesabin var mi?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Giris yap
              </Link>
            </p>
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function translateAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("user already registered")) return "Bu email ile zaten kayit yapilmis.";
  if (lower.includes("password should be at least")) return "Sifre en az 6 karakter olmali.";
  if (lower.includes("invalid email")) return "Gecersiz email adresi.";
  return message;
}
