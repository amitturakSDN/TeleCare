import {applyMiddleware, createStore} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import {rootReducer} from '@/reducers';
import {storage} from '@/storage';
import {createLogger} from 'redux-logger';
const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: ['error', 'status'],
    whitelist: ['user'],
};

const middleware = [thunk];
if (__DEV__ && !process.env.JEST_WORKER_ID) {
    // const createDebugger = require('redux-flipper').default
    middleware.push(createLogger());
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = createStore(
//   persistReducer(persistConfig, rootReducer),
//   applyMiddleware(...middleware)
// );
export const store = configureStore({
    reducer: persistedReducer,
    // middleware: getDefaultMiddleware(
    //     {
    //         immutableCheck: false,
    //         serializableCheck: false,
    //     },
    //     ['redux-immutable-state-invariant'],
    // ),
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(logger),
});

export const persistor = persistStore(store);
