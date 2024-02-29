import { createSelector } from "@ngrx/store";

interface countState {
    'counter': number;
}

interface userState {
    'user': string;
}

export const countSelector = (state: countState) => state.counter

export const countDoubleSelector = createSelector(
    countSelector,
    (state) => state * 2
);


export const userUpdateSelector = (state: userState) => state.user
