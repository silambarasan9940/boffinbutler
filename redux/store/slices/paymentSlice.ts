import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentMethods {
    method: string;
}

const initialState: PaymentMethods = {
    method: "",  
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPaymentMethod: (state, action: PayloadAction<string>) => {
            state.method = action.payload;
        },
    },
});

export const { setPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;
