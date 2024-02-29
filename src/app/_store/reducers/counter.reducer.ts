import { createReducer, on } from "@ngrx/store";
import { decrementAction, incrementAction, updateUserAction } from "../actions/counter.actions";

const initialState = 0;
const initialUserState = '';

export const counterReducer = createReducer(
    initialState,
    on(incrementAction, (state, action) => state + action.value),
    on(decrementAction, (state, action) => state - action.value)
);

export const userReducer = createReducer(
    initialUserState,
    on(updateUserAction, (state, action) => action.name)
);

// used for AOT
// export function counterReducerAOT(state: number, action: Action) {
//     return counterReducer(state, action);
// }