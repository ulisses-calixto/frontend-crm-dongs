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
  validateCPF,
  validateEmail,
  validatePhone,
  validateBirthDate,
  validateFamilySize,
  validateMonthlyIncome,
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from "@/utils/validation";
import { cpfMask, phoneMask, decimalMask, unmask } from "@/utils/masks";
import { getCurrentLocalDate, normalizeDateForInput } from "@/utils/dateUtils";
import { toast } from "sonner";

const priorityLevels = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "completed", label: "Concluído" },
];

const getInitialFormData = () => ({
  name: "",
  cpf: "",
  birth_date: "",
  address: "",
  phone: "",
  email: "",
  family_size: 1,
  monthly_income: "",
  priority_level: "medium",
  status: "active",
  notes: "",
  registration_date: getCurrentLocalDate(),
});

export default function BeneficiaryForm({ beneficiary, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (beneficiary) {
      setFormData({
        name: beneficiary.name || "",
        cpf: beneficiary.cpf || "",
        birth_date: beneficiary.birth_date
          ? normalizeDateForInput(beneficiary.birth_date)
          : "",
        address: beneficiary.address || "",
        phone: beneficiary.phone || "",
        email: beneficiary.email || "",
        family_size: beneficiary.family_size || 1,
        monthly_income:
          beneficiary.monthly_income === null
            ? ""
            : beneficiary.monthly_income
            ? beneficiary.monthly_income.toString()
            : "",
        priority_level: beneficiary.priority_level || "medium",
        status: beneficiary.status || "active",
        notes: beneficiary.notes || "",
        registration_date: beneficiary.registration_date
          ? normalizeDateForInput(beneficiary.registration_date)
          : getCurrentLocalDate(),
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [beneficiary]);

  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Aplicar máscaras
    if (field === "cpf") {
      processedValue = cpfMask(value);
    } else if (field === "phone") {
      processedValue = phoneMask(value);
    } else if (field === "monthly_income") {
      processedValue = decimalMask(value, 8, 2);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nome - obrigatório, mínimo 2 caracteres
    if (!validateRequired(formData.name)) {
      newErrors.name = "Nome é obrigatório";
    } else if (!validateMinLength(formData.name, 2)) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    } else if (!validateMaxLength(formData.name, 100)) {
      newErrors.name = "Nome deve ter no máximo 100 caracteres";
    }

    // CPF - obrigatório e válido
    const cleanCPF = unmask(formData.cpf);
    if (!validateRequired(cleanCPF)) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(cleanCPF)) {
      newErrors.cpf = "CPF inválido";
    }

    // Data de nascimento - opcional mas deve ser válida se preenchida
    if (formData.birth_date && !validateBirthDate(formData.birth_date)) {
      newErrors.birth_date = "Data de nascimento inválida";
    }

    // Endereço - obrigatório
    if (!validateRequired(formData.address)) {
      newErrors.address = "Endereço é obrigatório";
    } else if (!validateMinLength(formData.address, 10)) {
      newErrors.address = "Endereço deve ter pelo menos 10 caracteres";
    }

    // Telefone - opcional mas deve ser válido se preenchido
    const cleanPhone = unmask(formData.phone);
    if (cleanPhone && !validatePhone(cleanPhone)) {
      newErrors.phone = "Telefone inválido";
    }

    // Email - opcional mas deve ser válido se preenchido
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Tamanho da família - obrigatório e válido
    if (!validateFamilySize(formData.family_size)) {
      newErrors.family_size = "Tamanho da família deve ser entre 1 e 20";
    }

    // Renda mensal - opcional mas deve ser válida se preenchida
    if (formData.monthly_income && !validateMonthlyIncome(unmask(formData.monthly_income))) {
      newErrors.monthly_income = "Renda mensal deve ser entre R$ 0 e R$ 100.000";
    }

    // Data de cadastro - obrigatória
    if (!formData.registration_date) {
      newErrors.registration_date = "Data de cadastro é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Corrija os erros no formulário antes de salvar");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanedData = {
        ...formData,

        // Limpar máscaras para envio
        cpf: unmask(formData.cpf),
        phone: unmask(formData.phone),
        monthly_income: formData.monthly_income
          ? parseFloat(unmask(formData.monthly_income).replace(',', '.'))
          : null,

        // Converte números corretamente
        family_size: Number(formData.family_size),

        // Evita datas inválidas
        birth_date: formData.birth_date || null,
      };

      await onSubmit(cleanedData);
    } catch (error) {
      console.error("Erro ao salvar beneficiado:", error);
      toast.error("Erro ao salvar beneficiado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in-0">
      <Card className="w-full max-w-2xl max-h-[90vh] bg-white rounded-md overflow-y-auto animate-in zoom-in-95">
        <CardHeader className="sticky top-0 z-10 mt-0 flex flex-row items-center justify-between bg-white px-6 pb-2">
          <CardTitle className="text-xl font-bold">
            {beneficiary ? "Editar Beneficiado" : "Novo Beneficiado"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            title="Fechar janela"
            aria-label="Fechar"
            className="text-gray-700 hover:text-red-600 hover:bg-red-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Dados Pessoais */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nome completo"
                    required
                    className={errors.name ? "border-red-500" : "rounded-md"}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    placeholder="email@exemplo.com"
                    className={errors.email ? "border-red-500" : "rounded-md"}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="space-y-2 md:cols-span-1 ">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    autoComplete="off"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    className={errors.cpf ? "border-red-500" : "rounded-md"}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-600">{errors.cpf}</p>
                  )}
                </div>

                <div className="space-y-2 md:cols-span-1">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    name="birth_date"
                    autoComplete="bday"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) =>
                      handleInputChange("birth_date", e.target.value)
                    }
                    className={errors.birth_date ? "border-red-500" : "rounded-md"}
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-red-600">{errors.birth_date}</p>
                  )}
                </div>

                <div className="space-y-2 md:cols-span-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    placeholder="(11) 99999-9999"
                    className={errors.phone ? "border-red-500" : "rounded-md"}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Endereço
              </h3>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo *</Label>
                <Input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value)
                  }
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                  required
                  className={errors.address ? "border-red-500" : "rounded-md"}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Info Socioeconômicas */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Informações Socioeconômicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="family_size">Tamanho da Família *</Label>
                  <Input
                    id="family_size"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.family_size}
                    onChange={(e) =>
                      handleInputChange("family_size", e.target.value)
                    }
                    required
                    className={errors.family_size ? "border-red-500" : "rounded-md"}
                  />
                  {errors.family_size && (
                    <p className="text-sm text-red-600">{errors.family_size}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Renda Mensal (R$)</Label>
                  <Input
                    id="monthly_income"
                    value={formData.monthly_income}
                    onChange={(e) =>
                      handleInputChange("monthly_income", e.target.value)
                    }
                    placeholder="0,00"
                    className={errors.monthly_income ? "border-red-500" : "rounded-md"}
                  />
                  {errors.monthly_income && (
                    <p className="text-sm text-red-600">{errors.monthly_income}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority_level">Nível de Prioridade</Label>
                  <Select
                    id="priority_level"
                    value={formData.priority_level}
                    onValueChange={(value) =>
                      handleInputChange("priority_level", value)
                    }
                  >
                    <SelectTrigger className="rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value}
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Controle */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Controle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_date">
                    Data de Cadastro *
                  </Label>
                  <Input
                    id="registration_date"
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) =>
                      handleInputChange("registration_date", e.target.value)
                    }
                    required
                    className={errors.registration_date ? "border-red-500" : "rounded-md"}
                  />
                  {errors.registration_date && (
                    <p className="text-sm text-red-600">{errors.registration_date}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                autoComplete="off"
                className="rounded-md"
                value={formData.notes}
                onChange={(e) =>
                  handleInputChange("notes", e.target.value)
                }
                placeholder="Observações importantes sobre o beneficiado..."
              />
            </div>
          </CardContent>

          <CardFooter className="pt-6 bottom-0 bg-card z-10">
            <div className="flex justify-end gap-3 w-full">
              <Button className="rounded-md hover:bg-red-100 hover:text-red-700" type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-700 hover:bg-green-900 rounded-md"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Salvando..." : "Salvar Beneficiado"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
