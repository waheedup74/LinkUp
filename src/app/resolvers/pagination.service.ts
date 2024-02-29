import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { BackendConnector } from '../services/backendconnector.service';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  constructor(private backendService: BackendConnector) { }

  getPageContents(pageId: number) {
    return this.backendService.getSinglePage(pageId);
  }
}

export const paginationResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  return inject(PaginationService).getPageContents(+route.params['pageId']);
};