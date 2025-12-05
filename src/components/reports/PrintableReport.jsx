import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

/* ===========================
   Constants / Labels
   =========================== */
const DEFAULT_PRIMARY = "#000ecf";

const LABELS = {
  donationTypes: {
    monetary: "Monetária",
    food: "Alimentos",
    clothing: "Roupas",
    toys: "Brinquedos",
    books: "Livros",
    electronics: "Eletrônicos",
    medicine: "Medicamentos",
    other: "Outros",
  },

  donationStatus: {
    received: "Recebida",
    partially_distributed: "Parcialmente Distribuída",
    fully_distributed: "Totalmente Distribuída",
    pending: "Pendente",
  },

  priorityLabels: {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  },

  beneficiaryStatus: {
    active: "Ativo",
    inactive: "Inativo",
    completed: "Concluído",
  },
};

/* ===========================
   Helpers (Data / Chart)
   =========================== */

/**
 * formata uma data de forma segura cobrindo:
 * - "YYYY-MM-DD" (interpreta como local)
 * - ISO com timezone (Z ou ±hh:mm) -> interpreta UTC e converte para data local sem perder o dia
 * - outros formatos -> tenta parse padrão
 *
 * Retorna string vazia quando não informado, ou "Data inválida" quando o valor não pode ser parseado.
 */
export const formatSafeDate = (dateString, formatStr = "dd/MM/yyyy") => {
  if (!dateString) return "";

  // Caso A: apenas 'YYYY-MM-DD' => cria data local com ano/mês/dia
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDateOnly.test(dateString)) {
    const [y, m, d] = dateString.split("-").map(Number);
    const local = new Date(y, m - 1, d);
    return isValid(local) ? format(local, formatStr, { locale: ptBR }) : "Data inválida";
  }

  // Tenta parsear para Date
  const parsed = new Date(dateString);
  if (!isValid(parsed)) return "Data inválida";

  // Se tem timezone explícito (Z, +hh:mm ou -hh:mm) interpretamos a data em UTC
  const hasTimezone = /([zZ]|[+\-]\d{2}:\d{2})$/.test(String(dateString));
  if (hasTimezone) {
    // Reconstruir data local usando componentes UTC para preservar o dia
    const localFromUTC = new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
    return format(localFromUTC, formatStr, { locale: ptBR });
  }

  // Fallback: tratar como já sendo horário local
  return format(parsed, formatStr, { locale: ptBR });
};

/**
 * Gera um SVG simples de barras (string) para incorporar no relatório.
 * Recebe os dados (array), tipo do relatório e cor primária.
 */
