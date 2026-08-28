const DISMISS_KEY = 'tichu.installBanner.dismissed';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const isStandaloneDisplay = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

export const isIosDevice = () => {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

export const isInstallBannerDismissed = () => localStorage.getItem(DISMISS_KEY) === '1';

export const dismissInstallBanner = () => localStorage.setItem(DISMISS_KEY, '1');

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}
