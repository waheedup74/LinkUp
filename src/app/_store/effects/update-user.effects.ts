import { Actions, createEffect, ofType } from "@ngrx/effects";
import { updateUserAction } from "../actions/counter.actions";
import { tap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { userUpdateSelector } from "../selectors/counter.selector";
import { Injectable } from "@angular/core";

@Injectable()
export class UpdateUserEffect {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<{ user: string }>) { }

    updateUserEffect = createEffect(
        () => this.actions$.pipe(
            ofType(updateUserAction),
            withLatestFrom(this.store.select(userUpdateSelector)),
            tap((stateData) => {
                return this.http
                    .patch('http://localhost:4000/api/update-user/62baa93e7d6862b56b079d9f', { "name": stateData[1] }).subscribe();
            })
        ), { dispatch: false }
    );
}





