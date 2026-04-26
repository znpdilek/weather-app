import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  onSearch: (city: string) => Promise<void> | void;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [city, setCity] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = city.trim();
    if (!value) return;
    await onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <Input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Sehir ara (ornek: Istanbul)"
        aria-label="Sehir arama"
        className="h-11"
      />
      <Button type="submit" className="h-11 gap-2" disabled={loading}>
        <Search className="h-4 w-4" />
        {loading ? "Araniyor..." : "Ara"}
      </Button>
    </form>
  );
}