import { providersStore } from '~/lib/stores/settings';
import type { IProviderConfig } from '~/types/model';

export async function getProviderSettings(providerId: string): Promise<IProviderConfig['settings'] | undefined> {
  const allSettings = providersStore.get();
  const providerConfig = allSettings[providerId];
  return providerConfig?.settings;
}
