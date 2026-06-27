import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { CommunicationService } from '../services/CommunicationService';
import { ExcursionService } from '../services/ExcursionService';
import { Router } from '@angular/router';
import { Excursion } from '../models/excursion.model';
import { Vacation } from '../models/vacation.model';
import { VacationService } from '../services/VacationService';

@Component({
  selector: 'app-excursion-details',
  imports: [FormsModule],
  templateUrl: './excursion-details.html',
  styleUrl: './excursion-details.css',
})
export class ExcursionDetails implements OnInit {

  // New Version

  // The variables
  ExcurTitle = 'Excur 1 Details:'

  @ViewChild('f', { static: false })
  signupForm!: NgForm;

  // excursion = {
  //   accountId: -1,
  //   vacationId: -1,
  //   excursion_title: 'Excur 1 Details:',
  //   start_date: 'some time near',
  //   description: 'summarized excursion details.',
  // }

  chosenExcursion: Excursion = new Excursion();

  submitted = false;

  receivedExcurData: string | undefined = 'N/A';
  
  dataArray: string[] | undefined = [];

  receivedExcursionId: number | undefined = -1;
  receivedAccountId: number | undefined = -1;
  receivedVacationId: number | undefined = -1;

  currentDate: Date = new Date();
  excurStartDate: Date = new Date();
  vacayStartDate: Date = new Date();
  vacayEndDate: Date = new Date();

  currentVacation: Vacation = new Vacation();

  result: any = undefined;

  checkExcursion: boolean = false;

  resultData: any = undefined;

  // The imported services
  constructor(private commService: CommunicationService, private excursionService: ExcursionService,
    private router: Router, private vacationService: VacationService) { }

  ngOnInit(): void {

    // // Retrieving the Real excursion Id from the vacation details page
    // this.commService.currentData$.subscribe((data) => {
    //   console.log("The real Excursion Id: " + data);
    //   this.receivedExcursionId = data;
    // });

    // // Retrieving the Real account Id from the vacation details page
    // this.commService.currentData2$.subscribe((data) => {
    //   console.log("The real Account Id: " + data);
    //   this.receivedAccountId = data;
    // });

    // // Retrieving the Real vacation Id from the vacation details page
    // this.commService.currentData3$.subscribe((data) => {
    //   console.log("The real Vacation Id: " + data);
    //   this.receivedVacationId = data;
    // });

    // Retrieving the excursion Id from session data
    const excurInfo = JSON.parse(localStorage.getItem('excursionInfo') || '{}');
    console.log("The raw Excursion info: ");
    console.log(excurInfo);

    this.receivedExcursionId = excurInfo.excursion_id;
    console.log("The Excursion Id: " + this.receivedExcursionId);

    // Retrieving the account Id from session data
    const accountInfo = JSON.parse(localStorage.getItem('accountInfo') || '{}');
    console.log("The raw Account info: ");
    console.log(accountInfo);

    this.receivedAccountId = accountInfo.account_id;
    console.log("The Account Id: " + this.receivedAccountId);

    // Retrieving the vacation Id from session data
    const vacayInfo = JSON.parse(localStorage.getItem('vacationInfo') || '{}');
    console.log("The raw Vacation info: ");
    console.log(vacayInfo);

    this.receivedVacationId = vacayInfo.vacation_id;
    console.log("The Vacation Id: " + this.receivedVacationId);

    // Get the Vacation that holds the Excursion from Firebase.
    this.result = this.vacationService.retrieveVacations(this.receivedAccountId);

    console.log("The Raw Result Data: ");
    console.log(this.result);

    this.result.then((data: any) => {
      data.forEach((item: any) => {
        if (item.id == this.receivedVacationId) {
          console.log("Current vacation: ");
          console.log(item);
          this.currentVacation = item;
        }
      });
    });

    // Get the Excursion details from Firestore.
    this.result = this.excursionService.retrieveExcursions(this.receivedAccountId);
    
    console.log("The Raw Result Data of retrieved excursions: ");
    console.log(this.result);

    this.result.then((data: any) => {
      console.log("The list of Excursions received: ");
      console.log(data);

      // If the Excursion exists, get it's details as placeholders.
      if (data != -1) {
        data.forEach((item: any) => {
          if (this.receivedExcursionId != -1 && this.receivedExcursionId != undefined && this.receivedExcursionId == item.id){
            this.checkExcursion = true;
            this.ExcurTitle = item.title + ' Details:';
            this.chosenExcursion.id = item.id;
            this.chosenExcursion.account_id = item.account_id;
            this.chosenExcursion.vacation_id = item.vacation_id;
            this.chosenExcursion.title = item.title;
            this.chosenExcursion.start_date = item.start_date;
            this.chosenExcursion.description = item.description;
          }
        });
      } else {
        console.log('Sorry, an error has occurred with retrieving Excursion info. Please try again later.');
        alert('Sorry, an error has occurred with retrieving Excursion info. Please try again later.');
      }

      // If the Excursion doesn't exist, set up placeholder values.
      if (!this.checkExcursion) {
        this.chosenExcursion.account_id = this.receivedAccountId;
        this.chosenExcursion.vacation_id = this.receivedVacationId;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';
      }
    });

  }

