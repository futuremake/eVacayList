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

  // New Version

  // The Variables
  title: String | undefined = 'Username\'s List:';

  receivedAccountId: number | undefined = -1;

  chosenVacationId: number | undefined = -1;

  rawAccounts: any;

  // accounts: Account[] = [];

  rawVacations: any;

  vacations: Vacation[] = [];

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

    // Retrieving the account from Firebase
    this.rawAccounts = this.accountService.retrieveAccounts();
    
    this.rawAccounts.then((data: any) => {
      
      console.log(data);
      if (data instanceof String) {
        console.log("An Error has occurred.");
      }
      
      if (data instanceof Array) {
        data.forEach(item => {
          if (item.id == this.receivedAccountId){
            this.title = item.username + '\'s List:';
            console.log(this.title); 
            return;
          }
        });
      }
    });

    // Getting the user's vacation plans from Firebase
    this.rawAccounts = this.vacationService.retrieveVacations(this.receivedAccountId)
    this.rawAccounts.then((data: any) => {
      console.log(data);
      console.log("Vacations for this user: ");
      data.forEach((item: any) => {
        if (item.account_id == this.receivedAccountId){
          console.log(item);
          this.vacations.push(item);
        }
      })
    });
    
  }

  // Show the user the selected vacation details.
  vacayDetailsPath(vacayId: number | undefined): void {
    this.chosenVacationId = vacayId;
    console.log('Show me the vacay details!');
    alert('Show me the vacay details!');
    this.commService.transmitData(this.receivedAccountId);
    this.commService.transmitData2(this.chosenVacationId);
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
    if (this.receivedAccountId != undefined && this.receivedAccountId != -1) {
      console.log('Let\'s build a vacay!');
      alert('Let\'s build a vacay!');
      this.commService.transmitData(this.receivedAccountId);
      console.log("Transferring AccountId: " + this.receivedAccountId);
      this.commService.transmitData2(this.chosenVacationId);
      console.log("Transferring VacationId: " + this.chosenVacationId);
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
    if (this.receivedAccountId != undefined && this.receivedAccountId != -1){
      // Get the value to search vacations for.
      // this.searchValue = this.searchForm.value.userData.searchBox;
      this.processedValue = this.searchValue.toString().substring(9).replace(']', '');
      console.log('Searching for Vacations with this title: ' + this.processedValue);
      this.vacations = [];

      // Searching for vacations using Firestore
      const searchVacations = this.vacationService.retrieveVacations(this.receivedAccountId)
      searchVacations.then((data) => {
        console.log("Vacation Data to search through: "); 
        data.forEach((item: any) => {
          if (item.account_id == this.receivedAccountId && item.title != undefined && item.title.includes(this.processedValue)) {
            console.log("Adding Item: " + item);
            this.vacations.push(item);
          }
        });
      });
    
    // If the account does not exist, don't do anything.
    } else {
      console.log('We can\'t help you search for a vacation for an account that doesn\'t exist!');
      alert('We can\'t help you search for a vacation for an account that doesn\'t exist!');
    }
  }
}
