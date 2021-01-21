import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore, private router: Router) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      });
     }


     get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null ) ? true : false;
    }

    loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
      return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    signupUser(email: string, password: string): Promise<any> {

      return this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((newUserCredential: firebase.auth.UserCredential) => {
  const uuid = newUserCredential.user.uid;
          this.afFirestore
            .doc(`/LecturerProfile/${newUserCredential.user.uid}`)
            .set({ uuid, email});
        })
        .catch(error => {
          console.error(error);
          throw new Error(error);
        });
    }

    resetPassword(email: string): Promise<void> {
      return this.afAuth.sendPasswordResetEmail(email);
    }

    logoutUser(): Promise<void> {
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['login']);
      });
    }
}
