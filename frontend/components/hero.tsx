"use client";
import Navbar from "./magic/navbar";
import { useState } from "react";
import Hero from "@/pages/hero";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return { isModalOpen, openModal, closeModal };
};

export default function Home() {
  return (
    <div className="scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <Navbar home={true} />
      <Hero />
    </div>
  );
}
