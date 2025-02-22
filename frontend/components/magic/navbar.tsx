"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserRoundIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/actions";

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <motion.div className="flex h-16 px-10 items-center justify-between border-b sticky top-0 z-[999] bg-white">
      <div className="flex items-center gap-6 font-oddlini justify-center mt-0.5">
        <Link href="/" className="text-2xl font-semibold font-oddlini">
          Hacklytics 2025
        </Link>
      </div>
      <div className="flex items-center justify-center gap-4">
        {user ? (
          <form action={signOut}>
            <button className="text-sm font-medium border border-foreground text-foreground px-4 py-2 pt-2.5 rounded-lg flex items-center justify-center font-oddlini hover:bg-foreground/5">
              Sign Out
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium border border-foreground text-foreground px-4 py-2 pt-2.5 rounded-lg flex items-center justify-center font-oddlini hover:bg-foreground/5"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-foreground text-background px-4 py-2 pt-2.5 rounded-lg flex items-center justify-center font-oddlini hover:bg-foreground/80"
            >
              <UserRoundIcon className="size-3 mr-2 mb-0.5" />
              Sign up
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
