"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { InteractiveGridPattern } from "../components/magic/magic-background-grid";
import { AnimatedShinyText } from "../components/magic/magic-shiny-text";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center px-44 gap-2 z-[99]">
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              "group rounded-full border bg-white border-black/10 text-base text-black transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 mb-4",
            )}
          >
            <AnimatedShinyText className="inline-flex font-hanken items-center justify-center px-4 py-1 transition ease-in-out">
              <span>✨ Sign up now for a free 14 day trial</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-7xl font-oddlini text-center leading-[1.25]"
          >
            The tech news you need, <br /> made{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              simple.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl font-hanken text-center text-neutral-600 w-3/4"
          >
            The modern standard for staying up-to-date with everything tech.{" "}
            <br />
            Simple, personalized, and uniquely yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-4 mt-5"
          >
            <Link href="/sign-up">
              <button className="text-sm font-medium bg-foreground text-background px-4 py-2 pt-2.5 rounded-lg flex items-center justify-center font-oddlini hover:bg-foreground/80">
                Get Started for Free
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="text-sm font-medium border border-foreground text-foreground px-4 py-2 pt-2.5 rounded-lg flex items-center justify-center font-oddlini hover:bg-foreground/5">
                Sign in
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 w-screen h-screen flex items-center justify-center">
        <InteractiveGridPattern
          className="opacity-30 w-screen [mask-image:radial-gradient(ellipse_at_center,_black_0%,_black_25%,_rgba(0,0,0,0.5)_40%,_transparent_75%)]"
          width={40}
          height={40}
          squares={[48, 32]}
          squaresClassName="hover:fill-purple-500"
        />
      </div>
    </div>
  );
}
