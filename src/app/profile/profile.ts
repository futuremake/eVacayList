import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { CommunicationService } from '../services/CommunicationService';
import { Router } from '@angular/router';
import { AccountService } from '../services/AccountService';
import { Account } from '../models/account.model';
import { VacationService } from '../services/VacationService';
import { Vacation } from '../models/vacation.model';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  // The variables
  title = 'This is your Profile!';

  @ViewChild('f', { static: false })
  updateForm!: NgForm;

  // user = {
  //   id: -1,
  //   username: 'newTraveler',
  //   email: 'ntraveler@yahoo.com',
  // }

  submitted = false;

  receivedAccountId: number | undefined = -1;

  currentAccount = new Account();

  hasVacay: boolean = false;

  vacations: Vacation[] = [];

  // The imported services
  constructor(private commService: CommunicationService, private router: Router, private accountService: AccountService,
    private vacationService: VacationService) {}

  ngOnInit(): void {

    // The placeholder values
    this.currentAccount.id = -1;
    this.currentAccount.username = 'newTraveler';
    this.currentAccount.email = 'ntraveler@yahoo.com';
    this.currentAccount.password = '???????';
    this.currentAccount.passcode = '???????';
    
    // Receiving the account id from the previous screen
    this.commService.currentData$.subscribe((data) => {
      this.receivedAccountId = data;
      console.log("Retrieved Account Id: " + this.receivedAccountId);
    });

    // Retrieving the account and showing its' details
    this.accountService.retrieve().subscribe((data) => {
      if (data._embedded == undefined) {
        console.log(data);
        // this.user.id = data.id;
        // this.user.email = data.email;
        // this.user.username = data.username;

        this.currentAccount.id = data.id;
        this.currentAccount.username = data.username;
        this.currentAccount.email = data.email;
        this.currentAccount.password = data.password;
        this.currentAccount.passcode = data.passcode;
      } else {
        for (let account of data._embedded.accounts) {
          console.log(data);
          if(account.id == this.receivedAccountId) {
            // this.user.id = account.id;
            // this.user.email = account.email;
            // this.user.username = account.username;
            
            this.currentAccount.id = account.id;
            this.currentAccount.email = account.email;
            this.currentAccount.username = account.username;
            this.currentAccount.password = account.password;
            this.currentAccount.passcode = account.passcode;
          }
        }
      }
    });

    // Checking if this account has any vacations in it
    this.vacationService.retrieve().subscribe((data) => {
      console.log(data);
      if (data._embedded == undefined){
        this.vacations = data;
        if (this.vacations[0].account_id == this.receivedAccountId) {
            this.hasVacay = true;
            console.log('Does this Account have any vacations? ' + this.hasVacay);
          }
      } else {
        for (let vacation of data._embedded.vacations) {
          if (vacation.account_id == this.receivedAccountId) {
            this.hasVacay = true;
            console.log('Does this Account have any vacations? ' + this.hasVacay);
            break;
          }
        }
      }
    });

  }

  // Going back to the vacation list page
  vacayListPath(): void {
    alert('Going back to the vacay list!');
    this.commService.transmitData(this.currentAccount.id);
    this.router.navigate(['/vacation-list']);
  }

  // Going to the help page
  helpPagePath(): void {
    alert('Want some help? To the help center!');
    this.commService.transmitData(this.currentAccount.id);
    this.router.navigate(['/how-to']);
  }

  // Changing Account Profile Info
  onSubmit() {
    // this.submitted = true;
    // this.user.username = this.signupForm.value.userData.username;
    // this.user.email = this.signupForm.value.userData.email;
    // this.signupForm.reset();
    this.currentAccount.email = this.updateForm.value.userData.email;
    this.currentAccount.username = this.updateForm.value.userData.username;
    
    this.accountService.updateAccount(this.currentAccount.id, this.currentAccount.username, this.currentAccount.email, 
    this.currentAccount.password, this.currentAccount.passcode);
    alert('You have successfully updated your account!');
    this.router.navigate(['/vacation-list']);
  }

  // Deleting an account
  removeAccount(): void {

    // If the Account doesn't exist, don't delete.
    if (this.receivedAccountId == undefined || this.receivedAccountId < 0) {
      console.log('You can\'t delete an account that doesn\'t exist!');
      alert('You can\'t delete an account that doesn\'t exist!');
    } else {

      // If the account has any vacations, don't delete.
      if (this.hasVacay) {
        console.log('You can\'t delete an account that has vacations!');
        alert('You can\'t delete an account that has vacations!');

      // If the account has no vacations, then delete.
      } else {
        this.accountService.deleteAccount(this.currentAccount.id);
        console.log('Thank you for making an account with us. When you need more vacation planning help, You know where to find us!');
        alert('Thank you for making an account with us. When you need more vacation planning help, You know where to find us!');
        this.router.navigate(['/home']);
      }
    } 
  }
}
