import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { ping } from './enhancers/ping';
import thunk from 'redux-thunk';

export default function configureStore(intitialState) {
    const middlewares = [
        thunk,
        ping
    ];

    const store = createStore(
        rootReducer,
        intitialState,
        applyMiddleware(...middlewares));

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
