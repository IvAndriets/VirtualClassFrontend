import { Inject, Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityOp,
  ofEntityOp,
} from '@ngrx/data';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { Status } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class BaseEntityCollectionService<T> extends EntityCollectionServiceBase<T> {

  constructor(
    @Inject(String) public override entityName: string,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
  ) {
    super(entityName, serviceElementsFactory);
  }

  get status$(): Observable<Status> {
    return combineLatest([
      this.loaded$,
      this.loading$.pipe(
        distinctUntilChanged(),
        debounceTime(50),
        tap(loading => loading
          ? this.dispatch(this.createEntityAction('/dummy/error' as any))
          : null),
      ),
      this.errors$.pipe(
        map(errors => errors.payload.data?.error?.error),
        startWith(null),
      ),
    ]).pipe(
      map(([resolved, pending, err]) => ({
        resolved,
        pending,
        rejected: !!err,
        err,
      })),
    );
  }

  /**
   * Get server data changed
   */
  get serverDataChanged$(): Observable<any> {
    return this.entityActions$.pipe(
      ofEntityOp([
        EntityOp.SAVE_ADD_ONE_SUCCESS,
        EntityOp.SAVE_ADD_MANY_SUCCESS,
        EntityOp.SAVE_UPDATE_ONE_SUCCESS,
        EntityOp.SAVE_UPDATE_MANY_SUCCESS,
        EntityOp.SAVE_DELETE_ONE_SUCCESS,
        EntityOp.SAVE_DELETE_MANY_SUCCESS,
      ]),
      startWith(null),
    );
  }

}
