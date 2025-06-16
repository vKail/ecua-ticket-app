"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  currentStep: number;
  steps: {
    title: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export function Steps({ currentStep, steps, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-center">
        <ol className="flex w-full items-center">
          {steps.map((step, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center",
                index < steps.length - 1 ? "flex-1" : ""
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    index < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground/30 bg-background text-muted-foreground/30"
                  )}
                >
                  {step.icon || index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 hidden text-xs font-medium sm:block",
                    index <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground/30"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-full transition-colors",
                    index < currentStep
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
