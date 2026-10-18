// Independently implemented welcome interaction. No Internal Beyond application code is bundled.
export {};
const seenKey = 'baisite:welcome:seen:v1';
type Point = { x: number; y: number };
type Stroke = { tool: 'mist' | 'ink'; width: number; points: Point[] };

function initWelcome() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-welcome]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const scene = dialog.querySelector<HTMLElement>('[data-welcome-scene]')!;
  const fog = dialog.querySelector<HTMLCanvasElement>('[data-welcome-fog]')!;
  const ink = dialog.querySelector<HTMLCanvasElement>('[data-welcome-ink]')!;
  const fogContext = fog.getContext('2d');
  const inkContext = ink.getContext('2d');
  const tools = dialog.querySelector<HTMLElement>('.welcome-tools')!;
  const boardToggle = dialog.querySelector<HTMLButtonElement>('[data-welcome-board]')!;
  const density = dialog.querySelector<HTMLInputElement>('[data-welcome-density]')!;
  const brushSize = dialog.querySelector<HTMLInputElement>('[data-welcome-size]')!;
  const notice = dialog.querySelector<HTMLElement>('[data-welcome-notice]')!;
  const strokes: Stroke[] = [];
  let tool: Stroke['tool'] = 'mist';
  let current: Stroke | null = null;
  let pointerId: number | null = null;
  let boardEnabled = Boolean(fogContext && inkContext);
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
    const context = stroke.tool === 'mist' ? fogContext : inkContext;
    if (!context) return;
    context.save();
    context.globalCompositeOperation = stroke.tool === 'mist' ? 'destination-out' : 'source-over';
    context.lineWidth = stroke.width * width;
    context.lineCap = 'round'; context.lineJoin = 'round';
    context.strokeStyle = stroke.tool === 'mist' ? '#000' : 'rgba(52,52,50,.76)';
    context.beginPath(); context.moveTo(previous.x * width, previous.y * height);
    context.lineTo(point.x * width + .01, point.y * height + .01); context.stroke(); context.restore();
  }
  function repaint() {
    if (!fogContext || !inkContext) return;
    fogContext.clearRect(0, 0, width, height); inkContext.clearRect(0, 0, width, height);
    fogContext.fillStyle = '#f7f7f5'; fogContext.fillRect(0, 0, width, height);
    for (const stroke of strokes) stroke.points.forEach((point, i) => renderSegment(stroke, stroke.points[Math.max(0, i - 1)], point));
  }
  function resize() {
    const rect = scene.getBoundingClientRect();
    if (!rect.width || !rect.height || !fogContext || !inkContext) return;
    width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 2, Math.sqrt(5_000_000 / (width * height)));
    for (const [canvas, context] of [[fog, fogContext], [ink, inkContext]] as const) {
      canvas.width = Math.max(1, Math.round(width * ratio)); canvas.height = Math.max(1, Math.round(height * ratio)); context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    repaint();
  }
  function pointAt(event: PointerEvent): Point { const rect = ink.getBoundingClientRect(); return { x: (event.clientX - rect.left) / width, y: (event.clientY - rect.top) / height }; }
  ink.addEventListener('pointerdown', event => {
    if (!boardEnabled || !dialog!.open || !event.isPrimary || event.button !== 0) return;
    event.preventDefault(); ink.setPointerCapture(event.pointerId); pointerId = event.pointerId;
    const brush = Number(brushSize.value); current = { tool, width: (tool === 'mist' ? brush * 1.8 : 1 + brush / 16) / width, points: [pointAt(event)] };
    // Bound work and memory on a decorative canvas during long visits.
    if (strokes.length >= 160) { strokes.length = 0; repaint(); }
    strokes.push(current); renderSegment(current, current.points[0], current.points[0]);
  });
  ink.addEventListener('pointermove', event => {
    if (!current || pointerId !== event.pointerId) return;
    const point = pointAt(event); renderSegment(current, current.points[current.points.length - 1], point); current.points.push(point);
    if (current.points.length >= 3000) current = null;
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) ink.addEventListener(name, () => { current = null; pointerId = null; });
  dialog.querySelectorAll<HTMLButtonElement>('[data-welcome-tool]').forEach(button => button.addEventListener('click', () => {
    tool = button.dataset.welcomeTool as Stroke['tool'];
    dialog.querySelectorAll('[data-welcome-tool]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  }));
  dialog.querySelector('[data-welcome-clear]')?.addEventListener('click', () => { current = null; strokes.length = 0; repaint(); notice.textContent = '画板已清空，可以重新开始。'; });
  density.addEventListener('input', () => { fog.style.opacity = String(Number(density.value) / 100); });
  boardToggle.addEventListener('click', () => {
    if (!fogContext || !inkContext) return;
    boardEnabled = !boardEnabled; current = null; tools.hidden = !boardEnabled;
    boardToggle.setAttribute('aria-pressed', String(boardEnabled)); dialog.classList.toggle('is-board-off', !boardEnabled);
    dialog.querySelector('[data-welcome-board-label]')!.textContent = boardEnabled ? '开启' : '关闭';
    fog.hidden = !boardEnabled; ink.hidden = !boardEnabled;
  });
  if (!boardEnabled) { tools.hidden = true; boardToggle.hidden = true; ink.hidden = true; fog.hidden = true; }
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
