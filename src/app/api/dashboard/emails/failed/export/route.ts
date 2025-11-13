export const runtime = 'edge';
// src/app/api/dashboard/emails/failed/export/route.ts - VERSIÓN CORREGIDA
import { getFailedEmails } from '@/lib/dashboard-service';
import { NextRequest, NextResponse } from 'next/server';

// Corregido: Prefijar con guion bajo el parámetro no utilizado
export async function GET(_request: NextRequest) {
  try {
    // Obtener todos los emails fallidos
    const emails = await getFailedEmails();

    // Si no hay emails, devolver un CSV vacío con encabezados
    if (emails.length === 0) {
      const emptyCsv =
        'ID,Tipo,Destinatario,ID Pedido,Estado,Intentos,Error,Fecha\n';
      return new NextResponse(emptyCsv, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="emails-fallidos-${
            new Date().toISOString().split('T')[0]
          }.csv"`,
        },
      });
    }

    // Convertir a CSV
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
      `"${(email.error || '').replace(/"/g, '""')}"`, // Escapar comillas y manejar nulos
      new Date(email.timestamp).toLocaleDateString('es-ES'),
      new Date(email.timestamp).toLocaleTimeString('es-ES'),
    ]);

    // Combinar encabezados y filas
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(',')),
    ].join('\n');

    // Agregar BOM para proper UTF-8 encoding en Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // Crear el blob
    const blob = new Blob([csvWithBOM], {
      type: 'text/csv;charset=utf-8;',
    });

    // Generar nombre de archivo con timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `emails-fallidos-${timestamp}.csv`;

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
    console.error('Error exporting emails:', error);

    // Devolver una respuesta de error adecuada
    return NextResponse.json(
      {
        error: 'Error al exportar los emails',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}

// El método POST sí usa el parámetro request, así que lo dejamos como está
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters = {} } = body;

    // Aquí podrías implementar filtros específicos para la exportación
    // Por ahora, exportamos todos los emails fallidos
    const emails = await getFailedEmails();

    // Aplicar filtros si se proporcionan
    let filteredEmails = emails;

    if (filters.status && filters.status !== 'all') {
      filteredEmails = filteredEmails.filter(
        email => email.status === filters.status,
      );
    }

    if (filters.type && filters.type !== 'all') {
      filteredEmails = filteredEmails.filter(
        email => email.type === filters.type,
      );
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      const fromDate = new Date(from);
      const toDate = new Date(to);

      filteredEmails = filteredEmails.filter(email => {
        const emailDate = new Date(email.timestamp);
        return emailDate >= fromDate && emailDate <= toDate;
      });
    }

    // Convertir a CSV (mismo código que en GET)
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

    const csvRows = filteredEmails.map(email => [
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
    const filename = `emails-fallidos-filtrados-${timestamp}.csv`;

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
    console.error('Error exporting filtered emails:', error);

    return NextResponse.json(
      {
        error: 'Error al exportar los emails filtrados',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
}