  // Going back to the vacation details page.
  vacationDetailsReturn(){
    alert('Let\'s see the big picture of this vacation plan.');
    console.log('Sending back this Account id: ' + this.receivedAccountId);
    console.log('Sending back this vacation id: ' + this.receivedVacationId);
    this.commService.transmitData(this.receivedAccountId);
    this.commService.transmitData2(this.receivedVacationId);
    this.router.navigate(['/vacation-details']);
  }

  // Going to see the user's info.
  profilePath(): void {
    alert('We\'ve got your identification right here!');
    this.commService.transmitData(this.chosenExcursion.account_id);
    this.router.navigate(['/profile']);
  }

  // TODO: Make sure excursions are within the vacation's start and end dates.
  onSubmit() {
    // this.submitted = true;
    // this.excursion.excursion_title = this.signupForm.value.userData.excursion_title;
    // this.excursion.start_date = this.signupForm.value.userData.start_date;
    // this.excursion.description = this.signupForm.value.userData.description;
    // this.signupForm.reset();

    // Save the form values into an exersion
    this.submitted = true;
    this.chosenExcursion.account_id = this.receivedAccountId;
    this.chosenExcursion.vacation_id = this.receivedVacationId;
    this.chosenExcursion.title = this.signupForm.value.userData.excursion_title;
    this.chosenExcursion.start_date = this.signupForm.value.userData.start_date;
    this.chosenExcursion.description = this.signupForm.value.userData.description;
    this.signupForm.reset();

    console.log('The input Excursion start Date: ' + this.chosenExcursion.start_date);
    console.log('The input current Vacation start Date: ' + this.currentVacation.start_date);
    console.log('The input current Vacation end Date: ' + this.currentVacation.end_date);

    // Make sure the excursion start date is valid
    if (this.chosenExcursion.start_date != undefined) {
      this.excurStartDate = new Date(this.chosenExcursion.start_date);

      console.log('The input Excursion Processed start Date: ' + this.excurStartDate); 

      // Make sure the excursion start date is not invalid
      if (this.excurStartDate.toString() == 'Invalid Date') {
        console.log('Give us an actual date to work with!');
        alert('Give us an actual date to work with!');

        this.chosenExcursion.account_id = -1;
        this.chosenExcursion.vacation_id = -1;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';

        return;
      }

      // Make sure the excursion start date is not before today
      if (this.excurStartDate != undefined && this.excurStartDate < this.currentDate) {
        console.log('We can\'t help you create an excursion that started yesterday! (Or earlier.)');
        alert('We can\'t help you create an excursion that started yesterday! (Or earlier.)');

        this.chosenExcursion.account_id = -1;
        this.chosenExcursion.vacation_id = -1;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';

        return;
      } 
    
    // If the date is not valid, reset the form
    } 
    // else {
    //   console.log('Give us an actual date to work with!');
    //   alert('Give us an actual date to work with!');

    //     this.chosenExcursion.account_id = -1;
    //     this.chosenExcursion.vacation_id = -1;
    //     this.chosenExcursion.title = 'Excur1';
    //     this.chosenExcursion.start_date = '2026-05-05';
    //     this.chosenExcursion.description = 'A short description about the excursion.';

    //   return;
    // }

    // Check if the excursion start date is within the vacation date range
    if (this.chosenExcursion.start_date != undefined && this.currentVacation.start_date != undefined 
      && this.currentVacation.end_date != undefined) {
      this.excurStartDate = new Date(this.chosenExcursion.start_date);
      console.log(this.excurStartDate);
      this.vacayStartDate = new Date(this.currentVacation.start_date);
      console.log(this.vacayStartDate);
      this.vacayEndDate = new Date(this.currentVacation.end_date);
      console.log(this.vacayEndDate);
      
      // Checking the current date
      console.log(this.currentDate);
      
      // Make sure the excursion start date is not before the vacation start date
      if (this.excurStartDate < this.vacayStartDate) {
        console.log('We can\'t help you create an excursion that started before your vacation did!');
        alert('We can\'t help you create an excursion that started before your vacation did!');

        this.chosenExcursion.account_id = -1;
        this.chosenExcursion.vacation_id = -1;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';

        return;
      }

      // Make sure the excursion start date is not after the vacation end date
      if ( this.excurStartDate > this.vacayEndDate) {
        console.log('We can\'t help you create an excursion that starts after your vacation ended!');
        alert('We can\'t help you create an excursion that starts after your vacation ended!');

        this.chosenExcursion.account_id = -1;
        this.chosenExcursion.vacation_id = -1;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';

        return;
      }
    }
    
    // If the excursion is new, save it to the database
    // TODO: Make sure the Account, and Vacation IDs are not changed back to "-1" when they get to this point.
    if (this.receivedExcursionId != undefined && this.receivedExcursionId == -1){
      this.result = this.excursionService.createExcursion(this.receivedAccountId, this.receivedVacationId, 
      this.chosenExcursion.title, this.chosenExcursion.start_date, this.chosenExcursion.description);

      console.log("The raw result data for creating excursions: ");
      console.log(this.result); 

      this.result.then((data: any) => {

        console.log("The Deeper result data: ");
        console.log(data);

        if (data != undefined && data != String && data != -1) {
          console.log('Congratulations! You just created an excursion plan!');
          alert('Congratulations! You just created an excursion plan!');
          this.commService.transmitData(this.receivedAccountId);
          console.log("Transferring accountId: " + this.receivedAccountId);
          this.commService.transmitData2(this.receivedVacationId);
          console.log("Transferring vacationId: " + this.receivedVacationId);
          this.router.navigate(['/vacation-details']);

        // Catch errors when they occur.
        } else {
          console.log('Sorry, there was an unknown error. Please try again later.');
          alert('Sorry, there was an unknown error. Please try again later.');

          this.chosenExcursion.account_id = -1;
          this.chosenExcursion.vacation_id = -1;
          this.chosenExcursion.title = 'Excur1';
          this.chosenExcursion.start_date = '2026-05-05';
          this.chosenExcursion.description = 'A short description about the excursion.';

          return;
        }
      });

      
    
    // If the excursion already exists, update it in the database
    } else {
      this.result = this.excursionService.editExcursion(this.receivedExcursionId, this.receivedAccountId, 
        this.chosenExcursion.title, this.chosenExcursion.start_date, this.chosenExcursion.description);

      console.log("The raw result data for editing excursions: ");
      console.log(this.result); 

      this.result.then((data: any) => {
        if (data != undefined && data != String && data != -1){
          console.log('Congratulations! You\'ve successfully updated your excursion plan!');
          alert('Congratulations! You\'ve successfully updated your excursion plan!');
          this.commService.transmitData(this.receivedAccountId);
          this.commService.transmitData2(this.receivedVacationId);
          this.router.navigate(['/vacation-details']);
        
        // Catch errors when they occur.
        } else {
          console.log('Sorry, there was an error. Rebuild your excursion later.');
          alert('Sorry, there was an error. Rebuild your excursion later.');

          this.chosenExcursion.account_id = -1;
          this.chosenExcursion.vacation_id = -1;
          this.chosenExcursion.title = 'Excur1';
          this.chosenExcursion.start_date = '2026-05-05';
          this.chosenExcursion.description = 'A short description about the excursion.';

          return;
        }
      });
    }
  }

