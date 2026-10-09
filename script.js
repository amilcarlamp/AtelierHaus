'use strict';
document.body.classList.add('js');
const phone='522207784832';
const generalWhatsappMessage='Hola, quiero dar clases en Atelier Haus. ¿Me platican más?';
document.querySelectorAll('.whatsapp').forEach(link=>{
  const message=link.dataset.whatsappMessage || generalWhatsappMessage;
  link.href=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});

let selectedRate='founder';
const rates=document.querySelectorAll('[data-rate]');
const formatMXN=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0});
function updatePlans(){
  rates.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rate===selectedRate)));
  document.querySelectorAll('[data-price]').forEach(price=>{price.textContent=formatMXN.format(Number(price.dataset[selectedRate]));});
  document.getElementById('rate-description').textContent=selectedRate==='founder'
    ?'20% de descuento durante tus primeros 3 meses. Requiere permanecer 3 meses consecutivos.'
    :'Precio normal, con pago mes a mes. Sin permanencia de 3 meses; avisa con una semana de anticipación para cancelar.';
}
rates.forEach(button=>button.addEventListener('click',()=>{selectedRate=button.dataset.rate;updatePlans();}));
updatePlans();

const menu=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
function setMenu(open){menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.dataset.open=String(open);}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});

const mobileContact=document.querySelector('.mobile-contact');
const heroPrimaryCta=document.querySelector('.hero-primary-cta');
if('IntersectionObserver' in window && heroPrimaryCta){
  const mobileContactObserver=new IntersectionObserver(entries=>{
    mobileContact.dataset.visible=String(!entries[0].isIntersecting);
  },{threshold:0.1});
  mobileContactObserver.observe(heroPrimaryCta);
}else{mobileContact.dataset.visible='true';}

const equipmentToggle = document.querySelector('.equipment-toggle');
const equipmentPanel = document.querySelector('#equipment-details-panel');
const equipmentToggleLabel = equipmentToggle.querySelector('.equipment-toggle-label');
function setEquipmentExpanded(expanded) {
  equipmentToggle.setAttribute('aria-expanded', String(expanded));
  equipmentToggleLabel.textContent = expanded ? 'Ocultar equipamiento completo' : 'Ver equipamiento completo';
  equipmentPanel.dataset.open = String(expanded);
  equipmentPanel.setAttribute('aria-hidden', String(!expanded));
  equipmentPanel.inert = !expanded;
}
equipmentToggle.addEventListener('click', () => {
  setEquipmentExpanded(equipmentToggle.getAttribute('aria-expanded') !== 'true');
});
setEquipmentExpanded(false);

const rows = [...document.querySelectorAll('.calendar-plan-button')];
// Illustrative schedules only; real availability is confirmed through WhatsApp.
const calendarMonth = document.querySelector('#calendar-month');
const calendarResult = document.querySelector('#calendar-result');
const calendarError = document.querySelector('#calendar-error');
const calendarPrev = document.querySelector('#calendar-prev');
const calendarNext = document.querySelector('#calendar-next');
const calendarDemo = document.querySelector('#calendar-demo');
const calendarDemoToggle = document.querySelector('#calendar-demo-toggle');
const calendarDemoMobileQuery = window.matchMedia('(max-width: 760px)');
const plansGrid = document.querySelector('.plans-grid');
const featuredPlan = document.querySelector('.plan-featured');
let lastCalendarTrigger = null;

function centerFeaturedPlan() {
  if (!calendarDemoMobileQuery.matches || !featuredPlan) return;
  plansGrid.scrollLeft = Math.max(0, featuredPlan.offsetLeft - (plansGrid.clientWidth - featuredPlan.offsetWidth) / 2);
}

function setCalendarPlan(button) {
  rows.forEach(row => {
    const selected = row === button;
    row.setAttribute('aria-pressed', String(selected));
    row.closest('.plan').classList.toggle('is-selected', selected);
  });
  calendarPlan = button.dataset;
}

function openCalendarDemo(trigger) {
  lastCalendarTrigger = trigger;
  renderExampleMonth();
  if (typeof calendarDemo.showModal === 'function') {
    if (!calendarDemo.open) calendarDemo.showModal();
  } else {
    calendarDemo.setAttribute('open', '');
  }
  document.body.classList.add('calendar-modal-open');
  calendarDemo.scrollTop = 0;
  requestAnimationFrame(() => calendarDemoToggle.focus());
}

