import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { Account } from '../models/account.model';
import { AccountService } from '../services/AccountService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  imports: [FormsModule],
  templateUrl: './new-password.html',
  styleUrl: './new-password.css',
})
export class NewPassword implements OnInit {

  // The Variables

  title = "Rewrite your Password!";

  @ViewChild('f', { static: false })
  signupForm!: NgForm;

  user = {
    email: '',
    username: '',
    new_password: '',
    confirm_password: '',
    passcode: ''
  }

  currentAccount = new Account();

  accounts: Account[] = [];

  submitted = false;

  foundAccountId: number | undefined = -1;

  isAccountFound: boolean = false;

  // The imported services
  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    
    // Get the accounts in the database
    this.accountService.retrieve().subscribe((data) => {
      console.log(data);

      if (data._embedded == undefined) {
        this.accounts = data;
      } else {
        for (let account of data._embedded.accounts){
          this.accounts.push(account);
        }
      }
    });

  }

  // Submit the password change request
  onSubmit() {
    // if (this.signupForm.value.userData.npassword == this.signupForm.value.userData.cpassword) {
    //   this.submitted = true;
    //   this.user.email = this.signupForm.value.userData.email;
    //   this.user.username = this.signupForm.value.userData.uname;
    //   this.user.new_password = this.signupForm.value.userData.npassword;
    //   this.user.confirm_password = this.signupForm.value.userData.cpassword;
    //   this.user.passcode = this.signupForm.value.userData.passcode;  
    // }
    // this.signupForm.reset();

    // Transfer the input data into an Account
    this.currentAccount.email = this.signupForm.value.userData.email;
    this.currentAccount.username = this.signupForm.value.userData.uname;
    this.currentAccount.password = this.signupForm.value.userData.npassword;
    this.currentAccount.passcode = this.signupForm.value.userData.passcode;
    this.signupForm.reset();

    // Find the Account to change the password for
    for (let account of this.accounts) {

      // If the username, email, and passcode are registered, get the account.
      if (account.username == this.currentAccount.username && account.email == this.currentAccount.email
        && account.passcode == this.currentAccount.passcode) {
        this.foundAccountId = account.id;
        console.log('We found your account Id! it is: ' + this.foundAccountId);
        this.isAccountFound = true;
        break;
      }
      console.log('We can\'t find your account!');
    }

    // If the account exists, change the password.
    if (this.isAccountFound) {
      this.accountService.updateAccount(this.foundAccountId, this.currentAccount.username, this.currentAccount.email,
        this.currentAccount.password, this.currentAccount.passcode);
      console.log('Your password was successfully changed. Now you can plan your Vacay!');
      alert('Your password was successfully changed. Now you can plan your Vacay!');
      this.router.navigate(['/log-in']);

    // If the account does not exist, don't do anything.
    } else {
      alert('We can\'t change a password for an account that does not exist!');
      console.log('We can\'t change a password for an account that does not exist!');
    }
  }
}
