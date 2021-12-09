import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {User, UserWithTokens} from "../models/user.model";
import {AuthRequest, AuthResponse} from "../models/auth.model";
import {TokenStorageService} from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public errorMessage: string = '';
  public isLoginFailed: boolean = false;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {

  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/registration', user)
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap({
            next: (data) => {
              this.tokenStorage.saveToken(data.accessToken);
              this.tokenStorage.saveRefreshToken(data.refreshToken);
              this.tokenStorage.saveUser(data);
            },
            error: (err) => {
              this.errorMessage = err.error.message;
              this.isLoginFailed = true;
            }
          }
        )
      )
  }

  refreshToken() {
    return this.http.get<UserWithTokens>("/api/auth/refresh");
  }
}