function closeCalendarDemo() {
  if (typeof calendarDemo.close === 'function' && calendarDemo.open) {
    calendarDemo.close();
  } else {
    calendarDemo.removeAttribute('open');
    document.body.classList.remove('calendar-modal-open');
    if (lastCalendarTrigger) lastCalendarTrigger.focus();
  }
}

calendarDemoToggle.addEventListener('click', closeCalendarDemo);
calendarDemo.addEventListener('close', () => {
  document.body.classList.remove('calendar-modal-open');
  if (lastCalendarTrigger) lastCalendarTrigger.focus();
});
calendarDemo.addEventListener('click', event => {
  if (event.target !== calendarDemo) return;
  const bounds = calendarDemo.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) closeCalendarDemo();
});
calendarDemoMobileQuery.addEventListener('change', event => {
  if (event.matches) requestAnimationFrame(centerFeaturedPlan);
});
window.addEventListener('load', () => requestAnimationFrame(centerFeaturedPlan), {once:true});
const weeklyExamples = {
  Lienzo: [{day:1, start:14, hours:1, kind:'regular'}],
  Boceto: [{day:1, start:18, hours:1, kind:'estelar'}, {day:3, start:14, hours:1, kind:'regular'}],
  Estudio: [{day:1, start:18, hours:1, kind:'estelar'}, {day:2, start:14, hours:2, kind:'regular'}, {day:4, start:14, hours:1, kind:'regular'}],
  Atelier: [{day:1, start:18, hours:2, kind:'estelar'}, {day:3, start:14, hours:2, kind:'regular'}, {day:6, start:14, hours:2, kind:'regular'}],
  Haus: [{day:1, start:18, hours:2, kind:'estelar'}, {day:2, start:18, hours:1, kind:'estelar'}, {day:3, start:14, hours:2, kind:'regular'}, {day:5, start:14, hours:2, kind:'regular'}, {day:6, start:14, hours:1, kind:'regular'}]
};
const weekdayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const kindName = kind => kind === 'estelar' ? 'Estelar' : 'Regular';
const clockHour = hour => String(hour).padStart(2,'0') + ':00';
const timeRange = session => clockHour(session.start) + '–' + clockHour(session.start + session.hours);
const initialCalendarButton = rows.find(row => row.getAttribute('aria-pressed') === 'true') || rows[0];
let calendarPlan = initialCalendarButton.dataset;
setCalendarPlan(initialCalendarButton);
const currentDateParts = new Intl.DateTimeFormat('en-CA', {
  timeZone:'America/Mexico_City', year:'numeric', month:'2-digit'
}).formatToParts(new Date());
calendarMonth.value = currentDateParts.find(part => part.type === 'year').value + '-' + currentDateParts.find(part => part.type === 'month').value;

