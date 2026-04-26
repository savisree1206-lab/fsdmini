import { jsPDF } from 'jspdf';

/**
 * Format a number as Indian Rupees using ASCII-safe "Rs." prefix.
 * jsPDF's built-in Helvetica does NOT include the ₹ glyph, so we use Rs.
 */
function inrFormat(amount) {
  return 'Rs. ' + Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

/**
 * Generates and downloads an E-Ticket PDF for a given booking.
 * @param {object} booking - The booking object from localStorage
 * @param {object} user    - The user object from localStorage
 */
export function generateETicket(booking, user) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 595.28 pt
  const H = doc.internal.pageSize.getHeight();  // 841.89 pt
  const PAD = 40; // left / right margin

  // ── 1. Background ─────────────────────────────────────────────────────────────
  doc.setFillColor(10, 15, 35);
  doc.rect(0, 0, W, H, 'F');

  // ── 2. Header band ────────────────────────────────────────────────────────────
  doc.setFillColor(22, 31, 72);
  doc.rect(0, 0, W, 128, 'F');

  // Indigo accent stripe at very top
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, W, 5, 'F');

  // ── 3. Watermark ──────────────────────────────────────────────────────────────
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.035 }));
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(110);
  doc.text('VENTUREVIBE', W / 2, H / 2 + 40, { align: 'center', angle: -35 });
  doc.restoreGraphicsState();

  // ── 4. Logo & tagline (left-aligned in header) ────────────────────────────────
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('VentureVibe', PAD, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(170, 185, 225);
  doc.text('Your World. Your Journey.', PAD, 72);

  // Tiny airplane icon drawn as a simple triangle near the logo
  // (ASCII fallback — just skip the ✈ glyph)

  // ── 5. E-TICKET badge (right side of header) ──────────────────────────────────
  const badgeW = 110;
  const badgeH = 32;
  const badgeX = W - PAD - badgeW;
  const badgeY = 26;
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  // Centre text inside badge
  doc.text('E - TICKET', badgeX + badgeW / 2, badgeY + badgeH / 2 + 4, { align: 'center' });

  // ── 6. Booking-ref pill + CONFIRMED pill (below logo) ─────────────────────────
  const pillY = 92;
  const pillH = 22;

  // Left pill: Booking Ref
  doc.setFillColor(14, 20, 52);
  doc.roundedRect(PAD, pillY, 240, pillH, 4, 4, 'F');
  doc.setTextColor(140, 155, 210);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('BOOKING REF:', PAD + 10, pillY + 14);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(String(booking.bookingId), PAD + 92, pillY + 14);

  // Right pill: Confirmed
  const cpillW = 120;
  const cpillX = W - PAD - cpillW;
  doc.setFillColor(21, 128, 61);
  doc.roundedRect(cpillX, pillY, cpillW, pillH, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CONFIRMED', cpillX + cpillW / 2, pillY + 14, { align: 'center' });

  // ── 7. Destination name (centred, below header) ───────────────────────────────
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(booking.name || 'Destination', W / 2, 172, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(150, 168, 220);
  const subLine = [booking.duration, booking.tag].filter(Boolean).join('  |  ');
  doc.text(subLine, W / 2, 193, { align: 'center' });

  // ── 8. Dashed separator ───────────────────────────────────────────────────────
  const sep1Y = 214;
  doc.setDrawColor(50, 62, 108);
  doc.setLineDashPattern([5, 4], 0);
  doc.setLineWidth(0.8);
  doc.line(PAD, sep1Y, W - PAD, sep1Y);
  doc.setLineDashPattern([], 0);

  // ── 9. Info grid (2 columns × 4 rows) ────────────────────────────────────────
  const guideDisplay =
    !booking.guide || booking.guide === 'none'
      ? 'Not Required'
      : booking.guide.charAt(0).toUpperCase() + booking.guide.slice(1);

  const fields = [
    { label: 'PASSENGER',  value: user?.name  || 'Traveler' },
    { label: 'EMAIL',      value: user?.email || '-' },
    { label: 'CHECK-IN',   value: booking.checkIn  || '-' },
    { label: 'CHECK-OUT',  value: booking.checkOut || '-' },
    { label: 'GUESTS',     value: String(booking.guests) },
    { label: 'TRANSPORT',  value: (booking.vehicle || '-').charAt(0).toUpperCase() + (booking.vehicle || '-').slice(1) },
    { label: 'TOUR GUIDE', value: guideDisplay },
    { label: 'PACKAGE',    value: booking.tag || '-' },
  ];

  const colW   = (W - PAD * 2 - 8) / 2;  // width of each column
  const cellH  = 52;                       // height of each cell
  const gridX  = [PAD, PAD + colW + 8];   // x position of col 0 and col 1
  const startY = 226;

  fields.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx  = gridX[col];
    const cy  = startY + row * cellH;

    // Cell background
    doc.setFillColor(col === 0 ? 18 : 14, col === 0 ? 24 : 20, col === 0 ? 58 : 52);
    doc.roundedRect(cx, cy + 2, colW, cellH - 4, 4, 4, 'F');

    // Label
    doc.setTextColor(110, 130, 195);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(f.label, cx + 12, cy + 17);

    // Value — clip long strings to avoid overflow
    doc.setTextColor(230, 238, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    const maxChars = 28;
    const display  = f.value.length > maxChars ? f.value.slice(0, maxChars - 1) + '…' : f.value;
    doc.text(display, cx + 12, cy + 37);
  });

  // ── 10. Price section ─────────────────────────────────────────────────────────
  const priceBoxY = startY + Math.ceil(fields.length / 2) * cellH + 16;

  // Dashed separator above price
  doc.setDrawColor(50, 62, 108);
  doc.setLineDashPattern([5, 4], 0);
  doc.line(PAD, priceBoxY, W - PAD, priceBoxY);
  doc.setLineDashPattern([], 0);

  // Indigo amount box
  const amtBoxH  = 58;
  const amtBoxY  = priceBoxY + 12;
  doc.setFillColor(79, 82, 220);
  doc.roundedRect(PAD, amtBoxY, W - PAD * 2, amtBoxH, 8, 8, 'F');

  // Label inside box (small, upper)
  doc.setTextColor(200, 206, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('TOTAL AMOUNT PAID', W / 2, amtBoxY + 18, { align: 'center' });

  // Amount (ASCII-safe Rs. prefix)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(inrFormat(booking.total), W / 2, amtBoxY + 42, { align: 'center' });

  // ── 11. Barcode strip (bars grow UPWARD from a fixed baseline) ────────────────
  const barBaseY   = amtBoxY + amtBoxH + 72;  // baseline Y (bottom of all bars)
  const barcodeW   = 320;
  const barcodeX   = (W - barcodeW) / 2;
  const barMaxH    = 50;   // tallest bar height
  const barMinH    = 10;   // shortest bar height
  const barCount   = 65;
  const barW       = barcodeW / barCount;
  const seed       = Number(booking.bookingId) % 999983; // keep seed manageable

  for (let k = 0; k < barCount; k++) {
    // Deterministic pseudo-random using LCG-like formula
    const pseudo = ((seed * (k * 134775813 + 1) + 1) % 1000) / 1000;
    const bH     = barMinH + pseudo * (barMaxH - barMinH);
    const luma   = 130 + Math.floor(pseudo * 110);
    doc.setFillColor(luma, luma, luma);
    // Draw bar UPWARD: y = baseline - height
    doc.rect(barcodeX + k * barW, barBaseY - bH, barW - 0.8, bH, 'F');
  }

  // Booking ID text below barcode
  doc.setTextColor(110, 128, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(String(booking.bookingId), W / 2, barBaseY + 14, { align: 'center' });

  // ── 12. Footer bar ────────────────────────────────────────────────────────────
  doc.setFillColor(16, 22, 54);
  doc.rect(0, H - 46, W, 46, 'F');

  doc.setTextColor(90, 108, 170);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    'Computer-generated e-ticket  |  No signature required  |  VentureVibe Travel Portal  |  support@venturevibe.com',
    W / 2,
    H - 18,
    { align: 'center' }
  );

  // ── 13. Save ──────────────────────────────────────────────────────────────────
  doc.save(`VentureVibe_Ticket_${booking.bookingId}.pdf`);
}
