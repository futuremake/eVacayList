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
    }
    
    this.signupForm.reset();

    const result = this.accountService.createAccount(this.newAccount.username, this.newAccount.email, this.newAccount.password, this.newAccount.passcode);

    // setTimeout(function () {
    //   console.log("Time to check the function!");
    // }, 1000);
    // If the account was successfully made, go back to the log-in screen.
    if ((result !instanceof Error) || (result.toString() != 'An unexpected error occurred.')) {
      console.log('New account made: ', result);
      alert('New Account made! Let the vacation planning journey begin!');
      this.router.navigate(['/log-in']);

    // If the account was not successfully made, don't do anything.
    } else {
      console.log('Account creation failed. Sorry.');
      alert('Sorry, Account creation failed. Try again later!');
    }
  }
}
