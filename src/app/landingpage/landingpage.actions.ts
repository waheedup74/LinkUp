import { Action } from "@ngrx/store";

export const ADD_GROUP = "ADD_GROUP";
export const DELETE_GROUP = "DELETE_GROUP";

export class AddGroup implements Action {
   readonly type = ADD_GROUP;
   constructor(public payload: any) { }
}

export class DeleteGroup implements Action {
   readonly type = DELETE_GROUP;
   constructor(public payload: any) { }
}

export type groupActions = AddGroup | DeleteGroup;