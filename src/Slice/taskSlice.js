import { createSlice } from "@reduxjs/toolkit";


const taskSlice = createSlice({
    name: "taskList",
    initialState: {
        tasks: [],
        contacts: []
    },
    reducers: {
        addContacts: (state,action) => {
            state.contacts = action.payload
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload)
        },
        deleteTask: (state, action) => {
            let newList = state.tasks.filter((item) => item.id !== action.payload.id)
            state.tasks = newList
        },
        markComplete: (state, action) => {
            let modifiedList = state.tasks.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        completed: !item.completed
                    }
                }
                return item

            })
            state.tasks = modifiedList
        },
        assignToContact: (state, action) => {
            let modifiedList = state.tasks.map((item) => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        ...action.payload
                    }
                }
                return item

            })
            state.tasks = modifiedList
        }
    }
})


export default taskSlice.reducer
export const { addTask, deleteTask, markComplete, assignToContact , addContacts} = taskSlice.actions