import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, Calendar, MapPin, Phone } from "lucide-react";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800"
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  completed: "bg-purple-100 text-purple-800"
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média", 
  high: "Alta"
};

const statusLabels = {
  active: "Ativo",
  inactive: "Inativo",
  completed: "Concluído"
};

const formatSafeDate = (dateString) => {
  return formatDateForDisplay(dateString);
};

export default function BeneficiaryList({ beneficiaries, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (beneficiaries.length === 0) {
    return (
      <Card className="border-1 bg-white/80">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum beneficiado encontrado
          </h3>
          <p className="text-gray-600">
            Comece registrando o primeiro beneficiado da sua organização.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {beneficiaries.map((beneficiary) => (
        <Card key={beneficiary.id} className="border rounded-2xl bg-white/80 hover:shadow-md transition-all duration-300 flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {beneficiary.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Família de {beneficiary.family_size} {beneficiary.family_size > 1 ? 'pessoas' : 'pessoa'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{beneficiary.address}</span>
                  </div>
                  
                  {beneficiary.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{beneficiary.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(beneficiary)} className="rounded-xl hover:bg-orange-100 hover:text-orange-600"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(beneficiary)} className="rounded-xl hover:bg-red-100 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* 👉 NOVO BLOCO ADICIONADO: Data formatada */}
            {beneficiary.registration_date && (
              <div className="flex items-center gap-2 mt-4 mb-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Registrado em: {formatSafeDate(beneficiary.registration_date)}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t">
              <Badge className={priorityColors[beneficiary.priority_level] || priorityColors.medium}>
                {priorityLabels[beneficiary.priority_level] || beneficiary.priority_level} prioridade
              </Badge>
              <Badge className={statusColors[beneficiary.status] || statusColors.active}>
                {statusLabels[beneficiary.status] || beneficiary.status}
              </Badge>
              {beneficiary.monthly_income != null && (
                <Badge variant="outline" className="font-medium">
                  R$ {beneficiary.monthly_income.toFixed(2)}/mês
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
