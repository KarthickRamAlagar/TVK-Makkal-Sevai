import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "default",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (totalPages <= 1) return null;

  const baseClass =
    variant === "red"
      ? "text-red-500 hover:text-red-700 font-bold text-xl md:text-2xl transition-colors duration-200"
      : "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-pink-500 text-xl md:text-2xl font-bold hover:text-green-400";

  const activeClass =
    variant === "red"
      ? "underline underline-offset-4 decoration-red-500"
      : "underline underline-offset-4 decoration-pink-500";

  const ellipsisClass = "text-white text-xl md:text-2xl font-bold";

  return (
    <Pagination>
      <PaginationContent>
        {isMobile ? (
          <>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage - 1);
                  }}
                  className={baseClass}
                />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === 1}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
                className={`${baseClass} ${currentPage === 1 ? activeClass : ""}`}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {currentPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis className={ellipsisClass} />
              </PaginationItem>
            )}

            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage);
                  }}
                  className={`${baseClass} ${activeClass}`}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis className={ellipsisClass} />
              </PaginationItem>
            )}

            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={currentPage === totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(totalPages);
                  }}
                  className={`${baseClass} ${currentPage === totalPages ? activeClass : ""}`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage + 1);
                  }}
                  className={baseClass}
                />
              </PaginationItem>
            )}
          </>
        ) : (
          <>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage - 1);
                  }}
                  className={baseClass}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === idx + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(idx + 1);
                  }}
                  className={`${baseClass} ${
                    currentPage === idx + 1 ? activeClass : ""
                  }`}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage + 1);
                  }}
                  className={baseClass}
                />
              </PaginationItem>
            )}
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
