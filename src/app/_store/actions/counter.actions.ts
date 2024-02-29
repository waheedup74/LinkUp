import { createAction, props } from "@ngrx/store";

export const incrementAction = createAction(
    'INCREMENT',
    props<{value: number}>()
);
export const decrementAction = createAction(
    'DECREMENT',
    props<{value: number}>()
);

export const updateUserAction = createAction(
    'UPADTE-USER',
    props<{name: string}>()
);
