import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../services/AccountService';
import { Account } from '../models/account.model';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/CommunicationService';
import { AsyncPipe } from '@angular/common';
import { DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-log-in',
  imports: [ FormsModule ],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  
  // user = {
  //   username: '',
  //   password: ''
  // };

  // submitted = false;

  // onSubmit() {
  //   this.submitted = true;
  //   this.user.username = this.signupForm.value.userData.uname;
  //   this.user.password = this.signupForm.value.userData.pword;
  //   this.signupForm.reset();
  // }

  // New Version

  // The variables
  title = 'The Bouncer Screen';
  
  @ViewChild('f', { static: false })
  signupForm!: NgForm;

  username = '';
  password = '';

  submitted = false;

  accounts: Account[] = [];

  accountFound = false;

  accountId: number|undefined = -1;

  // The Imported Services
  constructor(private accountService: AccountService, private router: Router, private commService: CommunicationService) { }

  ngOnInit(): void {

    // Retrieving the accounts
    this.accountService.retrieve().subscribe((data) => {
        console.log(data);
        if (data._embedded == undefined) {
          this.accounts.push(data);
        } else {
          this.accounts = data._embedded.accounts;
        }
      });
  }

  // Logging in to the app 
  onSubmit() {

    // Taking the input username and password information for processing
    this.submitted = true;
    this.username = this.signupForm.value.userData.uname;
    this.password = this.signupForm.value.userData.pword;
    this.signupForm.reset();

    // Checking if the user has an account
    for(let account of this.accounts) {
      if (this.username == account.username && this.password == account.password && account.id != undefined){ 
        this.accountFound = true;
        this.accountId = account.id;
        break;
      }
    }

    if (this.accountFound == true) {

      // If the account exixts, go to the list.
      console.log("Found the Account!");
      alert("Found the Account! To the List building site!");
      this.commService.transmitData(this.accountId);
      this.router.navigate(['/vacation-list']);
    } else {

      // If the account does not exist, try again.
      console.log("Sorry, we don't have your account.");
      alert("Sorry, we don't have your account. Try again!");
    }
  }


  // Version 3



}
