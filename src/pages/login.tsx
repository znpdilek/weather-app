import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CloudSun, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Giris yapilamadi.";
      setError(translateAuthError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <img
        src="/backgrounds/clouds.jpg"
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
            <p className="text-sm text-muted-foreground">Giris yap, hava durumunu gor</p>
          </div>
        </div>

        <Card className="border-border/60 bg-card/85 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Giris Yap</CardTitle>
            <CardDescription>Email ve sifren ile devam et</CardDescription>
          </CardHeader>
          <CardContent>
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
                  placeholder="********"
                  autoComplete="current-password"
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
                <LogIn className="h-4 w-4" />
                {loading ? "Giris yapiliyor..." : "Giris Yap"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Hesabin yok mu?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Kayit ol
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function translateAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Email veya sifre hatali.";
  if (lower.includes("email not confirmed")) return "Email adresini henuz dogrulamadin.";
  if (lower.includes("user already registered")) return "Bu email ile zaten kayit yapilmis.";
  if (lower.includes("password should be at least")) return "Sifre en az 6 karakter olmali.";
  return message;
}
