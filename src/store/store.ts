import { configureStore, combineReducers, ThunkDispatch, AnyAction, Store } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,

} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth-slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
const persistConfig = {
    key: 'latipe',
    version: 1.1,
    storage,
};


export const rootReducer = combineReducers({
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
    dispatch: AppThunkDispatch;
};

//4. create the store with your custom AppStore
export const store: AppStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// you can also create some redux hooks using the above explicit types
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const persistor = persistStore(store);
