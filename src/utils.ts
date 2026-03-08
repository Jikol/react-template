import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to resolve class condition and conflicts with tailwind classes.
 */
export const cn = (...inputs: Array<ClassValue>): string => {
  return twMerge(clsx(inputs));
};

/**
 * Utility function to wait the amount of time as async promise.
 */
export const sleep = (delay: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Utility function to wrap multiple mergeProviders into a managable array.
 */
export const mergeProviders = (
  componentsWithProps: Array<[React.ComponentType, Record<string, unknown>]>
): React.FC<{ children: React.ReactNode }> => {
  return ({ children }: { children: React.ReactNode }) => {
    return componentsWithProps.reduceRight((kids, [provider, props = {}]) => {
      return React.createElement(provider, props, kids);
    }, children);
  };
};

/**
 * Utility function to detect client user agent properties.
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const nav = navigator as Navigator & { userAgentData?: { mobile: boolean } };
  const isMobile = nav.userAgentData?.mobile ?? navigator.userAgent.includes("Mobi");
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  return isMobile || isTouch;
};
