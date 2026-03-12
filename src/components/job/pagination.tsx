interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  disableNext: boolean;
}

const JobPagination = ({
  page,
  totalPages,
  onPrev,
  onNext,
  disableNext,
}: PaginationProps) => (
  <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4 bg-white">
    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
      Page {page} of {totalPages || 1}
    </div>

    <div className="flex gap-2">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-4 py-2 text-sm cursor-pointer font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={disableNext}
        className="px-4 py-2 cursor-pointer text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
);

export default JobPagination;
