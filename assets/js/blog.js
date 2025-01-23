import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4';

// Popover functionality
const popover = document.querySelector('[popover]');

const config = {
  alignment: 'center',
  theme: 'light',
};

const ctrl = new Pane({
  title: 'Config',
  expanded: false,
});

const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.alignment = config.alignment;
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    (event.target.controller.view.labelElement.innerText !== 'Theme' &&
      event.target.controller.view.labelElement.innerText !== 'Alignment')
  ) {
    return update();
  }
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'alignment', {
  label: 'Alignment',
  options: {
    Left: 'left',
    Center: 'center',
    Right: 'right',
  },
});

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
});

ctrl.on('change', sync);
update();

// Hide popover on link click
const links = document.querySelectorAll('ol a');
links.forEach(link => {
  link.addEventListener('click', () => popover.hidePopover());
});

// Backfill the popover width/height transition
if (!CSS.supports('interpolate-size: allow-keywords')) {
  let set = false;
  popover.style.setProperty('transition', 'none');
  
  popover.addEventListener('toggle', () => {
    if (!set) {
      const { height, width } = popover.getBoundingClientRect();
      document.documentElement.style.setProperty('--content-height', `${height}px`);
      document.documentElement.style.setProperty('--content-width', `${width}px`);
      set = true;
      popover.hidePopover();
      requestAnimationFrame(() => {
        popover.showPopover();
        popover.style.removeProperty('transition');
      });
    }
  });
}

// Orientation Toggle Button Logic
const orientator = document.querySelector('.direction-handler');
const orient = () => {
   orientator.setAttribute('aria-pressed', orientator.matches('[aria-pressed=false]') ? true : false);
};

const changeOrientation = () => {
   document.documentElement.dataset.flipUi = true;
   if (!document.startViewTransition) return orient();
   const transition = document.startViewTransition(orient);
   transition.finished.finally(() => { document.documentElement.dataset.flipUi = false; });
};

orientator.addEventListener('click', changeOrientation);

// Theme Toggle Button Logic
const toggle = document.querySelector('button.theme');

const switchTheme = () => {
   const isDark = toggle.matches("[aria-pressed=true]") ? false : true;
   toggle.setAttribute("aria-pressed", isDark);
   document.documentElement.className = isDark ? 'light' : 'dark';
};

const handleToggle = () => {
   if (!document.startViewTransition) {
       console.info('Try this out in Chrome!');
       switchTheme();
   } else {
       document.startViewTransition(switchTheme);
   }
};

toggle.addEventListener('click', handleToggle);

// Magnetic Interaction Logic
const navLinks = document.querySelectorAll('nav[data-magnetic] ul li a');

navLinks.forEach(link => {
   link.addEventListener('mousemove', (event) => {
       const rect = link.getBoundingClientRect();
       const x = event.clientX - rect.left - rect.width / 2;
       const y = event.clientY - rect.top - rect.height / 2;

       // Apply translation based on mouse position, creating the magnetic effect
       link.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
   });

   link.addEventListener('mouseleave', () => {
       // Reset position when the mouse leaves
       link.style.transform = 'translate(0, 0)';
   });
});