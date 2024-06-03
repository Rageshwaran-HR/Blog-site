import React from "react";
import styles from "./pagination.module.css";

const Pagination = ({ page, totalPosts, postsPerPage, onPageChange }) => {
  const handleNext = () => {
    onPageChange(page + 1);
  };

  const handlePrev = () => {
    onPageChange(page - 1);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={page === 1}
        onClick={handlePrev}
      >
        Previous
      </button>
      <button
        disabled={page === Math.ceil(totalPosts / postsPerPage)}
        className={styles.button}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
