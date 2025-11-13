export const runtime = 'edge';
// src/app/api/dashboard/emails/all/export/route.ts - NUEVA RUTA
import { getAllEmails } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const emails = await getAllEmails();

    if (emails.length === 0) {
      const emptyCsv =
        'ID,Tipo,Destinatario,ID Pedido,Número Pedido,Estado,Intentos,Error,Fecha,Hora\n';
      return new NextResponse(emptyCsv, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="todos-los-emails-${
            new Date().toISOString().split('T')[0]
          }.csv"`,
        },
      });
    }

    const headers = [
      'ID',
      'Tipo',
      'Destinatario',
      'ID Pedido',
      'Número Pedido',
      'Estado',
      'Intentos',
      'Error',
      'Fecha',
      'Hora',
    ];

    const csvRows = emails.map(email => [
      email.id,
      email.type,
      email.recipient,
      email.orderId,
      email.order?.orderNumber || 'N/A',
      email.status,
      email.attempts.toString(),
      `"${(email.error || '').replace(/"/g, '""')}"`,
      new Date(email.timestamp).toLocaleDateString('es-ES'),
      new Date(email.timestamp).toLocaleTimeString('es-ES'),
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(',')),
    ].join('\n');

    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], {
      type: 'text/csv;charset=utf-8;',
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `todos-los-emails-${timestamp}.csv`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8;',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error exporting all emails:', error);

    return NextResponse.json(
      {
        error: 'Error al exportar todos los emails',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}
