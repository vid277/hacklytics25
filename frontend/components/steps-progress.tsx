"use client";

import { usePathname } from "next/navigation";

const steps = [
  { name: "Sign Up", path: "/sign-up" },
  { name: "Sign In", path: "/sign-in" },
  { name: "Upload", path: "/create" },
];

export function StepsProgress() {
  const pathname = usePathname();

  let currentStepIndex = steps.findIndex((step) => step.path === pathname);

  if (pathname === "/sign-in") {
    currentStepIndex = 1;
  } else if (pathname === "/create") {
    currentStepIndex = 2;
  }
  if (currentStepIndex === -1) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-center items-center gap-4 bg-background/80 backdrop-blur-sm py-2 px-4 rounded-lg mx-auto w-fit">
        {steps.map((step, index) => (
          <div key={step.name} className="flex items-center">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 ease-in-out
              ${
                index === currentStepIndex
                  ? "border-primary bg-primary text-background"
                  : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <div className="ml-2 text-sm font-hanken">{step.name}</div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-[2px] mx-2 transition-all duration-300 ease-in-out
                ${index === currentStepIndex ? "bg-primary" : "bg-muted-foreground"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
