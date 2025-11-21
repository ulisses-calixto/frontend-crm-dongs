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
        <div className="relative">
          <img 
            src={orgData.logo_url || "https://placehold.co/128x128/e2e8f0/64748b?text=Logo"} 
            alt="Logo da Organização" 
            className="w-32 h-32 rounded-4xl object-cover shadow-md"
          />
           <Label htmlFor="logo-upload" className="absolute bottom-0 right-0 bg-sky-700 text-white rounded-xl p-2 cursor-pointer hover:bg-sky-900 transition-colors">
            <Upload className="w-4 h-4" />
          </Label>
          <Input id="logo-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{orgData.name}</h3>
          <p className="text-gray-600">Atualize as informações da sua organização.</p>
        </div>
      </div>
      
      {isUploading && <p className="text-blue-600">Enviando imagem...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Organização</Label>
          <Input className="rounded-xl" id="name" value={orgData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input className="rounded-xl" id="cnpj" value={orgData.cnpj} onChange={(e) => handleInputChange('cnpj', e.target.value)} />
        </div>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input className="rounded-xl" id="address" value={orgData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input className="rounded-xl" id="phone" value={orgData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input className="rounded-xl" id="email" type="email" value={orgData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Site</Label>
          <Input className="rounded-xl" id="website" value={orgData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição / Missão</Label>
        <Textarea className="rounded-xl" id="description" value={orgData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
      </div>

      <div className="flex justify-end">
        <Button className="rounded-xl bg-sky-700 hover:bg-sky-900" type="submit" disabled={isSaving || isUploading}>
          <Save className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
