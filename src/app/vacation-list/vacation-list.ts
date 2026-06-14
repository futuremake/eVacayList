import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { VacationService } from '../services/VacationService';
import { Vacation } from '../models/vacation.model';
import { CommunicationService } from '../services/CommunicationService';
import { AccountService } from '../services/AccountService';
import { Account } from '../models/account.model';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-vacation-list',
  imports: [FormsModule],
  templateUrl: './vacation-list.html',
  styleUrl: './vacation-list.css',
})
export class VacationList implements OnInit{

  // vacationListItems = [
  //   'vacay1',
  //   'vacay2',
  //   'vacay3',
  //   'vacay4',
  //   'vacay5',
  //   'vacay6',
  //   'vacay7',
  //   'vacay8'
  // ];

  // vacations: Vacation[] = [];

  // constructor (private vacationService: VacationService) { }

  // ngOnInit(): void {
  //   const vacationObservable = this.vacationService.getVacations();
  //   vacationObservable.subscribe((vacationData: Vacation[]) => {
  //     this.vacations = vacationData;
  //   }); 
  // }


  // New Version

  // The Variables
  title: String | undefined = 'Username\'s List:';

  vacations: Vacation[] = [];

  receivedAccountId: number | undefined = -1;

  chosenVacationId: number | undefined = -1;

  accounts: Account[] = [];

  // selectedVacation: Vacation = new Vacation();
  
  searchValue = signal('');

  filtedVacays: Vacation[] = [];

  @ViewChild('f', { static : false })
  searchForm!: NgForm;

  processedValue = '';

  // The imported services
  constructor(private vacationService: VacationService, private commService: CommunicationService, 
    private accountService: AccountService, private router: Router
  ) {}


  ngOnInit(): void {

    // Receiving the account id from the login screen
    this.commService.currentData$.subscribe((data) => {
      this.receivedAccountId = data;
      console.log("Retrieved Account Id: " + this.receivedAccountId);
    });

    // // Getting the vacations associated with the account
    // this.vacationService.retrieveAccountVacations(this.receivedAccountId).subscribe((data) => {
    //   console.log(data);
    //   if (data._embedded == undefined) {
    //     this.vacations.push(data);
    //   } else {
    //     this.vacations = data._embedded.vacations;
    //   }
    // });

    // Getting the user's vacation plans
    this.vacationService.retrieve().subscribe((data) => {
      console.log(data);

      // Only one vacation? Add it.
      if (data._embedded == undefined) {
        this.vacations.push(data);
      
      // More than one vacation? Only add the user's vacations.
      } else {
        for (let vacation of data._embedded.vacations) {
          if (vacation.account_id == this.receivedAccountId) {
            this.vacations.push(vacation);
          }
        } 
      }
    });

    // Retrieving the Accounts
    this.accountService.retrieve().subscribe((data) => {
        console.log(data);

        if (data._embedded == undefined) {
          this.accounts.push(data);
        } else {
          this.accounts = data._embedded.accounts;
        }

        // Changing the page title based on the user's username
        for(let account of this.accounts) {
          console.log("List Title: " + this.title);
          if (account.id == this.receivedAccountId) {
            console.log("List Title: " + this.title);
            this.title = account.username + '\'s List';
            console.log("List Title: " + this.title);
            break;
          }
        }
    });

  }

  // Show the user the selected vacation details.
  vacayDetailsPath(vacayId: number | undefined): void {
    
    // for (let vacation of this.vacations) {
    //   if (vacation.id == vacayId) {
    //     this.selectedVacation = vacation;
    //     console.log('Selected Vacation Id: ' + this.selectedVacation.id);
    //   }
    // }
    this.chosenVacationId = vacayId;
    console.log('Show me the vacay details!');
    alert('Show me the vacay details!');
    this.commService.transmitDataString(this.receivedAccountId + ',' + this.chosenVacationId);
    this.router.navigate(['/vacation-details']);
  }

  // Go back to the login screen.
  logOutPath(): void {
    alert('Want someone else to make a list? Alright then.');
    this.router.navigate(['/log-in']);
  }

  // Go to the user's profile.
  profilePath(): void {
    alert('We\'ve got your identification right here!');
    this.commService.transmitData(this.receivedAccountId);
    this.router.navigate(['/profile']);
  }

  // Add a vacation to the database.
  addVacayPath(): void {

    // If the account exists, add the vacation.
    if (this.receivedAccountId != undefined && this.receivedAccountId > 0) {
      console.log('Let\'s build a vacay!');
      alert('Let\'s build a vacay!');
      this.commService.transmitDataString( this.receivedAccountId + ',' + this.chosenVacationId);
      this.router.navigate(['/vacation-details']);

    // If the account does not exist, don't do anything.
    } else {
      console.log('We can\'t help you build a vacation for an account that does not exist!');
      alert('We can\'t help you build a vacation for an account that does not exist!');
    }
  }

  // Start searching for specific vacations by title.
  onSubmit() {

    // If the account exists, search for the account's vacations by title.
    if (this.receivedAccountId != undefined && this.receivedAccountId > 0){
      // Get the value to search vacations for.
      // this.searchValue = this.searchForm.value.userData.searchBox;
      this.processedValue = this.searchValue.toString().substring(9).replace(']', '');
      console.log('Searching for Vacations with this title: ' + this.processedValue);
      this.vacations = [];

      this.vacationService.retrieve().subscribe((data) => {
        console.log(data);

        // Only one vacation? If it has the input value, Add it.
        if (data._embedded == undefined && data.title.includes(this.processedValue)) {
          this.vacations.push(data);
        
        // More than one vacation? Only add the user's vacations if they contain the search value.
        } else {
          for (let vacation of data._embedded.vacations) {
            if (vacation.account_id == this.receivedAccountId && vacation.title.includes(this.processedValue)) {
              this.vacations.push(vacation);
            }
          } 
        }
      });
    
    // If the account exists, search for the account's vacations by title.
    } else {
      console.log('We can\'t help you search for a vacation for an account that doesn\'t exist!');
      alert('We can\'t help you search for a vacation for an account that doesn\'t exist!');
    }
  }
}
