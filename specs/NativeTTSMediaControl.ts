import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  showMediaNotification(
    title: string,
    subtitle: string,
    coverUri: string,
    isPlaying: boolean,
  ): void;
  updatePlaybackState(isPlaying: boolean): void;
  updateProgress(current: number, total: number): void;
  dismiss(): void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeTTSMediaControl');
