import { useMemo } from "react";

export default function usePlaceholder(number: number) {
  const placeholder = useMemo(() => {
    return Array.from({ length: number }).map((_, index) =>
      Object.create({ id: index })
    );
  }, []);

  return placeholder;
}
