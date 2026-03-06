declare global {
  namespace JSX {
    interface IntrinsicElements {
      "l-grid": {
        size?: string | number;
        color?: string | number;
        speed?: string | number;
      };
    }
  }
}

export {};
