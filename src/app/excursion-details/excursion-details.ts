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

  // The imported services
  constructor(private commService: CommunicationService, private excursionService: ExcursionService,
    private router: Router, private vacationService: VacationService, 
    // private result: Promise<string | Excursion>
  ) { }

  ngOnInit(): void {

    // Receiving the excursion, account, and vacation ids from the vacation details page
    this.commService.currentDataString$.subscribe((data) => {
      this.receivedExcurData = data;
      console.log('Retrieved Excursion Data: ' + this.receivedExcurData);

      this.dataArray = this.receivedExcurData?.split(',');
      if (this.dataArray != undefined) {
        this.receivedExcursionId = parseInt(this.dataArray[0]);
        console.log('Received Excursion id:' + this.receivedExcursionId);
        this.receivedAccountId = parseInt(this.dataArray[1]);
        console.log('Received Account id:' + this.receivedAccountId);
        this.receivedVacationId = parseInt(this.dataArray[2]);
        console.log('Received Vacation Id: ' + this.receivedVacationId);
      }
    });

    // Retrieving the selected excursion and showing it's details
    this.excursionService.retrieve().subscribe((data) => {
      console.log(data);

      // If the excursion exists, get and show it's details 
      if (this.receivedExcursionId != undefined && this.receivedExcursionId > 0) {
        if (data._embedded == undefined) {
          // this.ExcurTitle = data.title + ' Details:';
          // this.excursion.accountId = data.accountId;
          // this.excursion.vacationId = data.vacationId;
          // this.excursion.excursion_title = data.title;
          // this.excursion.start_date = data.startDate;
          // this.excursion.description = data.description;

          this.ExcurTitle = data.title + ' Details:';
          this.chosenExcursion.account_id = data.account_id;
          this.chosenExcursion.vacation_id = data.vacation_id;
          this.chosenExcursion.title = data.title;
          this.chosenExcursion.start_date = data.startDate;
          this.chosenExcursion.description = data.description;
        } else {
          for (let excursion of data._embedded.excursions) {
            if (excursion.id == this.receivedExcursionId) {
              // this.ExcurTitle = excursion.title + ' Details:';
              // this.excursion.accountId = excursion.accountId;
              // this.excursion.vacationId = excursion.vacationId;
              // this.excursion.excursion_title = excursion.title;
              // this.excursion.start_date = excursion.startDate;
              // this.excursion.description = excursion.description;

              this.ExcurTitle = excursion.title + ' Details:';
              this.chosenExcursion.account_id = excursion.accountId;
              this.chosenExcursion.vacation_id = excursion.vacationId;
              this.chosenExcursion.title = excursion.title;
              this.chosenExcursion.start_date = excursion.startDate;
              this.chosenExcursion.description = excursion.description;
              break;
            }
          }
        }

      // If the excursion doesn't exist, set up placeholder values
      } else {
        this.chosenExcursion.account_id = -1;
        this.chosenExcursion.vacation_id = -1;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';
      }
    });

    // Find the vacation that holds the excursion.
    this.vacationService.retrieve().subscribe((data) => {
      console.log(data);

      if (data._embedded == undefined) {
        this.currentVacation = data;
      } else {
        for (let vacation of data._embedded.vacations) {
          if (vacation.id == this.receivedVacationId) {
            this.currentVacation = vacation;
            console.log(this.currentVacation.start_date);
            console.log(this.currentVacation.end_date);
          }
        }
      }
    });
  }

  // Going back to the vacation details page.
  vacationDetailsReturn(){
    alert('Let\'s see the big picture of this vacation plan.');
    console.log('Sending back this Account id: ' + this.receivedAccountId);
    console.log('Sending back this vacation id: ' + this.receivedVacationId);
    this.commService.transmitDataString(this.receivedAccountId + ',' + this.receivedVacationId);
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

    // TODO: find out Why this code block is skipped
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
    if (this.receivedExcursionId != undefined && this.receivedExcursionId < 0){
      this.excursionService.createExcursion(this.receivedAccountId, this.receivedVacationId, this.chosenExcursion.title, 
      this.chosenExcursion.start_date, this.chosenExcursion.description);
      console.log('Congratulations! You just created an excursion plan!');
      alert('Congratulations! You just created an excursion plan!');
      this.commService.transmitDataString(this.receivedAccountId + ',' + this.receivedVacationId);
      this.router.navigate(['/vacation-details']);
    
    // If the excursion already exists, update it in the database
    } else {
      this.result = this.excursionService.updateExcursion(this.receivedExcursionId, this.chosenExcursion.title, this.chosenExcursion.start_date,
        this.chosenExcursion.description);
      if (this.result != undefined && this.result != Error){
        console.log('Congratulations! You\'ve successfully updated your excursion plan!');
        alert('Congratulations! You\'ve successfully updated your excursion plan!');
        this.commService.transmitDataString(this.receivedAccountId + ',' + this.receivedVacationId);
        this.router.navigate(['/vacation-details']);
      } else {
        console.log('Sorry, there was an error. Because the vacation for this excursion doesn\'t exist!');
        alert('Sorry, there was an error. Because the vacation for this excursion doesn\'t exist!');

        this.chosenExcursion.account_id = -1;
        this.chosenExcursion.vacation_id = -1;
        this.chosenExcursion.title = 'Excur1';
        this.chosenExcursion.start_date = '2026-05-05';
        this.chosenExcursion.description = 'A short description about the excursion.';

        return;
      }
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
      this.excursionService.deleteExcursion(this.receivedExcursionId);
      console.log('Done with your Excursion? Then we\'ll remove it so you have space to make a new one!');
      alert('Done with your Excursion? Then we\'ll remove it so you have space to make a new one!');
      this.commService.transmitDataString(this.receivedAccountId + ',' + this.receivedVacationId);
      this.router.navigate(['/vacation-details']);
    }
  }
}
