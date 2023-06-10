import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedInGaurd: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    console.log('In Login method of Auth Service');

    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((logRef: any) => {
        this.toastr.success('Logged In Successfully');
        this.loaduser();
        this.isLoggedInGaurd = true;

        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toastr.warning(e);
      });
    console.log('Leaving login method');
  }
  loaduser() {
    console.log('User Is being loaded into local storage');

    this.afAuth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      this.loggedIn.next(true);
    });
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.toastr.success('User Logged out Successfully');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGaurd = false;
      this.router.navigate(['/login']);
    });
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
