import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts if needed (using standard fonts for simplicity in this example)

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: 2,
    borderBottomColor: '#C80313',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07090D',
  },
  logoRed: {
    color: '#C80313',
  },
  title: {
    fontSize: 18,
    color: '#9BA3AF',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#07090D',
    marginBottom: 15,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    borderLeft: 4,
    borderLeftColor: '#C80313',
  },
  cardLabel: {
    fontSize: 10,
    color: '#9BA3AF',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07090D',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#242938',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#242938',
    borderBottomColor: '#242938',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: '#0F1117',
    padding: 8,
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderColor: '#242938',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableCell: {
    fontSize: 10,
    color: '#07090D',
  },
  insightSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#07090D',
    borderRadius: 8,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 10,
    color: '#F5F7FA',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#9BA3AF',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9BA3AF',
  }
});

interface ReportProps {
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
}

export const FinancialReportPDF = ({ userName, month, year, data }: ReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>KADRON <Text style={styles.logoRed}>FINANCE</Text></Text>
          <Text style={{ fontSize: 10, color: '#9BA3AF', marginTop: 5 }}>RELATÓRIO FINANCEIRO MENSAL</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.title}>{month} {year}</Text>
          <Text style={{ fontSize: 10, color: '#9BA3AF' }}>Preparado para: {userName}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Resumo Executivo</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>RECEITA TOTAL</Text>
          <Text style={styles.cardValue}>{data.revenue}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>DESPESA TOTAL</Text>
          <Text style={styles.cardValue}>{data.expenses}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>SALDO FINAL</Text>
          <Text style={styles.cardValue}>{data.balance}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transações do Período</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Data</Text></View>
          <View style={[styles.tableColHeader, { width: '40%' }]}><Text style={styles.tableCellHeader}>Descrição</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Categoria</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Valor</Text></View>
        </View>
        {data.transactions.map((t, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{t.date}</Text></View>
            <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCell}>{t.description}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{t.category}</Text></View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { color: t.type === 'income' ? 'green' : '#C80313' }]}>
                {t.amount}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.insightSection}>
        <Text style={styles.insightTitle}>Insights Automáticos IA</Text>
        <Text style={styles.insightText}>• "Seu crescimento este mês foi de {data.growth} em relação ao mês anterior."</Text>
        <Text style={styles.insightText}>• "Identificamos uma redução de 12% em gastos com serviços."</Text>
        <Text style={styles.insightText}>• "Você está 85% próximo de atingir sua meta 'Reserva de Emergência'."</Text>
      </View>

      <View style={styles.footer}>
        <Text>Gerado em: {new Date().toLocaleDateString()}</Text>
        <Text>Kadron Finance — O Futuro da sua Gestão</Text>
        <Text>Página 1 de 1</Text>
      </View>
    </Page>
  </Document>
);
