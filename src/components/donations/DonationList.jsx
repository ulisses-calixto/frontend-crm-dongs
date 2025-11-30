
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Gift, Calendar, User, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateForDisplay } from "@/utils/dateUtils";

const donationTypeLabels = {
  monetary: "Monetária",
  food: "Alimentos",
  clothing: "Roupas",
  toys: "Brinquedos",
  books: "Livros",
  electronics: "Eletrônicos",
  medicine: "Medicamentos",
  other: "Outros"
};

const statusLabels = {
  received: "Recebida",
  partially_distributed: "Parcialmente Distribuída",
  fully_distributed: "Totalmente Distribuída",
  pending: "Pendente"
};

const statusColors = {
  received: "bg-blue-100 text-blue-700",
  partially_distributed: "bg-orange-100 text-orange-700",
  fully_distributed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700"
};

const typeColors = {
  monetary: "bg-green-100 text-green-700",
  food: "bg-orange-100 text-orange-700",
  clothing: "bg-blue-100 text-blue-700",
  toys: "bg-pink-100 text-pink-700",
  books: "bg-purple-100 text-purple-700",
  electronics: "bg-gray-100 text-gray-700",
  medicine: "bg-red-100 text-red-700",
  other: "bg-yellow-100 text-yellow-700"
};

const formatSafeDate = (dateString) => {
  return formatDateForDisplay(dateString);
};

export default function DonationList({ donations, loading, onEdit, onDelete, onDistribute }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <Card className="border-1 bg-white">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma doação encontrada
          </h3>
          <p className="text-gray-600">
            Registre sua primeira doação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <Card key={donation.id} className="border rounded-md bg-white">
          <CardContent>
            <div className="flex justify-between items-start flex-wrap">
              <div className="flex-1 space-y-3 min-w-[250px]">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {donation.donor_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {formatSafeDate(donation.donation_date)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700">{donation.description}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={typeColors[donation.donation_type] || typeColors.other}>
                    {donationTypeLabels[donation.donation_type] || donation.donation_type}
                  </Badge>
                  <Badge className={statusColors[donation.status] || statusColors.received}>
                    {statusLabels[donation.status] || donation.status}
                  </Badge>
                  {donation.value > 0 && (
                    <Badge variant="outline" className="font-bold rounded-md">
                      R$ {donation.value.toFixed(2)}
                    </Badge>
                  )}
                  {donation.quantity > 0 && donation.donation_type !== 'monetary' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Badge variant="outline" className="cursor-default">
                            {donation.remaining_quantity} / {donation.quantity} {donation.unit}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Restante / Total</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-2 ml-0 mt-4">
                <Button
                  size="sm"
                  onClick={() => onDistribute(donation)}
                  disabled={donation.remaining_quantity === 0 || donation.donation_type === 'monetary'}
                  className="cursor-pointer text-white bg-green-700 hover:bg-green-900 rounded-md"
                  title="Distribuir doação."
                >
                  <Truck className="w-4 h-4" />
                  Distribuir
                </Button>

                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(donation)}
                    className="cursor-pointer rounded-md hover:bg-orange-100 hover:text-orange-700"
                    title="Editar doação."
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(donation)}
                    className="cursor-pointer rounded-md hover:bg-red-100 hover:text-red-700"
                    title="Deletar doação."
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
