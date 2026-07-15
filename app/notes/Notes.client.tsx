"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import useDebounce from "../../hooks/useDebounce";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
// import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import css from "./NotesPage.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import dynamic from "next/dynamic";

const Pagination = dynamic(() => import("@/components/Pagination/Pagination"), {
  ssr: false,
  loading: () => <span style={{ color: "gray" }}>Loading pagination...</span>, // за бажанням, лоадер на час завантаження скрипта
});

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const debouncedSearch = useDebounce<string>(search, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p style={{ textAlign: "center" }}>Loading notes...</p>}
        {isError && (
          <p style={{ textAlign: "center", color: "red" }}>
            Error:{" "}
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        )}

        {data && <NoteList notes={data.notes} />}
      </main>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
