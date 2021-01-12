import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../account/auth/login/login';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;
    baseUrl: string;

    constructor(private http: HttpClient, private router: Router) {
        this.baseUrl = environment.baseUrl + "auth/"
    }

    /**
     * Returns the current user
     */
    public currentUser(): User {
        return this.user;
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string): Observable<Login> {
        return this.http.post<Login>(this.baseUrl + "login", { username: email, password }).pipe(tap(res => {
            localStorage.setItem('auth', res.token)
            console.log(res);

            let user: User = {
                id: res.userId,
                username: res.userName,
                token: res.token
            }

            this.user = user;

            console.log(this.user);
            
            
            
        }));
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
    }

    /**
     * Logout the user
     */
    logout() {
        localStorage.removeItem("auth");
        this.user = null;
        this.router.navigateByUrl("/account/login")
    }

    getUserById(): Observable<any>{
        return this.http.get("http://localhost:3000/api/user/5")
    }
}

