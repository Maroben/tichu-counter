import { Alert, Button, Snackbar } from '@mui/material';
import { useAppInstall } from '../pwa/use-app-install';

export const InstallBanner = () => {
  const { standalone, ios, canPrompt, install, dismissed, dismiss } = useAppInstall();
  const open = !standalone && !dismissed && (ios || canPrompt);

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert
        severity="info"
        onClose={dismiss}
        action={
          canPrompt ? (
            <Button color="inherit" size="small" onClick={() => void install()}>
              Install
            </Button>
          ) : undefined
        }>
        {ios
          ? 'Add Tichu Counter to your home screen: tap Share, then Add to Home Screen.'
          : 'Install Tichu Counter on your home screen.'}
      </Alert>
    </Snackbar>
  );
};
