import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  public loginInvalid = false;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || '/rooms';
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.form.disable()
    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate([this.returnUrl]),
      error: () => this.form.enable()
      }
    )
  }
}
