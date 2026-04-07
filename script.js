/* ===========================
PREGNANCY CLINICAL TIMELINE
script.js
=========================== */

(function () {
‘use strict’;

/* –– Trimester tab navigation –– */
const navBtns = document.querySelectorAll(’.tnav-btn’);
const sections = document.querySelectorAll(’.trimester-section’);

function activateTab(target) {
navBtns.forEach(b => b.classList.toggle(‘active’, b.dataset.target === target));
sections.forEach(s => {
if (s.id === target) {
s.classList.remove(‘hidden’);
s.style.animation = ‘none’;
// force reflow
void s.offsetHeight;
s.style.animation = ‘’;
} else {
s.classList.add(‘hidden’);
}
});

```
// update nav button accent color to match trimester
const colors = {
  t1: '#a78bfa',
  t2: '#34d399',
  t3: '#60a5fa',
  labor: '#f87171',
  postpartum: '#fb923c'
};
document.querySelectorAll('.tnav-btn.active').forEach(btn => {
  btn.style.borderBottomColor = colors[target] || '#a78bfa';
  btn.style.color = '#fff';
});
document.querySelectorAll('.tnav-btn:not(.active)').forEach(btn => {
  btn.style.borderBottomColor = 'transparent';
  btn.style.color = '';
});
```

}

navBtns.forEach(btn => {
btn.addEventListener(‘click’, () => activateTab(btn.dataset.target));
});

// Initialize first tab
activateTab(‘t1’);

/* –– Keyboard navigation –– */
const tabOrder = [‘t1’, ‘t2’, ‘t3’, ‘labor’, ‘postpartum’];

document.addEventListener(‘keydown’, e => {
const activeBtn = document.querySelector(’.tnav-btn.active’);
if (!activeBtn) return;
const currentTarget = activeBtn.dataset.target;
const currentIdx = tabOrder.indexOf(currentTarget);

```
if (e.key === 'ArrowRight' && currentIdx < tabOrder.length - 1) {
  activateTab(tabOrder[currentIdx + 1]);
} else if (e.key === 'ArrowLeft' && currentIdx > 0) {
  activateTab(tabOrder[currentIdx - 1]);
}
```

});

/* –– Card expand/collapse on click (mobile-friendly) –– */
document.querySelectorAll(’.card’).forEach(card => {
const body = card.querySelector(’.card-body’);
const list = card.querySelector(’.card-list’);
const content = body || list;

```
if (!content) return;

// On small screens, collapse long cards
if (window.innerWidth < 640 && content.scrollHeight > 140) {
  content.style.maxHeight = '100px';
  content.style.overflow = 'hidden';
  content.style.transition = 'max-height 0.35s ease';

  const toggle = document.createElement('button');
  toggle.textContent = 'Show more';
  toggle.style.cssText = `
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 0 0;
    display: block;
  `;
  card.appendChild(toggle);

  let expanded = false;
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    expanded = !expanded;
    content.style.maxHeight = expanded ? content.scrollHeight + 'px' : '100px';
    toggle.textContent = expanded ? 'Show less' : 'Show more';
  });
}
```

});

/* –– Subtle scroll-reveal for cards –– */
if (‘IntersectionObserver’ in window) {
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = ‘1’;
entry.target.style.transform = ‘translateY(0)’;
observer.unobserve(entry.target);
}
});
}, { threshold: 0.08, rootMargin: ‘0px 0px -20px 0px’ });

```
function observeCards() {
  document.querySelectorAll('.card:not([data-observed]), .torch-card:not([data-observed]), .lab-group:not([data-observed])').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.setAttribute('data-observed', '1');
    observer.observe(el);
  });
}

observeCards();

// Re-observe when tabs switch
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // small delay for DOM to update
    setTimeout(observeCards, 50);
  });
});
```

}

/* –– TORCH badge tooltips –– */
const torchCards = document.querySelectorAll(’.torch-card’);
torchCards.forEach(card => {
card.setAttribute(‘tabindex’, ‘0’);
card.setAttribute(‘role’, ‘article’);
});

/* –– Header glow on scroll –– */
const nav = document.querySelector(’.trimester-nav’);
let lastScroll = 0;
window.addEventListener(‘scroll’, () => {
const current = window.scrollY;
if (current > 80) {
nav.style.boxShadow = ‘0 2px 20px rgba(0,0,0,0.5)’;
} else {
nav.style.boxShadow = ‘none’;
}
lastScroll = current;
}, { passive: true });

/* –– Print styles helper –– */
window.addEventListener(‘beforeprint’, () => {
sections.forEach(s => s.classList.remove(‘hidden’));
});
window.addEventListener(‘afterprint’, () => {
sections.forEach((s, i) => {
if (i !== 0) s.classList.add(‘hidden’);
});
});

})();
