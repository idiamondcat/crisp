import { Address } from "@commercetools/platform-sdk";

type Multi =
  | string
  | string[]
  | number
  | Address[]
  | HTMLElement
  | null
  | undefined;
type EventHandler<T extends Multi[]> = (...args: T) => void;
type Obj = Record<string, Set<Function>>;

export class Emitter {
  public static events: Obj = {};

  public static on<T extends Multi[]>(
    key: string,
    func: EventHandler<T>,
  ): void {
    const listeners = this.events[key] ?? new Set();
    listeners.add(func);
    this.events[key] = listeners;
  }

  public static emit<T extends Multi[]>(
    key: string,
    ...args: Multi[] | EventHandler<T>[]
  ): void {
    const listeners = this.events[key] ?? new Set();
    for (const listener of listeners) {
      listener(...args);
    }
  }
}