  // Delete an Excursion
  deleteExcur(): void {

    // If the Excursion doesn't exist, then alert the user and don't do anything
    if (this.receivedExcursionId == undefined || this.receivedExcursionId < 0) {
      console.log('You can\'t delete an excursion that doesn\'t exist!');
      alert('You can\'t delete an excursion that doesn\'t exist!');

    // If the Excursion does exist, remove it from the database.
    } else {
      this.result = this.excursionService.removeExcursion(this.receivedExcursionId);

      console.log("The raw result data for deleting excursions: ");
      console.log(this.result); 

      this.result.then((data: any) => {
        if (data != undefined && data != -1) {
          console.log('Done with your Excursion? Then we\'ll remove it so you have space to make a new one!');
          alert('Done with your Excursion? Then we\'ll remove it so you have space to make a new one!');
          this.commService.transmitDataString(this.receivedAccountId + ',' + this.receivedVacationId);
          this.router.navigate(['/vacation-details']);
        
        // Catch errors when they appear.
        } else {
          console.log('Sorry, there was an error. Rebuild your excursion later.');
          alert('Sorry, there was an error. Rebuild your excursion later.');
          
          this.chosenExcursion.account_id = -1;
          this.chosenExcursion.vacation_id = -1;
          this.chosenExcursion.title = 'Excur1';
          this.chosenExcursion.start_date = '2026-05-05';
          this.chosenExcursion.description = 'A short description about the excursion.';

          return;
        }
      }); 
    }
  }
}
