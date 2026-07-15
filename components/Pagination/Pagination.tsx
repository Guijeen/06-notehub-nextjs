// "use client";

// import css from "./Pagination.module.css";
// import ReactPaginateModule from "react-paginate";
// import type { ComponentType } from "react";
// import type { ReactPaginateProps } from "react-paginate";

// interface PaginationProps {
//   pageCount: number;
//   forcePage: number;
//   onPageChange: (selectedItem: { selected: number }) => void;
// }

// type ModuleWithDefault<T> = { default: T };

// const ReactPaginate = (
//   ReactPaginateModule as unknown as ModuleWithDefault<
//     ComponentType<ReactPaginateProps>
//   >
// ).default;

// export default function Pagination({
//   pageCount,
//   forcePage,
//   onPageChange,
// }: PaginationProps) {
//   return (
//     <ReactPaginate
//       previousLabel="&lt;"
//       nextLabel="&gt;"
//       breakLabel="..."
//       pageCount={pageCount}
//       marginPagesDisplayed={2}
//       pageRangeDisplayed={5}
//       onPageChange={onPageChange}
//       forcePage={forcePage}
//       containerClassName={css.pagination || "pagination"} // Використовуйте класи з вашого .module.css
//       activeClassName={css.active}
//       disabledClassName={css.disabled}
//     />
//   );
// }

// components/Pagination/Pagination.tsx
"use client";

import ReactPaginateModule from "react-paginate";
import css from "./Pagination.module.css";
import type { ComponentType } from "react";
import type { ReactPaginateProps } from "react-paginate";

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

interface PossibleESModule {
  default?: ComponentType<ReactPaginateProps>;
}

const ReactPaginate =
  (ReactPaginateModule as PossibleESModule).default || ReactPaginateModule;

export default function Pagination({
  pageCount,
  forcePage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel="&lt;"
      nextLabel="&gt;"
      breakLabel="..."
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={css.pagination || "pagination"}
      activeClassName={css.active}
      disabledClassName={css.disabled}
    />
  );
}
