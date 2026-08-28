import { useCallback, useEffect, useState } from 'react';
import {
  dismissInstallBanner,
  isInstallBannerDismissed,
  isIosDevice,
  isStandaloneDisplay,
  type BeforeInstallPromptEvent,
} from './install';

export const useAppInstall = () => {
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    setIos(isIosDevice());
    setDismissed(isInstallBannerDismissed());

    const onPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    const onInstalled = () => setStandalone(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    setPromptEvent(null);
  }, [promptEvent]);

  const dismiss = useCallback(() => {
    dismissInstallBanner();
    setDismissed(true);
  }, []);

  return {
    standalone,
    ios,
    canPrompt: Boolean(promptEvent),
    install,
    dismissed,
    dismiss,
  };
};
