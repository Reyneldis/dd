import Link from 'next/link';

export default function Pagination({
  page,
  pageSize,
  pageCount,
  total,
}: {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}) {
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const prevPage = page - 1;
  const nextPage = page + 1;

  const prevPageUrl = isFirstPage ? '#' : `?page=${prevPage}`;
  const nextPageUrl = isLastPage ? '#' : `?page=${nextPage}`;

  // Generar array de números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        <span>Mostrando {''} </span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {(page - 1) * pageSize + 1}
        </span>
        {''} a {''}
        <span className="font-semibold text-gray-900 dark:text-white">
          {Math.min(pageSize + page - 1, total)}
        </span>
        {''} de {''}
        <span className="font-semibold text-gray-900 dark:text-white">
          {total}
        </span>
        {''} Productos
      </span>

      <div className="flex items-center space-x-2">
        <Link
          href={prevPageUrl}
          className={`${
            isFirstPage ? 'pointer-events-none opacity-50' : ''
          } flex justify-center items-center
                   px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Anterior</span>
        </Link>

        {getPageNumbers().map(pageNum => (
          <Link
            key={pageNum}
            href={`?page=${pageNum}`}
            className={`flex justify-center items-center px-3 h-8 text-sm font-medium rounded-md transition-colors duration-200 ${
              pageNum === page
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {pageNum}
          </Link>
        ))}

        <Link
          href={nextPageUrl}
          className={`${
            isLastPage ? 'pointer-events-none opacity-50' : ''
          } flex justify-center items-center
                   px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
        >
          <span className="sr-only">Siguiente</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
