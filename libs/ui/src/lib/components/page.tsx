import { Box, Container, IconButton, Typography, type TypographyProps } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const Page = ({ children, maxWidth = 'md' }: PropsWithChildren<{ maxWidth?: 'sm' | 'md' | 'lg' }>) => (
  <Container maxWidth={maxWidth} sx={{ py: { xs: 2, sm: 4 }, pb: { xs: 20, sm: 12 } }}>
    {children}
  </Container>
);

export const ClosePageButton = ({ to = '/' }: { to?: string }) => (
  <IconButton component={Link} to={to} aria-label="Close">
    <CloseRounded />
  </IconButton>
);

export const PageTitle = ({
  children,
  action,
  closeTo,
  sx,
  ...props
}: PropsWithChildren<TypographyProps & { action?: ReactNode; closeTo?: string }>) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mb: 3 }}>
    <Typography variant="h4" component="h1" {...props} sx={{ flex: 1, minWidth: 0, ...sx }}>
      {children}
    </Typography>
    {(action || closeTo) && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        {action}
        {closeTo ? <ClosePageButton to={closeTo} /> : null}
      </Box>
    )}
  </Box>
);
