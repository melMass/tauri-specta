import { invoke as TAURI_INVOKE } from "@tauri-apps/api";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";

/** @typedef {typeof import("@tauri-apps/api/window").WebviewWindowHandle} __WebviewWindowHandle__ */

/**
 * @template T
 * @typedef {{
 *   listen: (
 *	   cb: TAURI_API_EVENT.EventCallback<T>
 *	 ) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
 *   listenFor: (
 *     window: __WebviewWindowHandle__,
 *	   cb: TAURI_API_EVENT.EventCallback<T>
 *	 ) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
 *	 once: (
 *	   cb: TAURI_API_EVENT.EventCallback<T>
 *	 ) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
 *	 onceFor: (
 * 	   window: __WebviewWindowHandle__,
 *	   cb: TAURI_API_EVENT.EventCallback<T>
 *	 ) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
 *	 emit: T extends null
 *	   ? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
 *     : (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
 *	 emitFor: T extends null
 *	   ? (window: __WebviewWindowHandle__, payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
 *     : (window: __WebviewWindowHandle__, payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
 *	}} __EventObj__<T>
 */

/**
 * #template T,E
 * @typedef {[T, undefined] | [undefined, E]} __Result__
 */

/**
 * @template {Record<string, any>} T
 * @param {Record<keyof T, string>} mappings
 * @returns {{
 * 	 [K in keyof T]: __EventObj__<T[K]>;
 * }}
 */
function __makeEvents__(mappings) {
  return new Proxy(
    {},
    {
      get: (_, event) =>
        new Proxy(
          {},
          {
            get: (_, command) => {
              const name = mappings[event];

              switch (command) {
                case "listen":
                  return (arg) => TAURI_API_EVENT.listen(name, arg);
                case "listenFor":
                  return (window, arg) => window.listen(name, arg);
                case "once":
                  return (arg) => TAURI_API_EVENT.once(name, arg);
                case "onceFor":
                  return (window, arg) => window.once(name, arg);
                case "emit":
                  return (arg) => TAURI_API_EVENT.emit(name, arg);
                case "emitFor":
                  return (window, arg) => window.emit(name, arg);
              }
            },
          }
        ),
    }
  );
}
