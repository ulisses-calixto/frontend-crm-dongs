import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, Search } from "lucide-react";

const donationTypes = [
  { value: "all", label: "Todos os tipos" },
  { value: "monetary", label: "Monetária" },
  { value: "food", label: "Alimentos" },
  { value: "clothing", label: "Roupas" },
  { value: "toys", label: "Brinquedos" },
  { value: "books", label: "Livros" },
  { value: "electronics", label: "Eletrônicos" },
  { value: "medicine", label: "Medicamentos" },
  { value: "other", label: "Outros" },
];

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "received", label: "Recebida" },
  { value: "partially_distributed", label: "Parcialmente Distribuída" },
  { value: "fully_distributed", label: "Totalmente Distribuída" },
  { value: "pending", label: "Pendente" },
];

export default function DonationFilters({
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
}) {
  const handleFilterChange = (key, value) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    onFiltersChange({
      type: "all",
      status: "all",
    });
    onSearchChange("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between flex-wrap">
      {/* Campo de pesquisa */}
      <div className="relative w-full sm:w-[260px]">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar doador..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Filter className="w-5 h-5 text-green-600" />
          <span>Filtrar:</span>
        </div>

        {/* Tipo */}
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Tipo de doação" />
          </SelectTrigger>
          <SelectContent>
            {donationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[200px] rounded-xl">
            <SelectValue placeholder="Status da doação" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
          Redefinir
        </Button>
      </div>
    </div>
  );
}
