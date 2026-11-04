// src/pages/dashboard/logs/ActivityLogsPage.tsx
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineClipboardList,
  HiSortAscending,
  HiSortDescending,
} from "react-icons/hi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineExclamationTriangle,
  HiOutlineCalendar,
  HiOutlineTag,
} from "react-icons/hi2";
import debounce from "lodash.debounce";
import { HeaderDashboard } from "../../components/HeaderDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { useActivityLogs, type LogSortColumn } from "@/hooks/use-activity-log";

type SortOrder = "asc" | "desc" | null;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ActivityLogsPage = () => {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<LogSortColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: currentUser } = useUser();

  const queryParams = {
    page,
    per_page: 10,
    search: search || undefined,
    sort_by: sortColumn || undefined,
    ...(sortOrder !== null && { order: sortOrder }),
  };

  const { logs, isLoading, error, meta } = useActivityLogs(queryParams);

  // Debounce recherche
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  // Tri colonne
  const handleSort = (column: LogSortColumn) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortOrder("asc");
    } else {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortColumn(null);
        setSortOrder(null);
      }
    }
  };

  const getSortIcon = (column: LogSortColumn) => {
    if (sortColumn !== column) return <HiSortAscending className="w-4 h-4 opacity-40" />;
    if (sortOrder === "asc") return <HiSortAscending className="w-4 h-4 text-red-500" />;
    if (sortOrder === "desc") return <HiSortDescending className="w-4 h-4 text-red-500" />;
    return <HiSortAscending className="w-4 h-4 opacity-40" />;
  };

  // Pagination
  const lastPage = meta?.last_page ?? 1;
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) setPage(newPage);
  };

  // Pages à afficher (max 5 autour de la page courante)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(lastPage, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeaderDashboard
        icon={<HiOutlineClipboardList className="w-8 h-8 text-red-600" />}
        title="Dashboard IUC Projecteur"
        role={currentUser?.role}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* En-tête de section */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <HiOutlineExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Journal d'activité
              </h1>
              {meta && (
                <p className="text-sm text-gray-500">
                  {meta.total} entrée{meta.total > 1 ? "s" : ""} au total
                </p>
              )}
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative w-full sm:w-80">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="logs-search"
              type="text"
              placeholder="Rechercher par titre ou description..."
              className="pl-10"
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Contenu */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-12 flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
              <span className="text-sm">Chargement des journaux...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <HiOutlineExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-600 font-medium">Erreur de chargement</p>
              <p className="text-sm text-gray-500 mt-1">{(error as Error).message}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-12 flex flex-col items-center gap-3 text-gray-400">
                <HiOutlineClipboardList className="w-12 h-12 opacity-30" />
                <p className="text-sm">Aucun journal trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10">
                        #
                      </th>

                      {/* Titre */}
                      <th
                        id="sort-title"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-800 transition-colors"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-2">
                          <HiOutlineTag className="w-4 h-4" />
                          Titre {getSortIcon("title")}
                        </div>
                      </th>

                      {/* Description */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>

                      {/* Date */}
                      <th
                        id="sort-date"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-800 transition-colors whitespace-nowrap"
                        onClick={() => handleSort("created_at")}
                      >
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar className="w-4 h-4" />
                          Date {getSortIcon("created_at")}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log, index) => {
                      const isExpanded = expandedId === log.id;
                      const rowNumber = (page - 1) * 10 + index + 1;
                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-red-50/40 transition-colors cursor-pointer group"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : log.id)
                          }
                        >
                          {/* Numéro */}
                          <td className="px-4 py-4 text-xs text-gray-400 font-mono">
                            {rowNumber}
                          </td>

                          {/* Titre */}
                          <td className="px-6 py-4 max-w-[220px]">
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                              <span className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">
                                {log.title}
                              </span>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="px-6 py-4 max-w-[400px]">
                            <p
                              className={`text-sm text-gray-600 transition-all ${
                                isExpanded ? "" : "line-clamp-2"
                              }`}
                            >
                              {log.description}
                            </p>
                            {log.description.length > 120 && (
                              <span className="text-xs text-red-500 mt-1 inline-block">
                                {isExpanded ? "Réduire ▲" : "Voir plus ▼"}
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-mono">
                              {formatDate(log.created_at)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/60">
                    <p className="text-sm text-gray-500">
                      Page <span className="font-semibold text-gray-700">{page}</span>{" "}
                      sur <span className="font-semibold text-gray-700">{lastPage}</span>
                      {meta && (
                        <span className="ml-2 text-gray-400">
                          — {meta.total} résultat{meta.total > 1 ? "s" : ""}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-1">
                      <Button
                        id="pagination-prev"
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); goToPage(page - 1); }}
                        disabled={page === 1}
                        className="gap-1"
                      >
                        <HiOutlineChevronLeft className="w-4 h-4" />
                        Précédent
                      </Button>

                      <div className="flex gap-1">
                        {getPageNumbers().map((p) => (
                          <Button
                            key={p}
                            id={`pagination-page-${p}`}
                            variant={p === page ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); goToPage(p); }}
                            className={p === page ? "bg-red-600 hover:bg-red-700 border-red-600" : ""}
                          >
                            {p}
                          </Button>
                        ))}
                      </div>

                      <Button
                        id="pagination-next"
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); goToPage(page + 1); }}
                        disabled={page === lastPage}
                        className="gap-1"
                      >
                        Suivant
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
