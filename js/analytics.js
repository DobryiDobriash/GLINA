/*
  Все события сайта собраны в одном файле.
  Чтобы включить реальную GA4-аналитику, замените G-XXXXXXXXXX на ID потока.
  По умолчанию режим демонстрационный и не отправляет данные Google.
*/
(() => {
  const GA_ID = 'G-KFC1Y4EBLS'; // Заменить на настоящий идентификатор GA4.
  const demoEvents = [];
  const send = (name, params = {}) => {
    const clean = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).length <= 100) clean[key] = value;
    });
    demoEvents.push({ name, params: clean, at: new Date().toISOString() });
    try { sessionStorage.setItem('glina:analyticsDemo', JSON.stringify(demoEvents.slice(-100))); } catch {}
    if (typeof window.gtag === 'function' && GA_ID !== 'G-KFC1Y4EBLS') window.gtag('event', name, clean);
  };
  window.glinaTrack = send;
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-event]');
    if (!target) return;
    const name = target.dataset.event;
    const map = {
      cta_click: { button_name: target.dataset.buttonName, page_section: target.dataset.pageSection },
      class_view: { class_format: target.dataset.classFormat },
      contact_click: { contact_type: target.dataset.contactType },
      messenger_click: { messenger: target.dataset.messenger },
      social_click: { network: target.dataset.network, page_section: target.dataset.pageSection }
    };
    send(name, { ...(map[name] || {}), page_title: document.title });
  });
  document.addEventListener('glina:class-calc', e => send('class_calc', { class_format: e.detail.format, people: e.detail.people, total_price: e.detail.total }));
  document.addEventListener('glina:slot-select', e => send('slot_select', { slot_date: e.detail.date, slot_time: e.detail.time, seats_left: e.detail.seats_left }));
  document.addEventListener('glina:gift-preview', e => send('gift_preview', { gift_type: e.detail.gift_type }));
  document.addEventListener('change', e => {
    if (e.target.id === 'gift-type') send('gift_select', { gift_type: e.target.value, gift_amount: /^\d+$/.test(e.target.value) ? Number(e.target.value) : undefined });
  });
  document.addEventListener('glina:promo-copy', e => send('promo_copy', e.detail));
  document.addEventListener('glina:gallery-view', e => send('gallery_view', e.detail));
  document.addEventListener('glina:form-start', e => send('form_start', e.detail));
  document.addEventListener('glina:form-error', e => send('form_error', e.detail));
  document.addEventListener('glina:lead-success', e => send('generate_lead', { lead_type: e.detail.lead_type, lead_format: e.detail.class_format }));
  document.addEventListener('glina:lead-success', () => send('form_submit', { form_id: 'lead-form' }));
  document.addEventListener('play', e => { if (e.target.matches('video')) send('video_play', { video_title: e.target.title || 'masterclass' }); }, true);
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.href.startsWith('tel:') || link.href.startsWith('mailto:')) return;
    if (link.origin !== location.origin) send('click', { link_url: link.href, outbound: true });
    if (link.pathname.endsWith('.pdf')) send('file_download', { file_name: link.pathname.split('/').pop(), file_extension: 'pdf' });
  });
  if (typeof window.gtag === 'function' && GA_ID !== 'G-KFC1Y4EBLS') {
    window.gtag('config', GA_ID);
  }
})();
