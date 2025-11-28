import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

import {
  validateQuantity,
  validateDate,
  validateRequired,
} from "@/utils/validation";
import { getCurrentLocalDate } from "@/utils/dateUtils";

export default function DistributionForm({
  donation,
  beneficiaries,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    donation_id: donation.id,
    beneficiary_id: "",
    quantity: 1,
    distribution_date: getCurrentLocalDate(),
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleQuantityChange = (value) => {
    const q = parseInt(value, 10);
    if (isNaN(q) || q <= 0) {
      handleInputChange("quantity", 1);
    } else if (q > donation.remaining_quantity) {
      toast.warning(
        `A quantidade máxima disponível é ${donation.remaining_quantity}.`
      );
      handleInputChange("quantity", donation.remaining_quantity);
    } else {
      handleInputChange("quantity", q);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.beneficiary_id)) {
      newErrors.beneficiary_id = "Selecione um beneficiado";
    }

    if (!validateQuantity(formData.quantity)) {
      newErrors.quantity = "Quantidade deve ser entre 1 e 1.000.000";
    } else if (formData.quantity > donation.remaining_quantity) {
      newErrors.quantity = `Quantidade não pode exceder ${donation.remaining_quantity} disponível`;
    }

    if (!formData.distribution_date) {
      newErrors.distribution_date = "Data da distribuição é obrigatória";
    } else if (!validateDate(formData.distribution_date, false)) {
      newErrors.distribution_date = "Data não pode ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error("Corrija os erros no formulário antes de salvar");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedData = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
      };

      await onSubmit(cleanedData);
      toast.success("Distribuição registrada com sucesso!");
    } catch (err) {
      toast.error("Erro ao registrar distribuição.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in-0">
      <Card className="w-full max-w-lg rounded-md bg-white animate-in zoom-in-95">
        {/* HEADER */}
        <CardHeader className="mt-0 flex flex-row items-center justify-between bg-white px-6 pb-2">
          <CardTitle className="text-xl font-bold">
            Distribuir Doação
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            title="Fechar janela"
            aria-label="Fechar"
            className="text-gray-700 hover:text-red-600 hover:bg-red-100"
          >
            <X className="w-10 h-5" />
          </Button>
        </CardHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-md bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-700">
                {donation.description}
              </h4>
              <p className="text-sm text-emerald-700">
                Disponível:{" "}
                <span className="font-bold">
                  {donation.remaining_quantity} {donation.unit}
                </span>
              </p>
            </div>

            {/* BENEFICIADO */}
            <div className="space-y-2">
              <Label htmlFor="beneficiary_id">Beneficiado *</Label>
              <Select
                value={formData.beneficiary_id}
                onValueChange={(value) =>
                  handleInputChange("beneficiary_id", value)
                }
              >
                <SelectTrigger
                  id="beneficiary_id"
                  className={`rounded-md ${
                    errors.beneficiary_id ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecione um beneficiado" />
                </SelectTrigger>

                <SelectContent>
                  {beneficiaries.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.beneficiary_id && (
                <p className="text-sm text-red-600">{errors.beneficiary_id}</p>
              )}
            </div>

            {/* Quantity + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  autoComplete="off"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className={`rounded-md ${
                    errors.quantity ? "border-red-500" : ""
                  }`}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="distribution_date">Data *</Label>
                <Input
                  id="distribution_date"
                  type="date"
                  autoComplete="off"
                  value={formData.distribution_date}
                  onChange={(e) =>
                    handleInputChange("distribution_date", e.target.value)
                  }
                  className={`rounded-md ${
                    errors.distribution_date ? "border-red-500" : ""
                  }`}
                />
                {errors.distribution_date && (
                  <p className="text-sm text-red-600">
                    {errors.distribution_date}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                autoComplete="off"
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Alguma observação?"
                className="rounded-md"
              />
            </div>
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="mt-6">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-full"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-green-700 hover:bg-green-800 text-white"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Distribuindo..." : "Distribuir"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
