import { atom } from 'nanostores';
import { logStore } from './logs';

export type Theme = 'light'; // only light

export const kTheme = 'cosmiq_theme';

export function themeIsDark() {
  return false; // always false since only light theme
}

export const DEFAULT_THEME: Theme = 'light';

export const themeStore = atom<Theme>(initStore());

function initStore(): Theme {
  // Always return light, regardless of SSR or persisted data
  if (!import.meta.env.SSR) {
    document.querySelector('html')?.setAttribute('data-theme', 'light');
    localStorage.setItem(kTheme, 'light');
  }

  return DEFAULT_THEME;
}

export function toggleTheme() {
  // Always set to light
  themeStore.set('light');
  localStorage.setItem(kTheme, 'light');
  document.querySelector('html')?.setAttribute('data-theme', 'light');

  try {
    const userProfile = localStorage.getItem('cosmiq_user_profile');

    if (userProfile) {
      const profile = JSON.parse(userProfile);
      profile.theme = 'light';
      localStorage.setItem('cosmiq_user_profile', JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Error updating user profile theme:', error);
  }

  logStore.logSystem(`Theme locked to light mode`);
}
