import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { AccountService } from '../services/AccountService';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-new-account',
  imports: [FormsModule],
  templateUrl: './new-account.html',
  styleUrl: './new-account.css',
})
export class NewAccount {
  
  title = 'Sign-up Sheet!';

  @ViewChild('f', { static: false })
  signupForm!: NgForm;

  // user = {
  //   email: '',
  //   username: '',
  //   npassword: '',
  //   cpassword: '',
  //   passcode: ''
  // }

  newAccount = new Account();

  submitted = false;

  resultData: any = undefined;

  constructor (private accountService: AccountService, private router: Router) {}

  // Create a new account
  onSubmit() {

    // Make sure the password is correctly chosen
    if (this.signupForm.value.userData.npassword == this.signupForm.value.userData.cpassword ){
      // this.submitted = true;
      // this.user.email = this.signupForm.value.userData.email;
      // this.user.username = this.signupForm.value.userData.username;
      // this.user.npassword = this.signupForm.value.userData.npassword;
      // this.user.cpassword = this.signupForm.value.userData.cpassword;
      // this.user.passcode = this.signupForm.value.userData.passcode;

      // Save the form information
      this.newAccount.email = this.signupForm.value.userData.email;
      this.newAccount.username = this.signupForm.value.userData.username;
      this.newAccount.password = this.signupForm.value.userData.npassword;
      this.newAccount.passcode = this.signupForm.value.userData.passcode;
    } else {
      alert("Make sure you got your new password written right!");
      this.signupForm.reset();
      return;
    }
    
    this.signupForm.reset();

    // FIXME: Make sure the new account is accessable as soon as the user goes back to the login screen.
    // This time, we handle the asynchronous response INSIDE the ".then()" block
    this.accountService.createAccount(this.newAccount.username, this.newAccount.email, this.newAccount.password, 
      this.newAccount.passcode)
      .then((data) => {
        console.log("Resulting Data: ");
        console.log(data);
        this.resultData = data;

        // Now, the account can be accessed immediately after going back to the log-in screen.
        // If the account was successfully made, go back to the log-in screen.
        if (this.resultData != -1) {
          console.log('New account made: ', this.resultData);
          alert('New Account made! Let the vacation planning journey begin!');
          this.router.navigate(['/log-in']);

        // If the account was not successfully made, don't do anything.
        } else {
          console.log('Account creation failed. Sorry.');
          alert('Sorry, Account creation failed. Try again later!');
        }
      }).catch ((error: any) => {
        console.error("Firebase account creation failed dramatically: ", error);
        alert("Sorry, an error has occured while creating accounts. You will have to wait to create your account.");
      });
  }
}
