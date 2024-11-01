import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { UserApiService } from '../services/user-api.service';
import { catchError, of, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

interface Entity<T> {
  isLoading: boolean;
  error: string | null;
  entities: T[];
}

export interface UserState {
  users: User[];
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  // Services
  private userApiService = inject(UserApiService);

  private state = signal<Entity<User>>({
    error: null,
    isLoading: false,
    entities: [],
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  users = computed(() => this.state().entities);
  errorMessage = computed(() => this.state().error);

  // Actions
  private usersSubject = new Subject<void>();
  private addUserSubject = new Subject<{ name: string; active: boolean }>();

  constructor() {
    this.usersSubject
      .asObservable()
      .pipe(
        tap(() => this.setLoadingIndicator(true)),
        switchMap(() => this.userApiService.getUsers()),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        takeUntilDestroyed()
      )
      .subscribe((users) => this.setUsers(users));

    this.addUserSubject
      .asObservable()
      .pipe(
        tap(() => this.setLoadingIndicator(true)),
        switchMap(({ name, active }) => this.userApiService.addUser(name, active).pipe(tap((id) => this.setUser({ active, name, id })))),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  getUsers(): void {
    this.usersSubject.next();
  }

  addUser(name: string, active: boolean): void {
    this.addUserSubject.next({ name, active });
  }

  private setLoadingIndicator(isLoading: boolean): void {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  private setUsers(users: User[]): void {
    this.state.update((state) => ({ ...state, entities: users }));
  }

  private setUser(user: User): void {
    console.log('USER', user);
    this.state.update((state) => ({ ...state, entities: [...state.entities, user] }));
  }

  private handleError(error: HttpErrorResponse) {
    this.state.update((state) => ({ ...state, error: error.message }));
    return of([]);
  }
}
