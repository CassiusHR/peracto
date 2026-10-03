/** Run decorative WebGL loops only while visible and motion is enabled. */
export function createAnimationLoop(element: HTMLElement, draw: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  let disposed = false;
  let frame = 0;
  const canAnimate = () =>
    !media.matches &&
    !document.documentElement.classList.contains("motion-paused");

  const tick = () => {
    draw();
    frame = requestAnimationFrame(tick);
  };

  const refresh = () => {
    cancelAnimationFrame(frame);
    if (disposed || !visible || document.hidden) return;
    draw();
    if (canAnimate()) frame = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    refresh();
  });
  observer.observe(element);
  media.addEventListener("change", refresh);
  document.addEventListener("visibilitychange", refresh);
  document.addEventListener("motionchange", refresh);

  return {
    refresh,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      document.removeEventListener("motionchange", refresh);
    },
  };
}
