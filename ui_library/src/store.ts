import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import formReducer from './reducers/formReducer';

const reducer = combineReducers({
    form: formReducer
});

export const store = configureStore({
    reducer: reducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;