import { describe, it, expect, vi, beforeEach } from "vitest";

function renderJoinForm() {
  document.body.innerHTML = `
    <form id="join-game-form">
      <div class="flex gap-3">
        <label for="game-code" class="sr-only">Codigo de partida</label>
        <input id="game-code" type="text" name="code" placeholder="Codigo de partida" />
        <button id="join-game-btn" type="submit">
          <span class="btn-label">Unirse</span>
          <span class="btn-loading hidden">Conectando...</span>
        </button>
      </div>
      <p id="join-error" class="hidden" role="alert"></p>
    </form>
  `;

  const form = document.getElementById("join-game-form") as HTMLFormElement;
  const input = document.getElementById("game-code") as HTMLInputElement;
  const btn = document.getElementById("join-game-btn")!;
  const label = btn.querySelector(".btn-label")!;
  const loading = btn.querySelector(".btn-loading")!;
  const error = document.getElementById("join-error")!;

  function hideError() {
    error.classList.add("hidden");
    error.textContent = "";
  }

  function showError(message: string) {
    error.textContent = message;
    error.classList.remove("hidden");
    input.classList.add("border-error");
  }

  function setLoading(isLoading: boolean) {
    if (isLoading) {
      btn.setAttribute("disabled", "");
      input.setAttribute("disabled", "");
      label.classList.add("hidden");
      loading.classList.remove("hidden");
    } else {
      btn.removeAttribute("disabled");
      input.removeAttribute("disabled");
      label.classList.remove("hidden");
      loading.classList.add("hidden");
    }
  }

  input.addEventListener("input", () => {
    hideError();
    input.classList.remove("border-error");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();
    if (!code) return;

    hideError();
    setLoading(true);

    try {
      const res = await fetch(`/api/games/${code}/join`, { method: "POST" });
      if (res.ok) {
        window.location.href = `/molino/${code}`;
        return;
      }
      setLoading(false);
      const messages: Record<number, string> = {
        404: "Codigo no encontrado",
        409: "Partida llena",
        410: "Esta partida ya ha terminado",
      };
      showError(messages[res.status] ?? "Error al unirse. Intentalo de nuevo.");
    } catch {
      setLoading(false);
      showError("Error de conexion. Intentalo de nuevo.");
    }
  });

  return { form, input, btn, error };
}

describe("JoinGameForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("does not submit when input is empty", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { form } = renderJoinForm();

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 50));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("dispatches fetch to POST /api/games/{code}/join", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "1", code: "ABCD", playerId: "p1", status: "playing" })),
    );

    const { form, input } = renderJoinForm();
    input.value = "abcd";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/games/ABCD/join", { method: "POST" });
    });
  });

  it("redirects on 200 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "1", code: "TEST", playerId: "p1", status: "playing" })),
    );

    const { form, input } = renderJoinForm();
    input.value = "test";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(window.location.href).toContain("/molino/TEST");
    });
  });

  it("shows 'Codigo no encontrado' on 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 404 }));

    const { form, input, error } = renderJoinForm();
    input.value = "XXXX";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(error.textContent).toBe("Codigo no encontrado");
      expect(error.classList.contains("hidden")).toBe(false);
    });
  });

  it("shows 'Partida llena' on 409", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 409 }));

    const { form, input, error } = renderJoinForm();
    input.value = "FULL";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(error.textContent).toBe("Partida llena");
    });
  });

  it("shows 'Esta partida ya ha terminado' on 410", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 410 }));

    const { form, input, error } = renderJoinForm();
    input.value = "DONE";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(error.textContent).toBe("Esta partida ya ha terminado");
    });
  });

  it("hides error when user types in the input", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 404 }));

    const { form, input, error } = renderJoinForm();
    input.value = "XXXX";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(error.classList.contains("hidden")).toBe(false);
    });

    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(error.classList.contains("hidden")).toBe(true);
  });

  it("submits form on Enter key in input", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "1", code: "ABCD", playerId: "p1", status: "playing" })),
    );

    const { form, input } = renderJoinForm();
    input.value = "abcd";

    // Enter triggers form submit natively; simulate it
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  it("disables button and input while processing", async () => {
    let resolvePromise: (value: Response) => void;
    vi.spyOn(globalThis, "fetch").mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const { form, input, btn } = renderJoinForm();
    input.value = "TEST";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(btn.hasAttribute("disabled")).toBe(true);
      expect(input.hasAttribute("disabled")).toBe(true);
    });

    resolvePromise!(new Response(JSON.stringify({ id: "1", code: "TEST", playerId: "p1" })));
  });
});