const generateChartSvg = (data = [], reportType = "donations", primaryColor = DEFAULT_PRIMARY, maxItems = 6) => {
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

  const items = Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, maxItems);
  if (items.length === 0) return null;

  const max = Math.max(...items.map(([, v]) => v));
  const width = 520;
  const height = 160;
  const barWidth = Math.floor(width / items.length) - 12;

  const barsSvg = items
    .map(([k, v], i) => {
      const h = Math.round((v / max) * (height - 40));
      const x = 12 + i * (barWidth + 12);
      const y = height - h - 20;
      const label = reportType === "donations" ? LABELS.donationTypes[k] || k : LABELS.priorityLabels[k] || k;

      return `
        <g key="${k}">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${primaryColor}" opacity="${0.9 - i * 0.05}" />
          <text x="${x + barWidth / 2}" y="${height - 4}" font-size="11" text-anchor="middle" fill="#111">${label}</text>
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" text-anchor="middle" fill="#111">${v}</text>
        </g>
      `;
    })
    .join("");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${barsSvg}</svg>`;
};

/* ===========================
   Small Subcomponents
   =========================== */

const ReportHeader = ({ organization = {}, title, periodLabel, generatedAt, primaryColor }) => (
  <header className="mb-6 text-center pb-4 border-b border-gray-200">
    <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
      {organization?.name}
    </h1>
    {organization?.cnpj && <p className="text-gray-600 text-sm">{organization.cnpj}</p>}

    <h2 className="text-xl font-semibold mt-2">{title}</h2>
    <p className="text-gray-600">Período: {periodLabel}</p>
    <p className="text-gray-500 text-xs">Gerado em: {generatedAt}</p>
  </header>
);

const DonationRow = React.memo(({ item, index }) => (
  <tr key={item.id || index} className="text-sm text-gray-700">
    <td className="border p-3">{index + 1}</td>
    <td className="border p-3">{formatSafeDate(item.donation_date)}</td>
    <td className="border p-3 font-medium">{item.donor_name}</td>
    <td className="border p-3">{LABELS.donationTypes[item.donation_type] || item.donation_type}</td>
    <td className="border p-3">{item.description}</td>
    <td className="border p-3 text-center">
      {item.donation_type === "monetary"
        ? `R$ ${Number(item.value || 0).toFixed(2)}`
        : `${item.quantity || ""} ${item.unit || ""}`}
    </td>
    <td className="border p-3 text-center">
      <Badge variant="outline">{LABELS.donationStatus[item.status]}</Badge>
    </td>
  </tr>
));

const BeneficiaryRow = React.memo(({ item, index }) => (
  <tr key={item.id || index} className="text-sm text-gray-700">
    <td className="border p-3">{index + 1}</td>
    <td className="border p-3">{formatSafeDate(item.registration_date)}</td>
    <td className="border p-3 font-medium">{item.name}</td>
    <td className="border p-3">{item.address}</td>
    <td className="border p-3 text-center">{item.family_size}</td>
    <td className="border p-3 text-center">
      <Badge variant="outline">{LABELS.priorityLabels[item.priority_level]}</Badge>
    </td>
    <td className="border p-3 text-center">
      <Badge variant="outline">{LABELS.beneficiaryStatus[item.status]}</Badge>
    </td>
  </tr>
));

const ReportFooter = ({ title }) => (
  <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
    <div>
      <div className="text-sm font-semibold text-gray-700">Assinatura</div>
      <div className="mt-2 h-18 border-b border-gray-400 w-72" />
      <div className="text-xs text-gray-500 mt-1">Nome e cargo.</div>
    </div>

    <div className="text-right-end mt-20">
      <div className="text-xs text-gray-500">
        <strong>{title}</strong> gerado pelo sistema D'ONGs.
      </div>
    </div>
  </footer>
);

/* ===========================
   Main PrintableReport
   =========================== */

const PrintableReport = React.forwardRef(
  (
    {
      reportType = "donations", // 'donations' | 'beneficiaries'
      periodType = "month", // 'month' | 'year'
      data = [],
      organization = {},
      formatSafeDate: formatFn = formatSafeDate,
      primaryColor = DEFAULT_PRIMARY,
      reportUrl = typeof window !== "undefined" ? window.location.href : "",
    },
    ref
  ) => {
    const [qrDataUrl, setQrDataUrl] = useState(null);

    const reportTitle = reportType === "donations" ? "Relatório de Doações" : "Relatório de Beneficiados";
    const periodLabel = periodType === "month" ? "Mês Atual" : "Ano Atual";

    // QR CODE (opcional)
    useEffect(() => {
      let mounted = true;
      async function gen() {
        try {
          const { toDataURL } = await import("qrcode");
          const dataUrl = await toDataURL(reportUrl || "");
          if (mounted) setQrDataUrl(dataUrl);
        } catch {
          setQrDataUrl(null);
        }
      }
      gen();
      return () => {
        mounted = false;
      };
    }, [reportUrl]);

    // Chart SVG (memoizado)
    const chartSvg = useMemo(() => generateChartSvg(data, reportType, primaryColor), [data, reportType, primaryColor]);

    // Data gerada para o cabeçalho
    const generatedAt = format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });

    // Rows to render
    const rows = useMemo(() => {
      if (reportType === "donations") {
        return data.map((d, i) => <DonationRow key={d.id || i} item={d} index={i} />);
      }
      return data.map((b, i) => <BeneficiaryRow key={b.id || i} item={b} index={i} />);
    }, [data, reportType]);

    return (
      <div ref={ref} className="p-4 bg-white printable-container" style={{ "--primary": primaryColor }}>
        <style>{`
          :root { --primary: ${primaryColor}; }
          .printable-container {
            color: #000000;
            font-family: Inter, ui-sans-serif, system-ui;
            background: #ffffff;
          }
        `}</style>

        <ReportHeader organization={organization} title={reportTitle} periodLabel={periodLabel} generatedAt={generatedAt} primaryColor={primaryColor} />

        {chartSvg && (
          <div className="mb-6">
            <strong>RESUMO GERAL</strong>
            <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
          </div>
        )}

        {data.length === 0 ? (
          <p className="text-center py-6 text-gray-600">Nenhum dado encontrado.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              {reportType === "donations" ? (
                <tr className="bg-white">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Doador</th>
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Descrição</th>
                  <th className="p-3 text-center">Valor/Qtd</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              ) : (
                <tr className="bg-white">
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
            <tbody>{rows}</tbody>
          </table>
        )}

        <ReportFooter title={reportTitle} />
      </div>
    );
  }
);

export default PrintableReport;
