import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";

// --- Labels
const donationTypeLabels = {
  monetary: "Monetária",
  food: "Alimentos",
  clothing: "Roupas",
  toys: "Brinquedos",
  books: "Livros",
  electronics: "Eletrônicos",
  medicine: "Medicamentos",
  other: "Outros",
};

const statusLabelsDonation = {
  received: "Recebida",
  partially_distributed: "Parcialmente Distribuída",
  fully_distributed: "Totalmente Distribuída",
  pending: "Pendente",
};

const priorityLabelsBeneficiary = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const statusLabelsBeneficiary = {
  active: "Ativo",
  inactive: "Inativo",
  completed: "Concluído",
};

const DEFAULT_PRIMARY = "#0f172a";

const PrintableReport = React.forwardRef(
  (
    {
      reportType = "donations",
      periodType = "month",
      data = [],
      organization = {},
      formatSafeDate = (d) => (d ? format(new Date(d), "dd/MM/yyyy", { locale: ptBR }) : ""),
      detailed = false,
      primaryColor = DEFAULT_PRIMARY,
      reportUrl = typeof window !== "undefined" ? window.location.href : "",
    },
    ref
  ) => {
    const [qrDataUrl, setQrDataUrl] = useState(null);

    const reportTitle = reportType === "donations" ? "Relatório de Doações" : "Relatório de Beneficiados";
    const periodLabel = periodType === "month" ? "Mês Atual" : "Ano Atual";

    // ---------- QR CODE
    useEffect(() => {
      let mounted = true;
      async function gen() {
        try {
          const { toDataURL } = await import("qrcode");
          const dataUrl = await toDataURL(reportUrl || "");
          if (mounted) setQrDataUrl(dataUrl);
        } catch (err) {
          console.warn("qrcode lib not available");
          setQrDataUrl(null);
        }
      }
      gen();
      return () => {
        mounted = false;
      };
    }, [reportUrl]);

    // ---------- Chart SVG
    const chartSvg = useMemo(() => {
      const groups = {};
      if (reportType === "donations") {
        data.forEach((d) => {
          const k = d.donation_type || "other";
          groups[k] = (groups[k] || 0) + (d.quantity || d.value || 1);
        });
      } else {
        data.forEach((d) => {
          const k = d.priority_level || "medium";
          groups[k] = (groups[k] || 0) + 1;
        });
      }
      const items = Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 6);
      if (items.length === 0) return null;

      const max = Math.max(...items.map(([, v]) => v));
      const width = 520;
      const height = 160;
      const barWidth = Math.floor(width / items.length) - 12;

      const bars = items.map(([k, v], i) => {
        const h = Math.round((v / max) * (height - 40));
        const x = 12 + i * (barWidth + 12);
        const y = height - h - 20;
        const label =
          reportType === "donations" ? donationTypeLabels[k] || k : priorityLabelsBeneficiary[k] || k;
        return { k, v, x, y, h, label };
      });

      const barsSvg = bars
        .map(
          (b, i) => `
          <g key="${b.k}">
            <rect x="${b.x}" y="${b.y}" width="${barWidth}" height="${b.h}" rx="4" fill="${primaryColor}" opacity="${0.9 - i * 0.05}" />
            <text x="${b.x + barWidth / 2}" y="${height - 4}" font-size="11" text-anchor="middle" fill="#111">${b.label}</text>
            <text x="${b.x + barWidth / 2}" y="${b.y - 6}" font-size="11" text-anchor="middle" fill="#111">${b.v}</text>
          </g>`
        )
        .join("");

      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${barsSvg}</svg>`;
    }, [data, reportType, primaryColor]);

    // Tables
    const renderDonationRow = (item, index) => (
      <tr key={item.id || index} className="text-sm text-gray-700">
        <td className="border p-3">{index + 1}</td>
        <td className="border p-3">{formatSafeDate(item.donation_date)}</td>
        <td className="border p-3 font-medium">{item.donor_name}</td>
        <td className="border p-3">{donationTypeLabels[item.donation_type] || item.donation_type}</td>
        <td className="border p-3">{item.description}</td>
        <td className="border p-3 text-center">
          {item.donation_type === "monetary"
            ? `R$ ${Number(item.value || 0).toFixed(2)}`
            : `${item.quantity || ""} ${item.unit || ""}`}
        </td>
        <td className="border p-3 text-center">
          <Badge variant="outline">{statusLabelsDonation[item.status]}</Badge>
        </td>
      </tr>
    );

    const renderBeneficiaryRow = (item, index) => (
      <tr key={item.id || index} className="text-sm text-gray-700">
        <td className="border p-3">{index + 1}</td>
        <td className="border p-3">{formatSafeDate(item.registration_date)}</td>
        <td className="border p-3 font-medium">{item.name}</td>
        <td className="border p-3">{item.address}</td>
        <td className="border p-3 text-center">{item.family_size}</td>
        <td className="border p-3 text-center">
          <Badge variant="outline">{priorityLabelsBeneficiary[item.priority_level]}</Badge>
        </td>
        <td className="border p-3 text-center">
          <Badge variant="outline">{statusLabelsBeneficiary[item.status]}</Badge>
        </td>
      </tr>
    );

    return (
      <div ref={ref} className="p-4 bg-white printable-container" style={{ "--primary": primaryColor }}>
        <style>{`
          :root { --primary: ${primaryColor}; }
          .printable-container {
            color: #111111;
            font-family: Inter, ui-sans-serif, system-ui;
            background: #ffffff;
          }
        `}</style>

        {/* --- HEADER SIMPLES SEM CABEÇALHO FLUTUANTE --- */}
        <header className="mb-6 text-center pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
            {organization?.name}
          </h1>
          <p className="text-gray-600 text-sm">{organization?.cnpj}</p>

          <h2 className="text-xl font-semibold mt-2">{reportTitle}</h2>
          <p className="text-gray-600">Período: {periodLabel}</p>
          <p className="text-gray-500 text-xs">
            Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </p>
        </header>

        {/* --- CHART --- */}
        {chartSvg && (
          <div className="mb-6">
            <strong>Resumo Geral</strong>
            <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
          </div>
        )}

        {/* --- TABLE --- */}
        {data.length === 0 ? (
          <p className="text-center py-6 text-gray-600">Nenhum dado encontrado.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              {reportType === "donations" ? (
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Doador</th>
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Descrição</th>
                  <th className="p-3 text-center">Valor/Qtd</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              ) : (
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Data Cadastro</th>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Endereço</th>
                  <th className="p-3 text-center">Membros</th>
                  <th className="p-3 text-center">Prioridade</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.map(reportType === "donations" ? renderDonationRow : renderBeneficiaryRow)}
            </tbody>
          </table>
        )}

        {/* --- FOOTER --- */}
        <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-gray-700">Assinatura</div>
            <div className="mt-2 h-18 border-b border-b border-gray-400 w-72" />
            <div className="text-xs text-gray-500 mt-1">Nome e cargo.</div>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-gray-700">Verificação</div>
            <div className="mt-2 flex justify-end">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR code"
                  className="w-20 h-20 border rounded-xl"
                />
              ) : (
                <div className="w-20 h-20 border rounded flex items-center justify-center text-gray-400 text-xs">
                  QR
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1"><strong>{reportTitle}</strong> gerado pelo sistema D'ONGs.</div>
          </div>
        </footer>
      </div>
    );
  }
);

export default PrintableReport;
