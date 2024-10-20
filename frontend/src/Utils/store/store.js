import {configureStore} from '@reduxjs/toolkit';
import isLoginReducer from '../functionalties/isLoginSlice.js';
import currentUserReducer from '../functionalties/currentUserSlice.js'; 
export const store = configureStore({
    reducer : {
        auth : isLoginReducer,
        user : currentUserReducer,
    },
})