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

  result: any = undefined;

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

    // Retrieving the account from Firestore and showing its details
    this.accountService.retrieveAccounts().then((data) => {
      console.log("Data recieved: " + data);

      if (data instanceof String) {
        console.log("An Error has occurred");
      }

      if (data instanceof Array) {
        data.forEach(item => {
          if (item.id == this.receivedAccountId) {
            console.log("Account found: " + item);
            this.currentAccount.id = item.id;
            this.currentAccount.email = item.email;
            this.currentAccount.username = item.username;
            this.currentAccount.password = item.password;
            this.currentAccount.passcode = item.passcode;
          }
        });
      }
    });

    // // Checking if this account has any vacations in it
    // this.vacationService.retrieve().subscribe((data) => {
    //   console.log(data);
    //   if (data._embedded == undefined){
    //     this.vacations = data;
    //     if (this.vacations[0].account_id == this.receivedAccountId) {
    //         this.hasVacay = true;
    //         console.log('Does this Account have any vacations? ' + this.hasVacay);
    //       }
    //   } else {
    //     for (let vacation of data._embedded.vacations) {
    //       if (vacation.account_id == this.receivedAccountId) {
    //         this.hasVacay = true;
    //         console.log('Does this Account have any vacations? ' + this.hasVacay);
    //         break;
    //       }
    //     }
    //   }
    // });

    // Checking if this account has any vacations in it from Firestore
    this.vacationService.retrieveVacations(this.receivedAccountId).then((data) => {
      if (data instanceof Array) {
        console.log("Vacations retrieved from this account: " + data.length);
      }

      if (data instanceof Array){
        data.forEach(item => {
          if (item != undefined && item.account_id == this.receivedAccountId) {
            this.hasVacay = true;
          }
        });
      } else {
        console.log("Sorry, An Error has occurred Please try again later.");
        alert("Sorry, an Error has occurred. Please try again later.");
      }
    });
    console.log('Does this Account have any vacations? ' + this.hasVacay);

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
    
    this.result = this.accountService.editAccount(this.currentAccount.id, this.currentAccount.username, this.currentAccount.email, 
      this.currentAccount.password, this.currentAccount.passcode);
    
    // Make sure the profile info was really changed
    if (this.result != undefined && this.result != -1) {
      alert('You have successfully updated your account!');
      this.commService.transmitData(this.receivedAccountId);
      this.router.navigate(['/vacation-list']);
    
    // Catch any Errors that occur
    } else {

    }
    
    
  }

  // Deleting an account
  removeAccount(): void {

    // If the Account doesn't exist, don't delete.
    if (this.receivedAccountId == undefined || this.receivedAccountId == -1) {
      console.log('You can\'t delete an account that doesn\'t exist!');
      alert('You can\'t delete an account that doesn\'t exist!');
    } else {

      // If the account has any vacations, don't delete.
      if (this.hasVacay) {
        console.log('You can\'t delete an account that has vacations!');
        alert('You can\'t delete an account that has vacations!');

      // If the account has no vacations, then delete.
      } else {
        this.result = undefined;

        this.result = this.accountService.removeAccount(this.currentAccount.id);
        
        if (this.result != undefined && this.result != -1) {
          console.log('Thank you for making an account with us. When you need more vacation planning help, You know where to find us!');
          alert('Thank you for making an account with us. When you need more vacation planning help, You know where to find us!');
          this.router.navigate(['/home']);
        } else {
          console.log('Sorry, an Error has occurred. If you really want to delete your account, wait until later.')
        }
      }
    } 
  }
}
