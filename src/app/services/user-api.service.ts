import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class UserApiService {
    constructor(private http: HttpClient) {}
  
    getUsers(): Observable<User[]> {
      return this.http.get<User[]>('/users');
    }
  
    addUser(name: string, active: boolean): Observable<number> {
      return this.http.post<number>('/users', { name, active });
    }
  
    checkUniqueUserName(name: string): Observable<HttpResponse<number>> {
      return this.http.get<number>('/check-user-name', { params: { name }, observe: 'response' });
    }
  }