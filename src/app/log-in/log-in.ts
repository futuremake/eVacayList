import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../services/AccountService';
import { Account } from '../models/account.model';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/CommunicationService';
import { AsyncPipe } from '@angular/common';
import { DocumentData, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-log-in',
  imports: [ FormsModule ],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {

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

  rawAccounts: any;

  holderAccount: Account = new Account();

  processedAccounts: any;

  // The Imported Services
  constructor(private accountService: AccountService, private router: Router, private commService: CommunicationService) { }

  ngOnInit(): void {
    // // Retrieving the Firestore Accounts
    // this.rawAccounts = this.accountService.retrieveAccounts().then(data => {
    //   console.log(data);
    //   if (data instanceof String) {
    //     console.log("An Error has occurred");
    //   }

    //   if (data instanceof Array) {
    //     data.forEach((item: any) =>{
    //       console.log(item);
    //       this.accounts.push(item);
    //     });
    //   }
    // });

    // Retrieving the Firestore Accounts part 2
    this.rawAccounts = this.accountService.retrieveAccounts();

    console.log("The raw account Data: ");
    console.log(this.rawAccounts);

    this.rawAccounts.then((data: any) => {

      console.log("The raw account values: ");
      console.log(data);

      for (const item of data) {
        // console.log("Item to put into accounts: ");
        // console.log(item);
        this.holderAccount.email = item.email;
        this.holderAccount.id = item.id;
        this.holderAccount.username = item.username;
        this.holderAccount.password = item.password;
        this.holderAccount.passcode = item.passcode;
        
        this.accounts.push(this.holderAccount);
        this.holderAccount = new Account();
      }

      console.log("The Main Account Data: ")
      console.log(this.accounts);
    });
    
    // console.log("The Main Account Data: ")
    // console.log(this.accounts);
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
}
