/** Isolate an overlay, contain keyboard focus, and restore it on close. */
export function containFocus(
  boundary: HTMLElement,
  onClose: () => void,
  initialFocus?: HTMLElement | null
) {
  const previous =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  const siblings: { element: HTMLElement; inert: boolean }[] = [];
  let branch: HTMLElement = boundary;
  while (branch.parentElement) {
    for (const sibling of branch.parentElement.children) {
      if (sibling instanceof HTMLElement && sibling !== branch) {
        siblings.push({ element: sibling, inert: sibling.inert });
        sibling.inert = true;
      }
    }
    if (branch.parentElement === document.body) break;
    branch = branch.parentElement;
  }

  const focusable = () =>
    Array.from(
      boundary.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex="0"]'
      )
    ).filter(
      (el) =>
        el.tabIndex >= 0 &&
        el.getClientRects().length > 0 &&
        getComputedStyle(el).visibility !== "hidden"
    );

  // Wait for the browser to apply the overlay's visibility and inert state.
  const focusFrame = requestAnimationFrame(() => {
    (initialFocus ?? focusable()[0] ?? boundary).focus({ preventScroll: true });
  });
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    } else if (event.key === "Tab") {
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) {
        event.preventDefault();
        boundary.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  boundary.addEventListener("keydown", onKey);
  return () => {
    cancelAnimationFrame(focusFrame);
    boundary.removeEventListener("keydown", onKey);
    siblings.forEach(({ element, inert }) => {
      element.inert = inert;
    });
    previous?.focus({ preventScroll: true });
  };
}
