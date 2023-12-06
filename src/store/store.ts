import { configureStore, combineReducers, ThunkDispatch, AnyAction, Store } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth-slice';
import userReducer from './slices/user-slice';
import categoryReducer from './slices/categories-slice';
import productReducer from './slices/products-slice';
import storeReducer from './slices/stores-slice';
import ratingReducer from './slices/ratings-slice';
import cartReducer from './slices/carts-slice';
import searchReducer from './slices/search-slice';
import orderReducer from './slices/orders-slice';

import {
	persistStore,
	persistReducer,
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
	categories: categoryReducer,
	products: productReducer,
	stores: storeReducer,
	ratings: ratingReducer,
	carts: cartReducer,
	searchs: searchReducer,
	order: orderReducer,
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
		serializableCheck: false
	}),
});

// you can also create some redux hooks using the above explicit types
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const persistor = persistStore(store);
