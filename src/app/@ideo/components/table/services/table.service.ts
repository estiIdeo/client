import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LazyLoadEvent } from '../events/lazy-load.event';
import { SortDirection } from '../models/types';
import { StorageKeysService } from '../../../infrastructure/services/storage-keys.service';

@Injectable()
export class TableService {
  private _lazyLoadSubject$ = new Subject<LazyLoadEvent>();
  private _stateKey: string;
  private _state: LazyLoadEvent = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    sorts: [],
    filters: {},
  };

  constructor(private storageKeysService: StorageKeysService) { }

  public emitLazyLoadEvent() {
    this._lazyLoadSubject$.next(this._state);
  }

  public lazyLoadEvent(): Observable<LazyLoadEvent> {
    return this._lazyLoadSubject$.pipe(debounceTime(300));
  }

  public getTableState(): LazyLoadEvent {
    return JSON.parse(JSON.stringify(this._state));
  }

  public setStateFromStorage(stateKey: string) {
    this._stateKey = stateKey;
    const storageState = this.storageKeysService.getItem<LazyLoadEvent>(this._stateKey);
    if (!!storageState) {
      Object.keys(this._state).forEach((k) => {
        this._state[k] = storageState[k];
      });
    }
  }

  get page() {
    return this._state.page;
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  set sorts(sorts: string[]) {
    this._set({ sorts });
  }

  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  set filters(filters: any) {
    this._set({ filters });
  }

  private _set(patch: Partial<LazyLoadEvent>) {
    Object.assign(this._state, patch);
    this.setPaginationOnStorage(this._state);
    this.emitLazyLoadEvent();
  }

  private setPaginationOnStorage(state: LazyLoadEvent) {
    const storedFilters = this.storageKeysService.getItem<LazyLoadEvent>(this._stateKey);
    if (storedFilters) {
      //for not save query prarms filters
      const store = { ...state };
      store.filters = storedFilters.filters;
      this.storageKeysService.setItem(this._stateKey, store);
    } else {
      this.storageKeysService.setItem(this._stateKey, state);
    }
  }

  public resetState() {
    this._state = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
      sorts: [],
      filters: {},
    }
  }
}
