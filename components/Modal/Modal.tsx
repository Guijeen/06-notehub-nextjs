"use client";

import { useEffect, useSyncExternalStore } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// const modalRoot = document.getElementById("modal-root") || document.body;

// export default function Modal({ isOpen, onClose, children }: ModalProps) {
// useEffect(() => {
//   if (!isOpen) return;

//   const originalStyle = window.getComputedStyle(document.body).overflow;
//   document.body.style.overflow = "hidden";

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (e.key === "Escape") onClose();
//   };

//   window.addEventListener("keydown", handleKeyDown);
//   return () => {
//     window.removeEventListener("keydown", handleKeyDown);
//     document.body.style.overflow = originalStyle;
//   };
// }, [isOpen, onClose]);

// if (!isOpen) return null;

// Заглушки підписки для useSyncExternalStore
const subscribe = () => () => {};
const getSnapshot = () => true; // У браузері (на клієнті) завжди true
const getServerSnapshot = () => false; // На сервері (SSR) завжди false

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Хук поверне false під час рендерингу на сервері, і true після гідратації у браузері.
  // Це повністю замінює комбінацію useState + useEffect(setMounted(true)).
  const isMounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, onClose]);

  // Якщо ми ще не змонтувалися в браузері або модалка закрита — нічого не рендеримо
  if (!isMounted || !isOpen) return null;

  // Оскільки ми вже 100% на клієнті (isMounted === true), ми можемо безпечно звертатися до document
  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}
