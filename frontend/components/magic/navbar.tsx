"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserRoundIcon } from "lucide-react";
import { useState } from "react";

export default function Navbar({
    openModal,
    home = false,
  }: Readonly<{ openModal: () => void; home?: boolean }>) {
  const goToSignup = () => {
    window.location.href = "/";
  };
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-16 px-10 items-center justify-between border-b sticky top-0 z-[999] bg-white"
    >
      <div className="flex items-center gap-6 font-oddlini justify-center mt-0.5">
        <Link href="/" className="text-2xl font-semibold font-oddlini">
          Virsitile
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <button
            
            onClick={home ? openModal : goToSignup}
          className="text-sm font-medium bg-foreground text-background px-4 py-2 pt-2.5 rounded-lg flex items-center justify-center font-oddlini hover:bg-foreground/80"
        >
          <UserRoundIcon className="size-3 mr-2 mb-0.5" />
          Sign up
        </button>
      </div>
    </motion.div>
  );
}
