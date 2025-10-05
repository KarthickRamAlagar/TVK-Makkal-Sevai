// hooks/usePagination.js
import { useMemo, useState } from "react";

export default function usePagination(items = [], perPage = 7) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((items?.length || 0) / perPage));

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return (items || []).slice(start, start + perPage);
  }, [items, currentPage, perPage]);

  const setPage = (p) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    setCurrentPage(clamped);
  };

  const next = () => setPage(currentPage + 1);
  const prev = () => setPage(currentPage - 1);

  return { currentPage, totalPages, pageItems, setPage, next, prev, perPage };
}
