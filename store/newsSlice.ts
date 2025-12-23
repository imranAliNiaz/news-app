import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NewsState {
    selectedCategory: string;
}

const initialState: NewsState = {
    selectedCategory: "world",
};

const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
    },
});

export const { setCategory } = newsSlice.actions;
export default newsSlice.reducer;
