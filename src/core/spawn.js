import create from './create';
import {disposable, observable, canDispatch} from '../common/index';

/**
  * Spawn a dedicated worker.
  * @param  {string|Array} script - js file or an array of functions and or strings.
  * @return {object} worker wrapper  -  worker wrapper object.
 */
export function spawn(script) {
  let state = {
    w: create(script),
    subscribers: []
  };

  state.w.onmessage = _Next;
  state.w.onerror = _Error;

  let ctx = Object.assign(
    {},
    disposable(state),
    observable(state),
    canDispatch(state)
  );
  return ctx;

  /**
   * Worker message event callback.
   * @param  {object} event .
   */
  function _Next(event) {
    state.subscribers.map(subscriber => subscriber.onNext(event.data));
  }

  /**
   * Worker error event callback.
   * @param {object} error .
   */
  function _Error(error) {
    state.subscribers.map(
      subscriber => subscriber.onError(new Error(error.message))
    );
  }
}
