import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/image to render plain img
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill, priority, ...rest } = props;
    void fill;
    void priority;
    return <img {...rest} />;
  },
}));

// Mock framer-motion to render plain HTML
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => {
          // Return a forwardRef component that renders the plain HTML element
          return ({ children, ...props }: Record<string, unknown>) => {
            const Element = prop as keyof JSX.IntrinsicElements;
            // Strip framer-motion specific props
            const {
              initial, animate, exit, variants, transition, whileHover,
              whileTap, whileInView, layout, style, ...htmlProps
            } = props;
            void initial; void animate; void exit; void variants;
            void transition; void whileHover; void whileTap;
            void whileInView; void layout;
            return <Element style={style as React.CSSProperties} {...htmlProps}>{children as React.ReactNode}</Element>;
          };
        },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: (_value: unknown, _input: unknown, output: unknown[]) => output?.[0] ?? "",
    useMotionValue: (initial: number) => ({ get: () => initial, set: () => {} }),
    useSpring: (value: unknown) => value,
  };
});
