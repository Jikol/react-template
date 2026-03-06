import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import type { Draft } from "immer";
import { produce } from "immer";
import type { WritableAtom } from "jotai/index";
import { getDefaultStore } from "jotai/index";
import isEqual from "lodash.isequal";
import React from "react";
import type { ErrorResponse, UIMatch } from "react-router-dom";
import { isRouteErrorResponse } from "react-router-dom";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to resolve class condition and conflicts with tailwind classes.
 * @author Shadcn
 * @website https://ui.shadcn.com/
 */
export const cn = (...inputs: Array<ClassValue>): string => {
  return twMerge(clsx(inputs));
};

/**
 * Utility function to wait amount of time as async promise.
 * @author Myself
 */
export const sleep = (delay: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Utility function to wrap multiple providers into managable array.
 * @author Sampath Katari
 * @website https://twitter.com/sampathkatari
 */
export const providers = (
  componentsWithProps: Array<[React.ElementType, Record<string, unknown>]>
): React.ElementType => {
  const initialComponent = ({
    children
  }: {
    children: Array<React.ReactNode>;
  }): React.ReactNode => {
    return React.createElement(React.Fragment, null, children);
  };

  return componentsWithProps.reduce(
    (
      AccumulatedComponents: React.ElementType,
      [Provider, props = {}]: [React.ElementType, Record<string, unknown>]
    ) => {
      // eslint-disable-next-line react/display-name
      return ({ children }: { children: Array<React.ReactNode> }): React.ReactNode => {
        return React.createElement(
          AccumulatedComponents,
          null,
          React.createElement(Provider, props, children)
        );
      };
    },
    initialComponent
  );
};

/**
 * Utility function to detect client user agent properties.
 * @author Stephanie Zhan
 * @website https://medium.com/geekculture/detecting-mobile-vs-desktop-browsers-in-javascript
 */
export const useragent = (): {
  isMobile: boolean;
} => {
  const isMobile =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent
    );

  return {
    isMobile
  };
};

/**
 * Helper function to determine error instance class.
 * @author Myself
 */
export const isResponseError = (err: unknown): err is ErrorResponse =>
  isRouteErrorResponse(err);

/**
 * Helper function to determine error instance class.
 * @author Myself
 */
export const isGenericPath = (matches: Array<UIMatch>): boolean =>
  matches.flatMap((match) => Object.keys(match.params)).some((item) => item === "*");

/**
 * Helper function to set state of jotai atom with immer produce only
 * if its necessary to avoid render loops
 * @author Myself
 */
export const safeAtomSet = <T extends object | string | number>(
  atomValue: WritableAtom<T, Array<T>, void>,
  value: T
): void => {
  const store = getDefaultStore();

  if (!isEqual(store.get(atomValue), value)) {
    store.set(
      atomValue,
      produce(store.get(atomValue), (draft: Draft<T>) => {
        Object.assign(draft, value);
      })
    );
  }
};

/**
 * Helper function to set react map loop key
 * @author Myself
 */
export const getKey = (id: string, index: number): string => {
  return `${id}-${index}`;
};
