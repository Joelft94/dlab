"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReceipts, getReceiptFile } from "@/services/receipts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  RotateCw,
  ChevronDown,
  Check,
  X,
  Download,
  Share2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterMenu } from "@/components/receipts/filter-menu";
import { ActiveFilter } from "@/components/receipts/active-filter";
import { EmptyState } from "@/components/receipts/empty-state";
import { Badge } from "@/components/ui/badge";

interface Filter {
  id: string;
  value: any;
}

interface Receipt {
  id: string;
  type: string;
  employeeFullName: string;
  employeeNumber: string;
  fullDate: string;
  isSended: boolean;
  isReaded: boolean;
  isSigned: boolean;
  sendedDate: string | null;
  readedDate: string | null;
  signedDate: string | null;
}

interface ReceiptsResponse {
  numPages: number;
  totalCount: number;
  perPage: number;
  next: string | null;
  previous: string | null;
  results: Receipt[];
}

const getTimeAgo = (date: string | null) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
  if (days > 0) return `hace ${days} ${days === 1 ? "día" : "días"}`;
  if (hours > 0) return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
};

export default function ReceiptsPage() {
  const [sortOrder, setSortOrder] = useState<"Más recientes" | "Más antiguos">(
    "Más recientes"
  );
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [page, setPage] = useState(1);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(
    null
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery<ReceiptsResponse>({
    queryKey: ["receipts", sortOrder, search, activeFilters, page],
    queryFn: () =>
      getReceipts({
        ordering: sortOrder === "Más recientes" ? "-createdAt" : "createdAt",
        search,
        ...activeFilters.reduce(
          (acc, filter) => ({
            ...acc,
            [filter.id]: filter.value,
          }),
          {}
        ),
        page,
      }),
  });

  const {
    data: receiptPdf,
    isLoading: isPdfQueryLoading,
    error: pdfError,
  } = useQuery({
    queryKey: ["receipt-pdf", selectedReceiptId],
    queryFn: async () => {
      if (!selectedReceiptId) return null;
      setIsPdfLoading(true);
      try {
        console.log("Making PDF request for ID:", selectedReceiptId);
        const result = await getReceiptFile(selectedReceiptId); // Removed Number() conversion
        console.log("PDF API Response:", result);
        return result;
      } catch (error) {
        console.error("PDF fetch error:", error);
        throw error;
      } finally {
        setIsPdfLoading(false);
      }
    },
    enabled: !!selectedReceiptId,
    onSuccess: (data) => {
      console.log("PDF success data:", data);
      if (data?.file) {
        setPdfUrl(data.file);
      }
    },
  });

  const handleAddFilter = (id: string) => {
    if (!activeFilters.find((f) => f.id === id)) {
      setActiveFilters([...activeFilters, { id, value: null }]);
    }
  };

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== id));
  };

  const handleFilterValueChange = (id: string, value: any) => {
    setActiveFilters(
      activeFilters.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  const handleReceiptClick = async (receiptId: string) => {
    console.log("Receipt clicked:", {
      id: receiptId,
      type: typeof receiptId,
    });
    setSelectedReceiptId(receiptId);
  };
  const handleClosePdf = () => {
    setSelectedReceiptId(null);
    setPdfUrl(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-white">
            Lista de recibos
          </h1>
          <Badge
            variant="default"
            className="bg-[#4880F8] text-white rounded-full h-6 min-w-[1.5rem] flex items-center justify-center"
          >
            {data?.totalCount || 0}
          </Badge>
        </div>
        <Button
          onClick={() => refetch()}
          className="bg-[#4880F8] hover:bg-[#4880F8]/90 text-white"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          REFRESCAR LISTA DE RECIBOS
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden bg-[#1E1E1E] border border-gray-800">
        {/* Filters */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Ordenar por</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-transparent p-0"
                  >
                    {sortOrder}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-[#1E1E1E] border-gray-800"
                >
                  <DropdownMenuItem
                    onClick={() => setSortOrder("Más recientes")}
                    className="text-gray-400 hover:text-white"
                  >
                    Más recientes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOrder("Más antiguos")}
                    className="text-gray-400 hover:text-white"
                  >
                    Más antiguos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <FilterMenu onAddFilter={handleAddFilter} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar recibos"
              className="pl-9 bg-[#2A2A2A] border-0 text-white w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="px-4 py-2 border-b border-gray-800 flex flex-wrap gap-4">
            {activeFilters.map((filter) => (
              <ActiveFilter
                key={filter.id}
                id={filter.id}
                value={filter.value}
                onValueChange={(value) =>
                  handleFilterValueChange(filter.id, value)
                }
                onRemove={() => handleRemoveFilter(filter.id)}
              />
            ))}
          </div>
        )}

        {/* Table or Empty State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4880F8]" />
          </div>
        ) : data?.results.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="min-h-[400px]">
            <table className="w-full">
              <thead className="bg-[#4880F8]">
                <tr>
                  <th className="text-left text-sm font-medium text-white p-4">
                    Tipo
                  </th>
                  <th className="text-left text-sm font-medium text-white p-4">
                    Empleado
                  </th>
                  <th className="text-left text-sm font-medium text-white p-4">
                    Fecha
                  </th>
                  <th className="text-left text-sm font-medium text-white p-4">
                    Enviado
                  </th>
                  <th className="text-left text-sm font-medium text-white p-4">
                    Leído
                  </th>
                  <th className="text-left text-sm font-medium text-white p-4">
                    Firmado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#1E1E1E]">
                {data?.results.map((receipt) => (
                  <tr
                    key={receipt.id}
                    onClick={() => handleReceiptClick(receipt.id)}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 cursor-pointer"
                  >
                    <td className="p-4 text-[#4880F8]">{receipt.type}</td>
                    <td className="p-4">
                      <div className="text-white">
                        {receipt.employeeFullName}
                      </div>
                      <div className="text-sm text-gray-400">
                        #{receipt.employeeNumber}
                      </div>
                    </td>
                    <td className="p-4 text-white">{receipt.fullDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {receipt.isSended ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-400">
                              {getTimeAgo(receipt.sendedDate)}
                            </span>
                          </>
                        ) : (
                          <X className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {receipt.isReaded ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-400">
                              {getTimeAgo(receipt.readedDate)}
                            </span>
                          </>
                        ) : (
                          <X className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {receipt.isSigned ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-400">
                              {getTimeAgo(receipt.signedDate)}
                            </span>
                          </>
                        ) : (
                          <X className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data && data.numPages > 1 && (
              <div className="p-4 flex justify-center items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 disabled:opacity-50"
                  disabled={!data.previous}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {"<"}
                </Button>
                <span className="text-gray-400">{page}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 disabled:opacity-50"
                  disabled={!data.next}
                  onClick={() => setPage((p) => Math.min(data.numPages, p + 1))}
                >
                  {">"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PDF Dialog */}
      <div
        className={`fixed inset-0 z-50 ${
          !!selectedReceiptId ? "block" : "hidden"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClosePdf}
        />

        {/* Dialog Content */}
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-4xl bg-[#1E1E1E] rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">
              Vista previa del recibo
            </h2>
          </div>

          {/* Content */}
          <div className="relative h-[70vh]">
            {isPdfLoading || isPdfQueryLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4880F8]" />
              </div>
            ) : pdfUrl ? (
              <>
                {console.log("Attempting to load PDF from URL:", pdfUrl)}
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-[calc(100%-60px)]"
                >
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    style={{ background: "white" }}
                  >
                    <p>
                      Your browser does not support PDFs.
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click here to download the PDF
                      </a>
                    </p>
                  </iframe>
                </object>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-[#1E1E1E] border-t border-gray-800">
                  <Button
                    variant="outline"
                    className="text-white border-gray-700 hover:bg-gray-800"
                    onClick={handleClosePdf}
                  >
                    CERRAR
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-[#4880F8] hover:text-[#4880F8]/90"
                      onClick={() => window.open(pdfUrl, "_blank")}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-[#4880F8] hover:text-[#4880F8]/90"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = pdfUrl;
                        link.download = "recibo.pdf";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                {pdfError ? (
                  <div>
                    <p>Error al cargar el PDF:</p>
                    <pre className="mt-2 text-red-500">
                      {JSON.stringify(pdfError, null, 2)}
                    </pre>
                  </div>
                ) : (
                  "Error al cargar el PDF"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
