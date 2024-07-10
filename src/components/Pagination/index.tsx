import { useState } from "react";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";

interface Props {
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalItems, itemsPerPage, onPageChange }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageClick(index + 1)}
          className={currentPage === index + 1 ? `${styles.active} ` : `${styles.inactive}`}
        >
          {index + 1}
        </button>
      ))}
      <div onClick={nextClick}>
        <Icon name='arrow_right_pagination' strokeColor='#7f7f7f' viewBox='0 -3 15 15' className='cursor_pointer' />
      </div>
    </div>
  );
};
export default Pagination;
