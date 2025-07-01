import React from "react";
import { Pagination as NextUIPagination } from "@heroui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center py-4 sm:py-6 sticky bottom-0 bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900 dark:to-transparent">
      <NextUIPagination
        showControls
        showShadow
        className="sm:scale-110"
        classNames={{
          wrapper: "gap-0 xs:gap-1 sm:gap-2",
          item: "w-8 h-8 sm:w-10 sm:h-10",
          cursor: "bg-primary text-white font-semibold",
        }}
        color="primary"
        page={currentPage}
        size="sm"
        total={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
};

export default Pagination;
