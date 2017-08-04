(function(){

  'use strict';

  var countText = document.getElementById('js-text-count');

  var decrementButton = document.getElementById('js-button-decrement'),
      incrementButton = document.getElementById('js-button-increment');

  var store, sagaMiddleware, unsubscribe;

  /**
   * counter reducer
   *
   * @param {number|undefined} state
   * @param {Object} action
   */
  function counter(state, action) {
    // NOTE: or Redux.createStore(counter, 0);
    if (typeof state === 'undefined') {
      return 0;
    }

    switch (action.type) {
      case 'DECREMENT':
        return state - 1;
      case 'INCREMENT':
        return state + 1;
      default:
        return state;
    }
  }

  function delay(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }

  function* incrementAsync() {
    yield ReduxSaga.effects.call(delay, 1000);
    yield ReduxSaga.effects.put({
      type: 'INCREMENT'
    });
  }

  function* counterSaga() {
    yield ReduxSaga.effects.takeEvery('INCREMENT_ASYNC', incrementAsync);
  }

  sagaMiddleware = ReduxSaga.default();

  store = Redux.createStore(
    counter,
    Redux.applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(counterSaga);

  /**
   * render function
   */
  function render() {
    countText.innerHTML = store.getState().toString();
  }

  /**
   * onclick handler for decrement button
   */
  function onClickDecrement() {
    store.dispatch({
      type: 'DECREMENT'
    });
  }

  /**
   * onclick handler for increment button
   */
  function onClickIncrement() {
    store.dispatch({
      type: 'INCREMENT_ASYNC'
    });
  }

  decrementButton.addEventListener('click', onClickDecrement, false);
  incrementButton.addEventListener('click', onClickIncrement, false);

  render();

  unsubscribe = store.subscribe(render);

}());
