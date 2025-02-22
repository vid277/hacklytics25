"use client";
import Navbar from "./magic/navbar";

export default function Header() {
  return (
    <>
      <Navbar openModal={() => {}} />
      <div className="flex flex-col gap-16 items-center">
        <h1 className="text-4xl font-bold">Hacklytics 2025</h1>
        <p className="text-2xl">The hackathon for the future of analytics</p>
      </div>
    </>
  );
}
