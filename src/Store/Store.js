import { configureStore } from "@reduxjs/toolkit";
import taskSlice from  "../Slice/taskSlice"

export const store = configureStore({
    reducer: {
        task: taskSlice
    }
})