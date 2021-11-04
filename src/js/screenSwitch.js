'use strict';

export const setScreenSwitchEventListeners = () => {
  // screen switch event
  const screen_elements = document.getElementsByClassName('screen_switch');
  for (const screen_element of screen_elements) {
    screen_element.addEventListener('click', () =>
      screenSwitcher(screen_element)
    );
  }
};

const screenSwitcher = (clicked_element) => {
  const screen_elements = document.getElementsByClassName('screen_switch');
  for (const screen_element of screen_elements) {
    const screen_id = screen_element.id;
    const parent = screen_element.parentElement;
    const block_element = document.getElementById(screen_id + '_block');
    if (clicked_element.id === screen_id) {
      parent.classList.add('is-active');
      block_element.style.display = 'block';
    } else {
      parent.classList.remove('is-active');
      block_element.style.display = 'none';
    }
  }
};
