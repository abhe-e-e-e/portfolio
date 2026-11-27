(() => {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cursor = document.createElement('div');
  cursor.className = 'atelier-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  const hide = () => document.documentElement.classList.remove('custom-cursor');
  document.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || event.pointerType !== 'mouse' ||
        event.target.closest('dialog[open],input,textarea,select')) {
      hide();
      return;
    }
    cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    cursor.classList.toggle('is-link', !!event.target.closest('a,button,[role=tab]'));
    const drag = !!event.target.closest('.bottle-stage.is-3d');
    cursor.classList.toggle('is-drag', drag);
    cursor.textContent = drag ? 'DRAG' : '';
    document.documentElement.classList.add('custom-cursor');
  }, { passive:true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
  document.addEventListener('keydown', hide);
  window.addEventListener('blur', hide);
  finePointer.addEventListener('change', hide);
  reduced.addEventListener('change', hide);
})();
