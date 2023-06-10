import { Component, OnInit } from '@angular/core';
import { ReCaptchaEnterpriseProvider } from '@angular/fire/app-check';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';
  isLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();

    this.isLoggedIn$.subscribe((value) => {
      if (value) {
        console.log('Logged In');
        const userJson = localStorage.getItem('user');
        console.log(`User value in Header component bf4 fromating ${userJson}`);
        if (userJson !== null) {
          const user = JSON.parse(userJson);
          this.userEmail = user.email;
        }
      } else {
        console.log(`Not Logged in ${value}`);
      }
    });
  }

  onLogOut() {
    this.authService.logout();
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.userEmail = '';
  }
}
