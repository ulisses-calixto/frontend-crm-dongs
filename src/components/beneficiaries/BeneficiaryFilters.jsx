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
      <div className="relative w-full sm:w-[260px]">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar beneficiado..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Filter className="w-5 h-5 text-blue-600" />
          <span>Filtrar:</span>
        </div>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px] rounded-xl">
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
          <SelectTrigger className="w-[200px] rounded-xl">
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
          className="flex items-center gap-2 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
          Redefinir
        </Button>
      </div>  
    </div>
  );
}
