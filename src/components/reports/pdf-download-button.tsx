"use client"

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FinancialReportPDF } from './pdf-template';
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface PDFDownloadButtonProps {
  userName: string;
  month: string;
  year: string;
  data: {
    revenue: string;
    expenses: string;
    balance: string;
    growth: string;
    transactions: any[];
  };
  buttonText?: string;
  className?: string;
}

export default function PDFDownloadButton({
  userName,
  month,
  year,
  data,
  buttonText = "EXPORTAR PDF MENSAL",
  className = ""
}: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button disabled className={`${className} opacity-50`}>
        <FileDown className="mr-2" size={20} />
        {buttonText} (CARREGANDO...)
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<FinancialReportPDF userName={userName} month={month} year={year} data={data} />}
      fileName={`Relatorio_Financeiro_${month}_${year}.pdf`}
      style={{ textDecoration: 'none', display: 'inline-block', width: '100%' }}
    >
      {({ loading, error }) => (
        <Button
          disabled={loading}
          className={`${className} flex items-center justify-center gap-2`}
        >
          <FileDown size={20} />
          {loading ? 'GERANDO PDF...' : buttonText}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
