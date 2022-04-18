import { useState } from 'react';

export const useForceUpdate = () => {
  const [, setValue] = useState<number>();
  return () => setValue(Date.now());
}
