document.querySelectorAll<HTMLImageElement>('.artwork img').forEach((img) => {
  const wrapper = img.closest<HTMLElement>('.artwork');
  const fallback = wrapper?.querySelector<HTMLElement>('.image-fallback');
  if (!wrapper || !fallback) return;
  const showFailure = () => {
    wrapper.classList.add('has-error');
    fallback.hidden = false;
  };
  img.addEventListener('error', showFailure);
  img.addEventListener('load', () => { wrapper.classList.remove('has-error'); fallback.hidden = true; });
  if (img.complete && img.naturalWidth === 0) showFailure();
  fallback.querySelector<HTMLButtonElement>('button')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const url = new URL(img.src);
    url.searchParams.set('retry', String(Date.now()));
    img.src = url.toString();
  });
});
