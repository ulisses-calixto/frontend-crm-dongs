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
import { Filter, Search, RotateCcw } from "lucide-react";

const priorityOptions = [
  { value: "all", label: "Todas as prioridades" },
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "completed", label: "Concluído" },
];

export default function BeneficiaryFilters({
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange,
}) {
  const handleFilterChange = (key, value) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    onFiltersChange({
      status: "all",
      priority: "all",
    });
    onSearchChange("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between flex-wrap">
      {/*Campo de busca */}
      <div className="relative w-full sm:w-[320px]">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar beneficiado..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rounded-md bg-white"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <span>Filtrar:</span>
        </div>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[150px] rounded-md bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Prioridade */}
        <Select
          value={filters.priority}
          onValueChange={(value) => handleFilterChange("priority", value)}
        >
          <SelectTrigger className="w-[180px] rounded-md bg-white">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botão de reset */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-md bg-white"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>  
    </div>
  );
}
