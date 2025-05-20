import { useEffectAsync } from '../utils/react';

export function bootstrapInit() {
  useEffectAsync(async () => {
    import('bootstrap/dist/js/bootstrap');
  }, []);
}
