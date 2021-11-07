'use strict';

export const setScreenSwitchEventListeners = () => {
  // screen switch event
  const screenElements = document.getElementsByClassName('screen_switch');
  for (const screenElement of screenElements) {
    screenElement.addEventListener('click', () =>
      screenSwitcher(screenElement)
    );
  }
};

const screenSwitcher = (clickedElement) => {
  const screenElements = document.getElementsByClassName('screen_switch');
  for (const screenElement of screenElements) {
    const screenId = screenElement.id;
    const parent = screenElement.parentElement;
    const blockElement = document.getElementById(screenId + '_block');
    if (clickedElement.id === screenId) {
      parent.classList.add('is-active');
      blockElement.style.display = 'block';
    } else {
      parent.classList.remove('is-active');
      blockElement.style.display = 'none';
    }
  }
};
