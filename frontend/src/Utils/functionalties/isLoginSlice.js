import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isLogin: false,
}

export const isLoginSlice = createSlice({
    name : "isLogin",
    initialState,
    reducers : {
        login : (state) => {
            state.isLogin = true;
        },
        logout : (state) => {
            state.isLogin = false;
        }
    }
});

export const {login , logout} = isLoginSlice.actions;

export default isLoginSlice.reducer;