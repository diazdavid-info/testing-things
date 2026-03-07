import { describe, it, expect, vi, beforeEach } from "vitest";

function renderWaitingRoom(code = "AB3K") {
  const url = `http://localhost/molino/${code}`;
  document.body.innerHTML = `
    <div>
      <h1>Tu partida esta lista</h1>
      <span id="game-code">${code}</span>
      <button id="copy-link-btn" data-url="${url}">
        <span class="copy-icon"></span>
        <span class="check-icon hidden"></span>
        <span class="btn-label">Copiar link</span>
      </button>
      <button id="copy-code-btn" data-code="${code}">
        <span class="copy-icon"></span>
        <span class="check-icon hidden"></span>
        <span class="btn-label">Copiar codigo</span>
      </button>
      <div id="waiting-indicator">
        <span></span>
        <span id="waiting-text">Esperando jugador...</span>
      </div>
    </div>
  `;

  function setupCopyButton(btnId: string, textToCopy: string) {
    const btn = document.getElementById(btnId)!;
    const label = btn.querySelector(".btn-label")!;
    const copyIcon = btn.querySelector(".copy-icon")!;
    const checkIcon = btn.querySelector(".check-icon")!;
    const originalText = label.textContent;

    btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(textToCopy);
      label.textContent = "Copiado!";
      copyIcon.classList.add("hidden");
      checkIcon.classList.remove("hidden");

      setTimeout(() => {
        label.textContent = originalText;
        copyIcon.classList.remove("hidden");
        checkIcon.classList.add("hidden");
      }, 2000);
    });
  }

  const copyLinkBtn = document.getElementById("copy-link-btn")!;
  const copyCodeBtn = document.getElementById("copy-code-btn")!;
  setupCopyButton("copy-link-btn", copyLinkBtn.dataset.url!);
  setupCopyButton("copy-code-btn", copyCodeBtn.dataset.code!);

  return { copyLinkBtn, copyCodeBtn };
}

describe("WaitingRoom", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
    const clipboardMock = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.defineProperty(navigator, "clipboard", {
      value: clipboardMock,
      writable: true,
      configurable: true,
    });
  });

  it("shows the game code on screen", () => {
    renderWaitingRoom("XY9Z");
    expect(document.getElementById("game-code")!.textContent).toBe("XY9Z");
  });

  it("shows waiting indicator", () => {
    renderWaitingRoom();
    expect(document.getElementById("waiting-text")!.textContent).toBe(
      "Esperando jugador...",
    );
  });

  it("copies the URL when clicking Copiar link", async () => {
    const { copyLinkBtn } = renderWaitingRoom("AB3K");
    copyLinkBtn.click();

    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "http://localhost/molino/AB3K",
      );
    });
  });

  it("copies the code when clicking Copiar codigo", async () => {
    const { copyCodeBtn } = renderWaitingRoom("AB3K");
    copyCodeBtn.click();

    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("AB3K");
    });
  });

  it("shows Copiado! feedback and reverts after 2s", async () => {
    vi.useFakeTimers();
    const { copyLinkBtn } = renderWaitingRoom();
    const label = copyLinkBtn.querySelector(".btn-label")!;

    copyLinkBtn.click();
    await vi.advanceTimersByTimeAsync(0);

    expect(label.textContent).toBe("Copiado!");

    vi.advanceTimersByTime(2000);
    expect(label.textContent).toBe("Copiar link");

    vi.useRealTimers();
  });
});
