/** @vitest-environment jsdom */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Calculator from "./Calculator";

describe("Calculator", () => {
  let originalRAF: typeof globalThis.requestAnimationFrame;
  let originalCancelRAF: typeof globalThis.cancelAnimationFrame;

  // Make the count-up animation deterministic by completing immediately
  beforeAll(() => {
    originalRAF = globalThis.requestAnimationFrame;
    originalCancelRAF = globalThis.cancelAnimationFrame;

    globalThis.requestAnimationFrame = (
      callback: FrameRequestCallback
    ): number => {
      const id = setTimeout(
        () => callback(performance.now() + 1000),
        0
      ) as unknown as number;
      return id;
    };
    globalThis.cancelAnimationFrame = (id: number) => {
      clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    };
  });

  afterAll(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCancelRAF;
  });

  it("renders, calculates rent, and enables search when city + income provided", async () => {
    render(<Calculator />);

    // Title is visible
    expect(
      screen.getByRole("heading", { name: /affordability calculator/i })
    ).toBeInTheDocument();

    // Initial helper prompt
    expect(
      screen.getByText(/enter your annual salary to start/i)
    ).toBeInTheDocument();

    // Enter annual income
    const incomeInput = screen.getByLabelText(/annual household income/i);
    fireEvent.change(incomeInput, { target: { value: "60000" } });

    // Wait for animated value to settle to ~£2,000
    await waitFor(() => {
      expect(screen.getByText(/£\s?2,000/)).toBeInTheDocument();
    });

    // Select a city
    const citySelect = screen.getByLabelText(
      /where are you looking to rent\?/i
    );
    fireEvent.change(citySelect, { target: { value: "London" } });

    // Button should now be enabled and show "Search now"
    const button = screen.getByRole("button", { name: /search now/i });
    expect(button).toBeEnabled();

    // Bills info visible with a London estimate (~£300)
    const bills = screen.getByText(/plus monthly bills for a 2-bed/i);
    expect(bills).toHaveTextContent("£300");
  });
});
