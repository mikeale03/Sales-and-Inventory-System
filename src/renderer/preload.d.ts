import { IResponse } from 'globalTypes/response.interface';
import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke<T>(channel: string, ...args: unknown[]): Promise<IResponse<T>>;
      };
    };
  }
}

export {};