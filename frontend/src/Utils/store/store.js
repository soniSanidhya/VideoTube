import {configureStore} from '@reduxjs/toolkit';
import isLoginReducer from '../functionalties/isLoginSlice.js';

export const store = configureStore({
    reducer : {
        isLogin : isLoginReducer,
    },
})