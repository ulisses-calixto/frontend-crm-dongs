import React, { useState, useEffect } from "react";
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

import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateMonetaryValue,
  validateQuantity,
  validateDate,
} from "@/utils/validation";
import { currencyMask, decimalMask, unmaskCurrency, unmask } from "@/utils/masks";
import { getCurrentLocalDate, normalizeDateForInput } from "@/utils/dateUtils";
import { toast } from "sonner";

const donationTypes = [
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
  { value: "received", label: "Recebida" },
  { value: "pending", label: "Pendente" },
  { value: "partially_distributed", label: "Parcialmente Distribuída" },
  { value: "fully_distributed", label: "Totalmente Distribuída" },
];

const getInitialFormData = () => ({
  donor_name: "",
  donor_email: "",
  donor_phone: "",
  donation_type: "food",
  value: "",
  description: "",
  quantity: 1,
  remaining_quantity: 1,
  unit: "",
  donation_date: getCurrentLocalDate(),
  status: "received",
  notes: "",
  receipt_number: "",
});

export default function DonationForm({ donation, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (donation) {
      const validDate = donation.donation_date
        ? new Date(donation.donation_date)
        : new Date();

      setFormData({
        donor_name: donation.donor_name || "",
        donor_email: donation.donor_email || "",
        donor_phone: donation.donor_phone || "",
        donation_type: donation.donation_type || "food",
        value: donation.value ? donation.value.toString() : "",
        description: donation.description || "",
        quantity: donation.quantity || 1,
        remaining_quantity:
          donation.remaining_quantity ?? donation.quantity ?? 1,
        unit: donation.unit || "",
        donation_date: isNaN(validDate)
          ? getCurrentLocalDate()
          : normalizeDateForInput(donation.donation_date),
        status: donation.status || "received",
        notes: donation.notes || "",
        receipt_number: donation.receipt_number || "",
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [donation]);

  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Aplicar máscaras
    if (field === "value" && formData.donation_type === "monetary") {
      processedValue = currencyMask(value);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = value === "" ? "" : parseInt(value, 10);

    if (!isNaN(newQuantity) || value === "") {
      const isEditing = !!donation;
      const isDistributed =
        isEditing &&
        (donation.status === "partially_distributed" ||
          donation.status === "fully_distributed");

      setFormData((prev) => ({
        ...prev,
        quantity: newQuantity,
        ...(isDistributed ? {} : { remaining_quantity: newQuantity }),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nome do doador - obrigatório
    if (!validateRequired(formData.donor_name)) {
      newErrors.donor_name = "Nome do doador é obrigatório";
    } else if (!validateMinLength(formData.donor_name, 2)) {
      newErrors.donor_name = "Nome deve ter pelo menos 2 caracteres";
    } else if (!validateMaxLength(formData.donor_name, 100)) {
      newErrors.donor_name = "Nome deve ter no máximo 100 caracteres";
    }

    // Email - opcional mas deve ser válido se preenchido
    if (formData.donor_email && !validateEmail(formData.donor_email)) {
      newErrors.donor_email = "Email inválido";
    }

    // Tipo de doação - obrigatório
    if (!formData.donation_type) {
      newErrors.donation_type = "Tipo de doação é obrigatório";
    }

    // Valor - obrigatório para doações monetárias
    if (formData.donation_type === "monetary") {
      const numericValue = unmaskCurrency(formData.value);
      if (!validateMonetaryValue(numericValue)) {
        newErrors.value = "Valor deve ser entre R$ 0 e R$ 10 milhões";
      }
    }

    // Descrição - obrigatória
    if (!validateRequired(formData.description)) {
      newErrors.description = "Descrição é obrigatória";
    } else if (!validateMinLength(formData.description, 5)) {
      newErrors.description = "Descrição deve ter pelo menos 5 caracteres";
    } else if (!validateMaxLength(formData.description, 500)) {
      newErrors.description = "Descrição deve ter no máximo 500 caracteres";
    }

    // Quantidade - obrigatória para doações não monetárias
    if (formData.donation_type !== "monetary") {
      if (!validateQuantity(formData.quantity)) {
        newErrors.quantity = "Quantidade deve ser entre 1 e 1.000.000";
      }
    }

    // Unidade - obrigatória para doações não monetárias
    if (formData.donation_type !== "monetary" && !validateRequired(formData.unit)) {
      newErrors.unit = "Unidade é obrigatória";
    }

    // Data da doação - obrigatória e não futura
    if (!formData.donation_date) {
      newErrors.donation_date = "Data da doação é obrigatória";
    } else if (!validateDate(formData.donation_date, false)) {
      newErrors.donation_date = "Data não pode ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Corrija os erros no formulário antes de salvar");
      return;
    }

    setIsSubmitting(true);

    try {
      let cleanedData = {
        ...formData,
        value:
          formData.donation_type === "monetary" && formData.value
            ? unmaskCurrency(formData.value)
            : undefined,
        quantity:
          formData.donation_type !== "monetary" && formData.quantity
            ? parseInt(formData.quantity, 10)
            : 1,
        remaining_quantity:
          formData.donation_type !== "monetary" && formData.remaining_quantity
            ? parseInt(formData.remaining_quantity, 10)
            : 1,
      };

      // 🔒 Corrigir quantidade zero
      if (formData.donation_type !== "monetary" && (!cleanedData.quantity || cleanedData.quantity < 1)) {
        cleanedData.quantity = 1;
      }

      // 🔒 Corrigir remaining_quantity
      if (formData.donation_type !== "monetary" && cleanedData.remaining_quantity > cleanedData.quantity) {
        cleanedData.remaining_quantity = cleanedData.quantity;
      }

      // 🔒 Doação monetária → não tem quantidade
      if (cleanedData.donation_type === "monetary") {
        cleanedData.quantity = 1;
        cleanedData.remaining_quantity = 1;
        cleanedData.unit = "";
      }

      // 🔒 Doação não monetária → limpar valor
      if (cleanedData.donation_type !== "monetary") {
        cleanedData.value = null;
      }

      onSubmit(cleanedData);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast.error("Erro ao processar formulário. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in-0">
      <Card className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-y-auto animate-in zoom-in-95">
        <CardHeader className="sticky top-0 z-10 mt-0 flex flex-row items-center justify-between bg-gradient-to-r from-emerald-600 to-sky-700 text-white rounded-t-2xl px-6 py-4">
          <CardTitle className="text-2xl font-bold">
            {donation ? "Editar Doação" : "Nova Doação"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            title="Fechar janela"
            aria-label="Fechar"
            className="text-white hover:text-white/80 hover:bg-white/40"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* DADOS DO DOADOR */}
            <section>
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Dados do Doador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="donor_name">Nome do Doador *</Label>
                  <Input
                    id="donor_name"
                    name="donor_name"
                    autoComplete="name"
                    value={formData.donor_name}
                    onChange={(e) =>
                      handleInputChange("donor_name", e.target.value)
                    }
                    placeholder="Nome completo"
                    required
                    className={errors.donor_name ? "border-red-500" : "rounded-xl"}
                  />
                  {errors.donor_name && (
                    <p className="text-sm text-red-600">{errors.donor_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor_email">Email</Label>
                  <Input
                    id="donor_email"
                    name="donor_email"
                    autoComplete="email"
                    type="email"
                    value={formData.donor_email}
                    onChange={(e) =>
                      handleInputChange("donor_email", e.target.value)
                    }
                    placeholder="email@exemplo.com"
                    className={errors.donor_email ? "border-red-500" : "rounded-xl"}
                  />
                  {errors.donor_email && (
                    <p className="text-sm text-red-600">{errors.donor_email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor_phone">Telefone</Label>
                  <Input
                    id="donor_phone"
                    name="donor_phone"
                    autoComplete="tel"
                    value={formData.donor_phone}
                    onChange={(e) =>
                      handleInputChange("donor_phone", e.target.value)
                    }
                    placeholder="(88) 99999-9999"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* DADOS DA DOAÇÃO */}
            <section>
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Dados da Doação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="donation_type">Tipo de Doação *</Label>
                  <Select
                    value={formData.donation_type}
                    onValueChange={(value) =>
                      handleInputChange("donation_type", value)
                    }
                  >
                    <SelectTrigger id="donation_type" className={errors.donation_type ? "border-red-500" : "rounded-xl"}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {donationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.donation_type && (
                    <p className="text-sm text-red-600">{errors.donation_type}</p>
                  )}
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <Label htmlFor="donation_date">Data *</Label>
                  <Input
                    id="donation_date"
                    name="donation_date"
                    autoComplete="transaction-date"
                    type="date"
                    value={formData.donation_date}
                    onChange={(e) =>
                      handleInputChange("donation_date", e.target.value)
                    }
                    required
                    className={errors.donation_date ? "border-red-500" : "rounded-xl"}
                  />
                  {errors.donation_date && (
                    <p className="text-sm text-red-600">{errors.donation_date}</p>
                  )}
                </div>

                {/* Valor / Quantidade */}
                {formData.donation_type === "monetary" ? (
                  <div className="space-y-2">
                    <Label htmlFor="value">Valor (R$)</Label>
                    <Input
                      id="value"
                      name="value"
                      autoComplete="off"
                      value={formData.value}
                      onChange={(e) =>
                        handleInputChange("value", e.target.value)
                      }
                      placeholder="0,00"
                      className={errors.value ? "border-red-500" : "rounded-xl"}
                    />
                    {errors.value && (
                      <p className="text-sm text-red-600">{errors.value}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantidade Total</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        autoComplete="off"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          handleQuantityChange(e.target.value)
                        }
                        placeholder="1"
                        className={errors.quantity ? "border-red-500" : "rounded-xl"}
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-600">{errors.quantity}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unidade</Label>
                      <Input
                        id="unit"
                        name="unit"
                        autoComplete="off"
                        value={formData.unit}
                        onChange={(e) =>
                          handleInputChange("unit", e.target.value)
                        }
                        placeholder="kg, unidades, litros..."
                        className={errors.unit ? "border-red-500" : "rounded-xl"}
                      />
                      {errors.unit && (
                        <p className="text-sm text-red-600">{errors.unit}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger id="status" className="rounded-xl">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  autoComplete="off"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Descreva a doação (ex: Cesta básica, 10kg de arroz, etc.)"
                  required
                  className={errors.description ? "border-red-500" : "rounded-xl"}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Recibo / Observações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="receipt_number">Número do Recibo</Label>
                  <Input
                    id="receipt_number"
                    name="receipt_number"
                    autoComplete="off"
                    className="rounded-xl"
                    value={formData.receipt_number}
                    onChange={(e) =>
                      handleInputChange("receipt_number", e.target.value)
                    }
                    placeholder="REC-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    name="notes"
                    autoComplete="off"
                    className="rounded-xl"
                    value={formData.notes}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value)
                    }
                    placeholder="Observações adicionais"
                  />
                </div>
              </div>
            </section>
          </CardContent>

          <CardFooter className="p-6 bottom-0 bg-white z-10">
            <div className="flex justify-end gap-3 w-full">
              <Button className="rounded-xl" type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-900 rounded-xl"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Salvando..." : "Salvar Doação"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
