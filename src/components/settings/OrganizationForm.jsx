import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Upload } from 'lucide-react';

export default function OrganizationForm({ organization, onSave }) {
  const [orgData, setOrgData] = useState(organization);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setOrgData(organization);
  }, [organization]);

  const handleInputChange = (field, value) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For now, we'll use a placeholder implementation
      // TODO: Implement proper file upload service
      const formData = new FormData();
      formData.append('file', file);

      // Placeholder URL - replace with actual upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { file_url } = await response.json();
      setOrgData(prev => ({ ...prev, logo_url: file_url }));
      toast.success("Logo enviado com sucesso!");
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(orgData);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{orgData.name}</h3>
          <p className="text-gray-600 text-md">Atualize as informações da sua organização.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Organização</Label>
          <Input className="rounded-md" id="name" value={orgData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input className="rounded-md" id="cnpj" value={orgData.cnpj} onChange={(e) => handleInputChange('cnpj', e.target.value)} />
        </div>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input className="rounded-md" id="address" value={orgData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input className="rounded-md" id="phone" value={orgData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input className="rounded-md" id="email" type="email" value={orgData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">WebSite</Label>
          <Input className="rounded-md" id="website" value={orgData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição / Missão</Label>
        <Textarea className="rounded-md" id="description" value={orgData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center bg-green-700 hover:bg-green-900 gap-2 px-6 py-5 rounded-md" type="submit" disabled={isSaving || isUploading}>
          <Save className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
