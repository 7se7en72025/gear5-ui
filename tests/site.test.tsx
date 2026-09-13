import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { HeroDemo } from "@/components/site/hero-demo";
import { Copyable } from "@/components/site/copyable";
import { RecoveryLab } from "@/components/site/recovery-lab";
import { CommandPalette } from "@/registry/gear5/ui/command-palette";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("homepage playground", () => {
  it("has an accessible initial state without taking focus", async () => {
    const { container } = render(<HeroDemo />);
    expect(screen.getByRole("heading", { name: "Your workspace" })).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
    expect(document.activeElement).toBe(document.body);
  });

  it("recovers from an error through loading to ready", async () => {
    vi.useFakeTimers();
    render(<HeroDemo />);
    fireEvent.click(screen.getByRole("button", { name: "error" }));
    expect(screen.getByText("The connection dropped. Give it another try.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByRole("button", { name: "loading" }).getAttribute("aria-pressed")).toBe("true");
    await act(async () => { vi.advanceTimersByTime(800); });
    expect(screen.getByRole("heading", { name: "Your workspace" })).toBeTruthy();
  });

  it("cancels an in-flight demo retry when a new state is chosen", async () => {
    vi.useFakeTimers();
    render(<HeroDemo />);
    fireEvent.click(screen.getByRole("button", { name: "error" }));
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    fireEvent.click(screen.getByRole("button", { name: "empty" }));
    await act(async () => { vi.advanceTimersByTime(800); });
    expect(screen.getByText("A fresh start. Your first project belongs here.")).toBeTruthy();
  });

  it("changes content and writing direction with the locale", () => {
    render(<HeroDemo />);
    fireEvent.change(screen.getByRole("combobox", { name: "Demo language" }), { target: { value: "ar-EG" } });
    const heading = screen.getByRole("heading", { name: "مساحة عملك" });
    expect(heading.closest("[lang]")?.getAttribute("dir")).toBe("rtl");
    expect(heading.closest("[lang]")?.getAttribute("lang")).toBe("ar-EG");
    fireEvent.click(screen.getByRole("button", { name: "error" }));
    expect(screen.getByRole("button", { name: "حاول مرة أخرى" })).toBeTruthy();
  });
});

describe("copyable snippets", () => {
  it("copies the exact value and gives feedback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<Copyable value="npm test" label="Copy command" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));
    await waitFor(() => expect(screen.getByText("Copied")).toBeTruthy());
    expect(writeText).toHaveBeenCalledWith("npm test");
  });

  it("explains the manual fallback when clipboard permission is denied", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    const { container } = render(<Copyable value="npm test" label="Copy command" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));
    await waitFor(() => expect(within(container).getByRole("status").textContent).toContain("Select the code"));
    expect(screen.getByText("npm test")).toBeTruthy();
  });
});

describe("recovery lab", () => {
  it("provides field feedback when the sample email is missing", async () => {
    render(<RecoveryLab />);
    fireEvent.click(screen.getByRole("button", { name: "Test submission" }));
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Sample email" }).getAttribute("aria-invalid")).toBe("true"));
  });

  it("can finish after a simulated sign-in without losing the draft", async () => {
    render(<RecoveryLab />);
    fireEvent.input(screen.getByRole("textbox", { name: "Sample email" }), { target: { value: "test@example.com" } });
    fireEvent.input(screen.getByLabelText("What are you building?"), { target: { value: "A sample project" } });
    fireEvent.click(screen.getByRole("radio", { name: "Session expired" }));
    fireEvent.click(screen.getByRole("button", { name: "Test submission" }));
    fireEvent.click(await screen.findByRole("button", { name: "Simulate sign-in" }));
    expect((screen.getByLabelText("What are you building?") as HTMLTextAreaElement).value).toBe("A sample project");
    fireEvent.click(screen.getByRole("button", { name: "Test submission" }));
    await waitFor(() => expect(screen.getByText("Demo submission confirmed")).toBeTruthy());
    expect(localStorage.getItem("gear5-ui:draft:gear5-application-lab")).toBeNull();
  });

  it("clears only this demo draft and resets its fields", () => {
    localStorage.setItem("unrelated", "keep");
    render(<RecoveryLab />);
    fireEvent.input(screen.getByRole("textbox", { name: "Sample email" }), { target: { value: "test@example.com" } });
    expect(localStorage.getItem("gear5-ui:draft:gear5-application-lab")).toContain("test@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Clear demo draft" }));
    expect((screen.getByRole("textbox", { name: "Sample email" }) as HTMLInputElement).value).toBe("");
    expect(localStorage.getItem("gear5-ui:draft:gear5-application-lab")).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("keep");
  });
});

describe("command palette", () => {
  it("exposes a named modal and a close control", async () => {
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} commands={[{ id: "one", label: "First component", onRun: vi.fn() }]} label="Find a component" />);
    const dialog = await screen.findByRole("dialog", { name: "Find a component" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close command palette" }));
    expect(onClose).toHaveBeenCalled();
  });
});
