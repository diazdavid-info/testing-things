import { describe, it, expect, vi, beforeEach } from "vitest";
import { getByText, getByRole } from "@testing-library/dom";

function renderCreateButton() {
  document.body.innerHTML = `
    <button id="create-game-btn" type="button">
      <span class="btn-label">Crear partida</span>
      <span class="btn-loading hidden">Creando...</span>
    </button>
    <p id="create-error" class="hidden" role="alert"></p>
  `;

  const btn = document.getElementById("create-game-btn")!;
  const label = btn.querySelector(".btn-label")!;
  const loading = btn.querySelector(".btn-loading")!;
  const error = document.getElementById("create-error")!;

  btn.addEventListener("click", async () => {
    if (btn.hasAttribute("disabled")) return;

    btn.setAttribute("disabled", "");
    label.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
      const res = await fetch("/api/games", { method: "POST" });
      if (!res.ok) throw new Error("Error creating game");
      const data = await res.json();
      window.location.href = `/molino/${data.code}`;
    } catch {
      btn.removeAttribute("disabled");
      label.classList.remove("hidden");
      loading.classList.add("hidden");
      error.textContent = "Error al crear la partida. Intentalo de nuevo.";
      error.classList.remove("hidden");
    }
  });

  return { btn, label, loading, error };
}

describe("CreateGameButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("dispatches fetch to POST /api/games on click", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "1", code: "ABCD", playerId: "p1" })),
    );

    const { btn } = renderCreateButton();
    btn.click();

    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/games", { method: "POST" });
    });
  });

  it("disables button while processing", async () => {
    let resolvePromise: (value: Response) => void;
    vi.spyOn(globalThis, "fetch").mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const { btn } = renderCreateButton();
    btn.click();

    expect(btn.hasAttribute("disabled")).toBe(true);
    expect(btn.querySelector(".btn-loading")!.classList.contains("hidden")).toBe(false);

    resolvePromise!(new Response(JSON.stringify({ id: "1", code: "ABCD", playerId: "p1" })));
  });

  it("redirects to correct URL on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "1", code: "TEST", playerId: "p1" })),
    );

    const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "",
    });

    const { btn } = renderCreateButton();
    btn.click();

    await vi.waitFor(() => {
      expect(window.location.href).toBe(`/molino/TEST`);
    });
  });

  it("shows error message on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const { btn, error } = renderCreateButton();
    btn.click();

    await vi.waitFor(() => {
      expect(error.classList.contains("hidden")).toBe(false);
      expect(error.textContent).toContain("Error al crear la partida");
    });
  });
});