function readCalendarMonth() {
  const match = /^(\d{4})-(\d{2})$/.exec(calendarMonth.value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return year >= 1 && year <= 9999 && month >= 1 && month <= 12 ? {year, month} : null;
}

function shiftCalendarMonth(direction) {
  const selected = readCalendarMonth();
  if (!selected) return;
  const index = (selected.year - 1) * 12 + selected.month - 1 + direction;
  if (index < 0 || index >= 9999 * 12) return;
  calendarMonth.value = String(Math.floor(index / 12) + 1).padStart(4,'0') + '-' + String(index % 12 + 1).padStart(2,'0');
  renderExampleMonth();
}

function renderExampleMonth() {
  const sessions = weeklyExamples[calendarPlan.plan];
  const weeklyHours = sessions.reduce((sum, session) => sum + session.hours, 0);
  const estelarHours = sessions.filter(session => session.kind === 'estelar').reduce((sum, session) => sum + session.hours, 0);
  const regularHours = weeklyHours - estelarHours;

  document.querySelector('#calendar-plan').textContent = 'Así funciona el plan ' + calendarPlan.plan;
  document.querySelector('#calendar-weekly-count').textContent = weeklyHours;
  document.querySelector('#calendar-weekly-label').textContent = weeklyHours === 1 ? 'hora reservada por semana' : 'horas reservadas por semana';
  const doubleCount = sessions.filter(session => session.hours === 2).length;
  const singleCount = sessions.length - doubleCount;
  const description = [];
  if (doubleCount) description.push(doubleCount + ' de 2 horas');
  if (singleCount) description.push(singleCount + ' de 1 hora');
  document.querySelector('#calendar-explanation').textContent = sessions.length + (sessions.length === 1 ? ' clase por semana' : ' clases por semana') + ': ' + description.join(' y ') + '. Los mismos días, cada semana.';
  document.querySelector('#calendar-mix').textContent = estelarHours
    ? 'Este ejemplo usa ' + estelarHours + ' h Estelares y ' + regularHours + ' h Regulares por semana.'
    : 'Este ejemplo usa 1 h Regular por semana.';
  const agenda = document.querySelector('#calendar-agenda');
  agenda.replaceChildren();
  sessions.forEach(session => {
    const li = document.createElement('li');
    const day = document.createElement('strong');
    day.textContent = weekdayNames[session.day];
    const detail = document.createElement('span');
    const time = document.createElement('span');
    time.textContent = timeRange(session) + ' · ' + session.hours + ' h';
    const type = document.createElement('small');
    type.textContent = 'Horario ' + kindName(session.kind);
    detail.append(time, type);
    li.append(day, detail);
    agenda.append(li);
  });
  const planRateLabel = selectedRate === 'founder' ? 'como Tallerista Fundador' : 'con precio normal';
  const planMessage = `Hola, me interesa el plan ${calendarPlan.plan} ${planRateLabel}. ¿Qué horarios hay?`;
  document.querySelector('#calendar-contact').href = `https://wa.me/${phone}?text=${encodeURIComponent(planMessage)}`;
  calendarError.hidden = true;
  calendarResult.hidden = false;
  const selectedMonth = readCalendarMonth();
  calendarPrev.disabled = !selectedMonth || (selectedMonth.year === 1 && selectedMonth.month === 1);
  calendarNext.disabled = !selectedMonth || (selectedMonth.year === 9999 && selectedMonth.month === 12);
  if (!calendarMonth.checkValidity() || !selectedMonth) {
    calendarResult.hidden = true;
    calendarError.textContent = 'Elige un mes para ver el ejemplo.';
    calendarError.hidden = false;
    return;
  }
  const {year, month} = selectedMonth;
  // setFullYear also supports years 0001–0099 without Date's 1900 offset.
  const start = new Date(0);
  start.setFullYear(year, month - 1, 1);
  start.setHours(12,0,0,0);
  const end = new Date(start);
  end.setMonth(month);
  end.setDate(0);
  const lastDay = end.getDate();
  const offset = (start.getDay() + 6) % 7;
  const monthName = new Intl.DateTimeFormat('es-MX', {month:'long',year:'numeric'}).format(start);
  document.querySelector('#calendar-title').textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  document.querySelector('#calendar-caption').textContent = 'Ejemplo de un mes completo para el plan ' + calendarPlan.plan + '. Cada día marcado contiene una clase; su duración y tipo de horario aparecen en la celda.';
  const tbody = document.querySelector('#calendar-days');
  tbody.replaceChildren();
  let classCount = 0;
  let reservedHours = 0;
  for (let cellIndex = 0; cellIndex < Math.ceil((offset + lastDay) / 7) * 7; cellIndex += 1) {
    if (cellIndex % 7 === 0) tbody.append(document.createElement('tr'));
    const cell = document.createElement('td');
    const dayNumber = cellIndex - offset + 1;
    if (dayNumber >= 1 && dayNumber <= lastDay) {
      const date = new Date(start);
      date.setDate(dayNumber);
      const number = document.createElement('span');
      number.className = 'calendar-date';
      number.textContent = dayNumber;
      cell.append(number);
      const fullDate = new Intl.DateTimeFormat('es-MX', {weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);
      const session = sessions.find(item => item.day === date.getDay());
      if (session) {
        classCount += 1;
        reservedHours += session.hours;
        cell.className = 'has-session session-' + session.kind;
        cell.dataset.hours = session.hours;
        const time = document.createElement('span');
        time.className = 'calendar-times';
        time.textContent = timeRange(session);
        const length = document.createElement('span');
        length.className = 'calendar-duration';
        const hours = document.createElement('span');
        hours.className = 'calendar-cell-hours';
        hours.textContent = session.hours + ' h';
        const kind = document.createElement('span');
        kind.className = 'calendar-cell-kind';
        kind.textContent = session.kind === 'estelar' ? 'E' : 'R';
        length.append(hours, kind);
        cell.append(time, length);
        cell.setAttribute('aria-label', fullDate + '. Una clase de ejemplo de ' + session.hours + ' ' + (session.hours === 1 ? 'hora' : 'horas') + ', de ' + timeRange(session) + ', Horario ' + kindName(session.kind) + '. ' + (session.hours === 1 ? '50 minutos' : '1 hora y 50 minutos') + ' de actividad y 10 minutos de transición al final.');
      } else {
        cell.setAttribute('aria-label', fullDate + '. Sin clase en este ejemplo.');
      }
    }
    tbody.lastElementChild.append(cell);
  }
  document.querySelector('#calendar-class-count').textContent = classCount;
  document.querySelector('#calendar-hours-count').textContent = reservedHours;
  document.querySelector('#calendar-totals').textContent = 'El plan ' + calendarPlan.plan + ' tendría ' + classCount + ' clases y ' + reservedHours + ' horas reservadas en ' + monthName + ', en este ejemplo de mes completo.';
}
rows.forEach(row => row.addEventListener('click', () => {
  setCalendarPlan(row);
  openCalendarDemo(row);
}));
rates.forEach(button => button.addEventListener('click', renderExampleMonth));
calendarMonth.addEventListener('input', renderExampleMonth);
calendarMonth.addEventListener('change', renderExampleMonth);
calendarPrev.addEventListener('click', () => shiftCalendarMonth(-1));
calendarNext.addEventListener('click', () => shiftCalendarMonth(1));
renderExampleMonth();



// Reveal selected content once; keep it readable without JS or IntersectionObserver.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const standaloneTargets = document.querySelectorAll('.space-copy, .equipment-disclosure, .space-autonomy, .section-heading, .schedule, .faq-grid > div:first-child, .contact-grid > div');
  const revealGroups = [
    document.querySelectorAll('.space-benefit-card'),
    document.querySelectorAll('.steps article'),
    document.querySelectorAll('.founders-grid > div, .opening-guarantee'),
    document.querySelectorAll('.plans-grid > .plan'),
    document.querySelectorAll('.faq-list details')
  ];
  const targets = [...new Set([
    ...standaloneTargets,
    ...revealGroups.flatMap(group => [...group])
  ])];

  revealGroups.forEach(group => {
    group.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 5) * 80}ms`);
    });
  });

  const reveal = element => {
    if (!element.classList.contains('is-pending')) return;
    element.classList.remove('is-pending');
    observer.unobserve(element);
    element.addEventListener('transitionend', () => {
      element.classList.remove('scroll-reveal');
      element.style.removeProperty('--reveal-delay');
    }, { once: true });
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) reveal(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  let scrollCheckQueued = false;
  const revealSkippedTargets = () => {
    scrollCheckQueued = false;
    targets.forEach(element => {
      if (element.classList.contains('is-pending') && element.getBoundingClientRect().bottom < 0) {
        element.style.setProperty('--reveal-delay', '0ms');
        reveal(element);
      }
    });
    if (!targets.some(element => element.classList.contains('is-pending'))) {
      window.removeEventListener('scroll', queueSkippedTargetCheck);
    }
  };
  const queueSkippedTargetCheck = () => {
    if (!scrollCheckQueued) {
      scrollCheckQueued = true;
      window.requestAnimationFrame(revealSkippedTargets);
    }
  };
  window.addEventListener('scroll', queueSkippedTargetCheck, { passive: true });

  targets.forEach(element => {
    // Leave the initial viewport and nearby content visible immediately.
    if (element.getBoundingClientRect().top > window.innerHeight + 24) {
      element.classList.add('scroll-reveal', 'is-pending');
      observer.observe(element);
      element.addEventListener('focusin', () => {
        element.style.setProperty('--reveal-delay', '0ms');
        reveal(element);
      }, { once: true });
    }
  });

  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      targets.forEach(element => {
        element.classList.remove('scroll-reveal', 'is-pending');
        element.style.removeProperty('--reveal-delay');
      });
      observer.disconnect();
      window.removeEventListener('scroll', queueSkippedTargetCheck);
    }
  });
}
