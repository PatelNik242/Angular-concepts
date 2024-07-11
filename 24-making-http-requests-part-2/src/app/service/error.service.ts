import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject: Subject<string> = new Subject<string>();

  constructor() {}

  public emitError(errorMsg: string): void {
    this.errorSubject.next(errorMsg);
  }

  public clearError(): void {
    this.errorSubject.next('');
  }

  public getError(): Observable<string> {
    return this.errorSubject.asObservable();
  }
}
