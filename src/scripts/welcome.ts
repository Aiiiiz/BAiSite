// Independently implemented welcome interaction. No Internal Beyond application code is bundled.
export {};
const seenKey = 'baisite:welcome:seen:v1';
type Point = { x: number; y: number };
type Stroke = { width: number; points: Point[] };

function initWelcome() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-welcome]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const scene = dialog.querySelector<HTMLElement>('[data-welcome-scene]')!;
  const fog = dialog.querySelector<HTMLCanvasElement>('[data-welcome-fog]')!;
  const fogContext = fog.getContext('2d');
  const strokes: Stroke[] = [];
  let current: Stroke | null = null;
  let pointerId: number | null = null;
  let width = 1;
  let height = 1;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  function markSeen() { try { sessionStorage.setItem(seenKey, '1'); } catch { /* Continue without storage. */ } }
  function hasSeen() { try { return sessionStorage.getItem(seenKey) === '1'; } catch { return false; } }
  function restorePage() { document.documentElement.classList.remove('has-welcome'); dialog!.classList.remove('is-leaving'); if (closeTimer) clearTimeout(closeTimer); }
  function closeWelcome() {
    if (!dialog!.open || dialog!.classList.contains('is-leaving')) return;
    markSeen(); current = null; pointerId = null;
    const finish = () => { dialog!.close(); restorePage(); document.getElementById('main')?.focus({ preventScroll: true }); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else { dialog!.classList.add('is-leaving'); closeTimer = setTimeout(finish, 380); }
  }
  function showWelcome() {
    if (dialog!.open) return;
    try { dialog!.showModal(); document.documentElement.classList.add('has-welcome'); resize(); }
    catch { restorePage(); }
  }
  function renderSegment(stroke: Stroke, previous: Point, point: Point) {
    const context = fogContext;
    if (!context) return;
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = stroke.width * width;
    context.lineCap = 'round'; context.lineJoin = 'round';
    context.strokeStyle = '#000';
    context.beginPath(); context.moveTo(previous.x * width, previous.y * height);
    context.lineTo(point.x * width + .01, point.y * height + .01); context.stroke(); context.restore();
  }
  function repaint() {
    if (!fogContext) return;
    fogContext.clearRect(0, 0, width, height);
    fogContext.fillStyle = '#f7f7f5'; fogContext.fillRect(0, 0, width, height);
    for (const stroke of strokes) stroke.points.forEach((point, i) => renderSegment(stroke, stroke.points[Math.max(0, i - 1)], point));
  }
  function resize() {
    const rect = scene.getBoundingClientRect();
    if (!rect.width || !rect.height || !fogContext) return;
    width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 2, Math.sqrt(5_000_000 / (width * height)));
    fog.width = Math.max(1, Math.round(width * ratio)); fog.height = Math.max(1, Math.round(height * ratio)); fogContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    repaint();
  }
  function pointAt(event: PointerEvent): Point { const rect = fog.getBoundingClientRect(); return { x: (event.clientX - rect.left) / width, y: (event.clientY - rect.top) / height }; }
  fog.addEventListener('pointerdown', event => {
    if (!fogContext || !dialog!.open || !event.isPrimary || event.button !== 0) return;
    event.preventDefault(); fog.setPointerCapture(event.pointerId); pointerId = event.pointerId;
    current = { width: Math.min(100, width * .3) / width, points: [pointAt(event)] };
    // Bound work and memory on a decorative canvas during long visits.
    if (strokes.length >= 160) { strokes.length = 0; repaint(); }
    strokes.push(current); renderSegment(current, current.points[0], current.points[0]);
  });
  fog.addEventListener('pointermove', event => {
    if (!current || pointerId !== event.pointerId) return;
    const point = pointAt(event); renderSegment(current, current.points[current.points.length - 1], point); current.points.push(point);
    if (current.points.length >= 3000) current = null;
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) fog.addEventListener(name, () => { current = null; pointerId = null; });
  if (!fogContext) fog.hidden = true;
  dialog.querySelectorAll('[data-welcome-enter]').forEach(button => button.addEventListener('click', closeWelcome));
  dialog.querySelectorAll('[data-welcome-leave]').forEach(link => link.addEventListener('click', event => {
    if (event instanceof MouseEvent && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) return;
    markSeen(); dialog.close(); restorePage();
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-welcome-open]').forEach(button => { button.hidden = false; button.addEventListener('click', showWelcome); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeWelcome(); });
  dialog.addEventListener('close', restorePage);
  const observer = new ResizeObserver(() => { if (dialog.open) resize(); }); observer.observe(scene);
  addEventListener('pagehide', () => { current = null; restorePage(); });
  addEventListener('pageshow', () => { if (dialog.open) { document.documentElement.classList.add('has-welcome'); resize(); } });
  if (!hasSeen() && !location.hash) showWelcome();
}
initWelcome();
