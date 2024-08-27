import { useState } from "react";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";

interface Props {
  limit: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalItems, limit, onPageChange }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / limit);
  const siblingsCount = 1; // Número de páginas mostradas al lado de la página actual
  const siblingsCountOp = 3;

  const generatePagesArray = (from: number, to: number) => {
    return [...new Array(to - from)]
      .map((_, index) => {
        return from + index + 1;
      })
      .filter(page => page > 0);
  };

  const paginationArray = (() => {
    let previousPages = currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : [];
    let nextPages =
      currentPage < totalPages
        ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, totalPages))
        : [];

    if (currentPage > 16) {
      previousPages = generatePagesArray(currentPage - 1 - siblingsCountOp, currentPage - 1);
    }

    if (currentPage < 4) {
      nextPages = generatePagesArray(currentPage, Math.min(currentPage, totalPages));
    }
    return [...previousPages, currentPage, ...nextPages];
  })();

  const prevClick = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const nextClick = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className={styles.container}>
      <div onClick={prevClick}>
        <Icon name='arrow_left_pagination' strokeColor='#7f7f7f' viewBox='-2 -3 15 15' className='cursor_pointer' />
      </div>

      {/* Se muestra cuando la currentPage es 4 */}
      {currentPage > 1 + siblingsCount && (
        <>
          <button onClick={() => handlePageClick(1)} className={styles.inactive}>
            1
          </button>
          {currentPage > 2 + siblingsCount && <span className={styles.dots}>...</span>}
        </>
      )}

      {paginationArray.map(page => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={currentPage === page ? `${styles.active}` : `${styles.inactive}`}
        >
          {page}
        </button>
      ))}

      {/* Se muestra cuando la currentPage es min 16 */}
      {currentPage < totalPages - siblingsCount && (
        <>
          {currentPage < totalPages - 1 - siblingsCount && <span className={styles.dots}>...</span>}
          <button onClick={() => handlePageClick(totalPages)} className={styles.inactive}>
            {totalPages}
          </button>
        </>
      )}

      <div onClick={nextClick}>
        <Icon name='arrow_right_pagination' strokeColor='#7f7f7f' viewBox='0 -3 15 15' className='cursor_pointer' />
      </div>
    </div>
  );
};

export default Pagination;
