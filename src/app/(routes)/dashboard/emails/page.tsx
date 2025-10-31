'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FailedEmail } from '@/types';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  LucideIcon,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EmailStats {
  total: number;
  sent: number;
  failed: number;
  retry: number;
  pending: number;
}

interface StatusInfo {
  color: string;
  icon: LucideIcon;
  label: string;
}

interface TypeInfo {
  label: string;
  icon: LucideIcon;
  color: string;
}

export default function EmailsPage() {
  const [allEmails, setAllEmails] = useState<FailedEmail[]>([]);
  const [failedEmails, setFailedEmails] = useState<FailedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    sent: 0,
    failed: 0,
    retry: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const fetchAllEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/emails/all');
      if (response.ok) {
        const data = await response.json();
        setAllEmails(data);

        // Filtrar emails fallidos
        const failed = data.filter((e: FailedEmail) => e.status === 'failed');
        setFailedEmails(failed);

        // Calcular estadísticas
        const newStats: EmailStats = {
          total: data.length,
          sent: data.filter((e: FailedEmail) => e.status === 'sent').length,
          failed: data.filter((e: FailedEmail) => e.status === 'failed').length,
          retry: data.filter((e: FailedEmail) => e.status === 'retry').length,
          pending: data.filter((e: FailedEmail) => e.status === 'pending')
            .length,
        };
        setStats(newStats);
      } else {
        toast.error('Error al cargar los emails');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Error al cargar los emails');
    } finally {
      setLoading(false);
    }
  };

  const retryEmail = async (emailId: string) => {
    setRetryingIds(prev => new Set(prev).add(emailId));
    try {
      const response = await fetch(`/api/dashboard/emails/failed/${emailId}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Email marcado para reintento');
        fetchAllEmails();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al reintentar el email');
      }
    } catch (error) {
      console.error('Error retrying email:', error);
      toast.error('Error al reintentar el email');
    } finally {
      setRetryingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(emailId);
        return newSet;
      });
    }
  };

  const deleteEmail = async (emailId: string) => {
    setDeletingIds(prev => new Set(prev).add(emailId));
    try {
      const response = await fetch(`/api/dashboard/emails/failed/${emailId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Email eliminado correctamente');
        fetchAllEmails();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar el email');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Error al eliminar el email');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(emailId);
        return newSet;
      });
    }
  };

  const exportAllEmails = async () => {
    try {
      toast.loading('Preparando exportación de todos los emails...');

      const response = await fetch('/api/dashboard/emails/all/export', {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al exportar los emails');
      }

      const contentDisposition = response.headers.get('content-disposition');
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `todos-los-emails-${new Date().toISOString().split('T')[0]}.csv`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success('Todos los emails exportados correctamente');
    } catch (error) {
      toast.dismiss();
      console.error('Error exporting all emails:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al exportar los emails',
      );
    }
  };

  const exportFailedEmails = async () => {
    try {
      toast.loading('Preparando exportación de emails fallidos...');

      const response = await fetch('/api/dashboard/emails/failed/export', {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al exportar los emails fallidos');
      }

      const contentDisposition = response.headers.get('content-disposition');
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `emails-fallidos-${new Date().toISOString().split('T')[0]}.csv`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success('Emails fallidos exportados correctamente');
    } catch (error) {
      toast.dismiss();
      console.error('Error exporting failed emails:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al exportar los emails fallidos',
      );
    }
  };

  const getStatusInfo = (status: string): StatusInfo => {
    switch (status) {
      case 'sent':
        return {
          color:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
          icon: CheckCircle,
          label: 'Enviado',
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: XCircle,
          label: 'Fallido',
        };
      case 'retry':
        return {
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
          icon: RefreshCw,
          label: 'Reintentando',
        };
      case 'pending':
        return {
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          icon: Clock,
          label: 'Pendiente',
        };
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          icon: AlertCircle,
          label: status,
        };
    }
  };

  const getTypeInfo = (type: string): TypeInfo => {
    switch (type) {
      case 'ORDER_CONFIRMATION':
        return {
          label: 'Confirmación',
          icon: FileText,
          color: 'bg-blue-100 text-blue-800',
        };
      case 'STATUS_UPDATE':
        return {
          label: 'Actualización',
          icon: RefreshCw,
          color: 'bg-purple-100 text-purple-800',
        };
      default:
        return {
          label: type,
          icon: Mail,
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const getCurrentEmails = () => {
    return activeTab === 'failed' ? failedEmails : allEmails;
  };

  const filteredEmails = getCurrentEmails().filter(email => {
    const matchesSearch =
      email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email.order?.orderNumber &&
        email.order.orderNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || email.status === statusFilter;
    const matchesType = typeFilter === 'all' || email.type === typeFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const emailDate = new Date(email.timestamp);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const toggleSelectAll = () => {
    if (selectedEmails.size === filteredEmails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredEmails.map(e => e.id)));
    }
  };

  const _toggleSelectEmail = (emailId: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Emails
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitorea todos los emails de notificación de pedidos
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportAllEmails} disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                Exportar todos los emails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportFailedEmails} disabled={loading}>
                <XCircle className="h-4 w-4 mr-2" />
                Exportar solo fallidos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={fetchAllEmails}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Emails
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Enviados
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.sent}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Fallidos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.failed}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <RefreshCw className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Reintentos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.retry}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pendientes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Selector de Vista con Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card
          className={`cursor-pointer transition-all border-2 ${
            activeTab === 'all'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600'
          }`}
          onClick={() => setActiveTab('all')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    activeTab === 'all'
                      ? 'bg-indigo-100 dark:bg-indigo-800'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Mail
                    className={`h-6 w-6 ${
                      activeTab === 'all'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      activeTab === 'all'
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Todos los Emails
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {allEmails.length} emails en total
                  </p>
                </div>
              </div>
              <Badge variant={activeTab === 'all' ? 'default' : 'secondary'}>
                {allEmails.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all border-2 ${
            activeTab === 'failed'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-red-300 dark:hover:border-red-600'
          }`}
          onClick={() => setActiveTab('failed')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    activeTab === 'failed'
                      ? 'bg-red-100 dark:bg-red-800'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <XCircle
                    className={`h-6 w-6 ${
                      activeTab === 'failed'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      activeTab === 'failed'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Emails Fallidos
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {failedEmails.length} emails con problemas
                  </p>
                </div>
              </div>
              <Badge
                variant={activeTab === 'failed' ? 'destructive' : 'secondary'}
              >
                {failedEmails.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido de la vista seleccionada */}
      <div className="space-y-6">
        {activeTab === 'all' && (
          <EmailListContent
            emails={filteredEmails}
            retryingIds={retryingIds}
            deletingIds={deletingIds}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
            toggleSelectAll={toggleSelectAll}
            retryEmail={retryEmail}
            deleteEmail={deleteEmail}
            getStatusInfo={getStatusInfo}
            getTypeInfo={getTypeInfo}
            showRetryButton={false}
          />
        )}

        {activeTab === 'failed' && (
          <EmailListContent
            emails={filteredEmails}
            retryingIds={retryingIds}
            deletingIds={deletingIds}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
            toggleSelectAll={toggleSelectAll}
            retryEmail={retryEmail}
            deleteEmail={deleteEmail}
            getStatusInfo={getStatusInfo}
            getTypeInfo={getTypeInfo}
            showRetryButton={true}
          />
        )}
      </div>
    </div>
  );
}

// Componente separado para el contenido de la lista de emails
interface EmailListContentProps {
  emails: FailedEmail[];
  retryingIds: Set<string>;
  deletingIds: Set<string>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  selectedEmails: Set<string>;
  setSelectedEmails: (value: Set<string>) => void;
  toggleSelectAll: () => void;
  retryEmail: (emailId: string) => Promise<void>;
  deleteEmail: (emailId: string) => Promise<void>;
  getStatusInfo: (status: string) => StatusInfo;
  getTypeInfo: (type: string) => TypeInfo;
  showRetryButton: boolean;
}

function EmailListContent({
  emails,
  retryingIds,
  deletingIds,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  selectedEmails,
  setSelectedEmails,
  toggleSelectAll,
  retryEmail,
  deleteEmail,
  getStatusInfo,
  getTypeInfo,
  showRetryButton,
}: EmailListContentProps) {
  // Función local para manejar la selección de emails
  const handleToggleSelectEmail = (emailId: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  return (
    <>
      {/* Filtros */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar emails..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="sent">Enviados</SelectItem>
              <SelectItem value="failed">Fallidos</SelectItem>
              <SelectItem value="retry">Reintentando</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="ORDER_CONFIRMATION">
                Confirmación de pedido
              </SelectItem>
              <SelectItem value="STATUS_UPDATE">
                Actualización de estado
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Lista de emails */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Historial de Emails ({emails.length})
          </h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={
                selectedEmails.size === emails.length && emails.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Seleccionar todos
            </span>
          </div>
        </div>

        {emails.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Intentos</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map(email => {
                  const statusInfo = getStatusInfo(email.status);
                  const StatusIcon = statusInfo.icon;
                  const typeInfo = getTypeInfo(email.type);
                  const TypeIcon = typeInfo.icon;
                  const isRetrying = retryingIds.has(email.id);
                  const isDeleting = deletingIds.has(email.id);

                  return (
                    <TableRow key={email.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmails.has(email.id)}
                          onCheckedChange={() =>
                            handleToggleSelectEmail(email.id)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.color}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${typeInfo.color}`}>
                            <TypeIcon className="h-3 w-3" />
                          </div>
                          <span className="text-sm">{typeInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{email.recipient}</p>
                          {email.error && (
                            <p className="text-xs text-red-600 dark:text-red-400 max-w-xs truncate">
                              {email.error}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/orders/${email.orderId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          #{email.order?.orderNumber || email.orderId.slice(-6)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {email.attempts}{' '}
                          {email.attempts === 1 ? 'intento' : 'intentos'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {new Date(email.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(email.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/emails/${email.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            {showRetryButton && email.status === 'failed' && (
                              <DropdownMenuItem
                                onClick={() => retryEmail(email.id)}
                                disabled={isRetrying}
                              >
                                {isRetrying ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Reintentando...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reintentar
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => deleteEmail(email.id)}
                              className="text-red-600"
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Eliminando...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay emails registrados
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Los emails de notificación aparecerán aquí cuando se envíen.
            </p>
          </div>
        )}
      </Card>
    </>
  );
}
