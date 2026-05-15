// ─── Gerador de faturas PDF ───────────────────────────────
// Usa PDFKit para gerar faturas em PT com valores em ECV.
// Chamado após webhook payment_intent.succeeded.

import PDFDocument from "pdfkit";
import { formatCVE } from "../stripe/client";

export interface InvoiceData {
  invoiceNumber: string;        // Ex: SAN-2026-00042
  bookingId: string;
  issuedAt: Date;
  customerName: string;
  customerEmail: string;
  placeName: string;
  placeAddress: string;
  checkin?: string;
  checkout?: string;
  breakdown: Array<{ label: string; amountCVE: number }>;
  totalCVE: number;
  stripePaymentIntentId: string;
}

// ─── Brand colors ─────────────────────────────────────────
const OCEAN_DARK = "#0B2E4A";
const OCEAN      = "#0B5E8A";
const SAND       = "#F2C67D";
const MUTED      = "#6B7280";
const LIGHT_BG   = "#F8FAFC";

export function generateInvoicePDF(data: InvoiceData): Buffer {
  const chunks: Buffer[] = [];
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: `Fatura ${data.invoiceNumber}`,
      Author: "Santi'Águ.cv",
      Subject: `Reserva ${data.bookingId}`,
    },
  });

  doc.on("data", (chunk) => chunks.push(chunk));

  const PAGE_WIDTH = doc.page.width - 100; // margins

  // ── Header ─────────────────────────────────────────────
  // Fundo azul escuro
  doc.rect(0, 0, doc.page.width, 120).fill(OCEAN_DARK);

  // Logo / Nome
  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Santi'Águ.cv", 50, 38);

  doc
    .fillColor(SAND)
    .font("Helvetica")
    .fontSize(11)
    .text("Ilha de Santiago · Cabo Verde", 50, 66);

  // Número de fatura (direita)
  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`FATURA`, doc.page.width - 200, 38, { width: 150, align: "right" });

  doc
    .fillColor(SAND)
    .font("Helvetica")
    .fontSize(11)
    .text(data.invoiceNumber, doc.page.width - 200, 58, { width: 150, align: "right" });

  // ── Meta info ──────────────────────────────────────────
  doc.moveDown(4);

  const metaY = 145;

  // Data de emissão
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9)
    .text("DATA DE EMISSÃO", 50, metaY);

  doc
    .fillColor(OCEAN_DARK)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(
      data.issuedAt.toLocaleDateString("pt-PT", {
        day: "2-digit", month: "long", year: "numeric",
      }),
      50, metaY + 14
    );

  // Cliente
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9)
    .text("FATURADO A", 220, metaY);

  doc
    .fillColor(OCEAN_DARK)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(data.customerName, 220, metaY + 14);

  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(10)
    .text(data.customerEmail, 220, metaY + 30);

  // Reserva ID
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9)
    .text("RESERVA #", 420, metaY, { width: 130 });

  doc
    .fillColor(OCEAN_DARK)
    .font("Helvetica")
    .fontSize(9)
    .text(data.bookingId, 420, metaY + 14, { width: 130 });

  // ── Divider ────────────────────────────────────────────
  doc
    .moveTo(50, 215)
    .lineTo(doc.page.width - 50, 215)
    .strokeColor("#E5E7EB")
    .lineWidth(1)
    .stroke();

  // ── Place info ─────────────────────────────────────────
  doc
    .fillColor(OCEAN)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(data.placeName, 50, 228);

  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(10)
    .text(data.placeAddress, 50, 244);

  if (data.checkin && data.checkout) {
    doc
      .fillColor(MUTED)
      .fontSize(10)
      .text(`Check-in: ${data.checkin}   →   Check-out: ${data.checkout}`, 50, 260);
  }

  // ── Breakdown table ────────────────────────────────────
  const tableTop = 295;

  // Header row
  doc.rect(50, tableTop, PAGE_WIDTH, 28).fill(LIGHT_BG);

  doc
    .fillColor(MUTED)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("DESCRIÇÃO", 62, tableTop + 10)
    .text("VALOR (ECV)", doc.page.width - 160, tableTop + 10, { width: 110, align: "right" });

  // Rows
  let rowY = tableTop + 28;

  data.breakdown.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.rect(50, rowY, PAGE_WIDTH, 28).fill("#FAFAFA");
    }

    doc
      .fillColor(OCEAN_DARK)
      .font("Helvetica")
      .fontSize(10)
      .text(item.label, 62, rowY + 9, { width: 320 });

    doc
      .fillColor(OCEAN_DARK)
      .font("Helvetica")
      .fontSize(10)
      .text(formatCVE(item.amountCVE), doc.page.width - 160, rowY + 9, {
        width: 110,
        align: "right",
      });

    rowY += 28;
  });

  // Divider before total
  doc
    .moveTo(50, rowY + 8)
    .lineTo(doc.page.width - 50, rowY + 8)
    .strokeColor("#E5E7EB")
    .lineWidth(1)
    .stroke();

  // Total row
  rowY += 16;
  doc.rect(doc.page.width - 210, rowY, 160, 36).fill(OCEAN_DARK);

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("TOTAL", doc.page.width - 200, rowY + 8, { width: 140, align: "right" });

  doc
    .fillColor(SAND)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(formatCVE(data.totalCVE), doc.page.width - 200, rowY + 20, {
      width: 140,
      align: "right",
    });

  // ── Payment reference ──────────────────────────────────
  rowY += 60;
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9)
    .text(`Referência de pagamento: ${data.stripePaymentIntentId}`, 50, rowY);

  // ── Footer ─────────────────────────────────────────────
  const footerY = doc.page.height - 60;

  doc
    .rect(0, footerY - 10, doc.page.width, 70)
    .fill(LIGHT_BG);

  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9)
    .text(
      "Santi'Águ.cv · contato@santiagu.cv · www.santiagu.cv · Ilha de Santiago, Cabo Verde",
      50,
      footerY + 4,
      { align: "center", width: PAGE_WIDTH }
    );

  doc
    .fillColor(MUTED)
    .fontSize(8)
    .text(
      "Este documento serve como comprovativo de pagamento. NIF não aplicável — plataforma digital.",
      50,
      footerY + 20,
      { align: "center", width: PAGE_WIDTH }
    );

  doc.end();

  // Concatenar e retornar
  return Buffer.concat(chunks);
}

// ─── Invoice number generator ─────────────────────────────
export function generateInvoiceNumber(sequenceId: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequenceId).padStart(5, "0");
  return `SAN-${year}-${padded}`;
}
