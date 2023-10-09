import { configureStore, combineReducers, ThunkDispatch, AnyAction, Store, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth-slice';
import userReducer from './slices/user-slice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
const persistConfig = {
    key: 'latipe',
    version: 1.1,
    storage,
};


export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
    dispatch: AppThunkDispatch;
};

//4. create the store with your custom AppStore
export const store: AppStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

// you can also create some redux hooks using the above explicit types
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const persistor = persistStore(store);
