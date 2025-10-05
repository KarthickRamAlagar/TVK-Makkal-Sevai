import { useState, useCallback } from "react";

const defaultFilters = {
  status: [],
  feedback: [],
  taluk: [],
  department: [],
  dateRange: null,
};

export const useDistrictFilters = (initial = {}) => {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initial });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilter = useCallback((key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: defaultFilters[key],
    }));
  }, []);

  const resetAll = useCallback(() => {
    setFilters({ ...defaultFilters });
  }, []);

  const getActiveFilters = useCallback(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object" && value !== null)
          return Object.keys(value).length > 0;
        return !!value;
      })
    );
  }, [filters]);

  const isFilterActive = useCallback(
    (key) => {
      const value = filters[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null)
        return Object.keys(value).length > 0;
      return !!value;
    },
    [filters]
  );

  return {
    filters,
    setFilter,
    resetFilter,
    resetAll,
    getActiveFilters,
    isFilterActive,
  };
};
