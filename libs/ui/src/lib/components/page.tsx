import { Box, Container, Typography, type TypographyProps } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

export const Page = ({ children, maxWidth = 'md' }: PropsWithChildren<{ maxWidth?: 'sm' | 'md' | 'lg' }>) => (
  <Container maxWidth={maxWidth} sx={{ py: { xs: 2, sm: 4 }, pb: 12 }}>
    {children}
  </Container>
);

export const PageTitle = ({
  children,
  action,
  ...props
}: PropsWithChildren<TypographyProps & { action?: ReactNode }>) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
    <Typography variant="h4" component="h1" {...props}>
      {children}
    </Typography>
    {action}
  </Box>
);
