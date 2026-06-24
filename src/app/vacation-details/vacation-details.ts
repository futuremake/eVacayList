import { Component, ViewChild, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { ExcursionService } from '../services/ExcursionService';
import { Excursion } from '../models/excursion.model';
import { CommunicationService } from '../services/CommunicationService';
import { VacationService } from '../services/VacationService';
import { Vacation } from '../models/vacation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacation-details',
  imports: [FormsModule],
  templateUrl: './vacation-details.html',
  styleUrl: './vacation-details.css',
})
export class VacationDetails implements OnInit {
  
  // New Version

  // The variables
  vacayTitle = 'Vacay1 Details:';

  @ViewChild('f', { static : false })
  listForm!: NgForm;

  @ViewChild('lf', { static : false })
  searchForm!: NgForm;

  // vacation = {
  //   accountId: -1,
  //   title: 'vacay1',
  //   lodging: 'some hotel',
  //   start_date: 'some time soon',
  //   end_date: 'some time far',
  //   description: 'a short vacation summary.',
  // };

  chosenVacation: Vacation = new Vacation;

  submitted = false;

  excursions: Excursion[] = [];

  vacations: Vacation[] = [];

  recievedVacationId: number | undefined = -1;

  recievedAccountId: number | undefined = -1;

  chosenExcursionId: number | undefined = -1;

  recievedVacayData: string | undefined = 'N/A';

  dataArray: any = [];

  anyExcurs: boolean = false;

  // searchValue: string | undefined = '';

  searchValue = signal('');

  processedValue = '';

  currentDate: Date = new Date();

  startDate: Date = new Date();

  endDate: Date = new Date();

  result: any = undefined;

  resultData: any = undefined;

  // The imported services
  constructor(private excursionService: ExcursionService, private commService: CommunicationService,
    private vacationService: VacationService, private router: Router) { }

  ngOnInit(): void {

    // Retrieve the real account Id
    this.commService.currentData$.subscribe((data) => {
      this.recievedAccountId = data;
      console.log('The real received AccountId: ' + this.recievedAccountId);
    });

    // Retrieve the real vacation Id
    this.commService.currentData2$.subscribe((data) => {
      this.recievedVacationId = data;
      console.log('The real received vacationId: ' + this.recievedVacationId);
    });

    // Get the Vacation details from Firebase.
    this.vacationService.retrieveVacations(this.recievedAccountId).then((data) => {
      console.log("Vacations for this Account: ");
      console.log(data);
      // If the vacation exists, show details
      if (this.recievedVacationId != undefined && this.recievedVacationId != -1) {
        data.forEach(item => {
          if (item.id == this.recievedVacationId) {
            this.vacayTitle = item.title + " Details:"
            this.chosenVacation.id = item.id;
            this.chosenVacation.account_id = item.account_id;
            this.chosenVacation.title = item.title;
            this.chosenVacation.lodging = item.lodging;
            this.chosenVacation.start_date = item.start_date;
            this.chosenVacation.end_date = item.end_date;
            this.chosenVacation.description = item.description; 
          }
        });

      // If the vacation does not exist, add placeholder values.
      } else {
        // this.chosenVacation.id = -1;
        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';
      }
    });

    // Get the vacation's associated excursions from Firebase.
    this.excursionService.retrieveExcursions(this.recievedAccountId).then((data) => {
      console.log("Excursions for this account: ");
      console.log(data);
      data.forEach(item => {
        if (this.recievedVacationId != undefined && this.recievedVacationId != -1 && item.vacation_id == this.recievedVacationId) {
          console.log("Added this excursion: ");
          console.log(item);
          this.excursions.push(item);
        }
      });
    });

  }

  // Get the details of the selected excursion.
  excurDetailsPath(excurId: number | undefined) {
    console.log('Show me the excursion details!');
    alert('Show me the excursion details!');
    this.chosenExcursionId = excurId;
    console.log("Transferring Excursion Id: ");
    console.log(this.chosenExcursionId);
    this.commService.transmitData(this.chosenExcursionId);
    console.log("Transferring Account Id: ");
    console.log(this.recievedAccountId);
    this.commService.transmitData2(this.recievedAccountId);
    console.log("Transferring Vacation Id: ");
    console.log(this.recievedVacationId);
    this.commService.transmitData2(this.recievedVacationId);
    
    // this.commService.transmitDataString(this.chosenExcursionId + ',' + this.recievedAccountId + ',' + this.recievedVacationId);
    this.router.navigate(['/excursion-details']);
  }

  // Go back to the vacation list.
  vacayListReturn() {
    alert('Back to the big list!');
    this.commService.transmitData(this.recievedAccountId);
    this.router.navigate(['/vacation-list']);
  }

  // Show the user their profile information.
  profilePath(): void {
    alert('We\'ve got your identification right here!');
    this.commService.transmitData(this.recievedAccountId);
    this.router.navigate(['/profile']);
  }

  // Create or update a vacation.
  onSubmit() {
    // this.submitted = true;
    // this.vacation.title = this.signupForm.value.userData.title;
    // this.vacation.lodging = this.signupForm.value.userData.lodging;
    // this.vacation.start_date = this.signupForm.value.userData.start_date;
    // this.vacation.end_date = this.signupForm.value.userData.end_date;
    // this.vacation.description = this.signupForm.value.userData.description;
    // this.signupForm.reset();

    // Capture the input data into a vacation
    this.submitted = true;
    this.chosenVacation.account_id = this.recievedAccountId;
    this.chosenVacation.title = this.listForm.value.userData.title;
    this.chosenVacation.lodging = this.listForm.value.userData.lodging;
    this.chosenVacation.start_date = this.listForm.value.userData.start_date;
    this.chosenVacation.end_date = this.listForm.value.userData.end_date;
    this.chosenVacation.description = this.listForm.value.userData.description;
    this.listForm.reset();

    // Check the start and end dates of the vacation info
    if (this.chosenVacation.start_date != undefined  && this.chosenVacation.end_date != undefined) {
      this.startDate = new Date(this.chosenVacation.start_date);
      this.endDate = new Date(this.chosenVacation.end_date);

      // Make sure the vacation start and end dates are valid
      if (this.startDate.toString() == 'Invalid Date' || this.endDate.toString() == 'Invalid Date') {
        console.log('Give us valid dates to work with!');
        alert('Give us valid dates to work with!');

        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';

        return;
      }


      // Make sure the start date is not before today
      if (this.startDate < this.currentDate) {
        console.log('You can\'t make a vacation plan that started yesterday! (Or earlier.)');
        alert('You can\'t make a vacation plan that started yesterday! (Or earlier.)');

        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';

        return;
      }

      // Make sure the start date is not after the end date
      if (this.startDate > this.endDate) {
        console.log('You can\'t make a vacation plan that ends before it starts! (Unless you have a time machine.)');
        alert('You can\'t make a vacation plan that ends before it starts! (Unless you have a time machine.)');

        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';

        return;
      }
    }

    // If the vacation is new, save it into the database
    if (this.recievedVacationId == undefined || this.recievedVacationId == -1) {
      this.result = this.vacationService.createVacation(this.recievedAccountId, this.chosenVacation.title, this.chosenVacation.lodging, 
        this.chosenVacation.start_date, this.chosenVacation.end_date, this.chosenVacation.description);
      if (this.result != undefined && this.result != Error) {
        console.log('Congratulations! You have just created a vacation plan!');
        alert('Congratulations! You have just created a vacation plan!');
        this.commService.transmitData(this.recievedAccountId);
        this.router.navigate(['/vacation-list']);

      // Catch any errors that may appear.
      } else {
        console.log("Sorry, an error has occurred. Please try again later.");
        alert("Sorry, an error has occurred. Please try again later.");
        
        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';

        return;
      }
      
    
    // If the vacation already exists, update it in the database
    } else {
      this.result = undefined;

      this.result = this.vacationService.editVacation(this.recievedVacationId, this.recievedAccountId, this.chosenVacation.title, this.chosenVacation.lodging,
        this.chosenVacation.start_date, this.chosenVacation.end_date, this.chosenVacation.description);
     
      if (this.result != undefined && this.result != -1) {
        console.log('You have successfully imporved your vacation plan.');
        alert('You have successfully imporved your vacation plan.');
        this.commService.transmitData(this.recievedAccountId);
        this.router.navigate(['/vacation-list']);
        
      // Catch any errors that may appear.
      } else {
        console.log("Sorry, an error has occurred. Please try again later.");
        alert("Sorry, an error has occurred. Please try again later.");
        
        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';

        return;
      }
    }
  }

  // Delete a vacation
  deleteVacay(): void {
    
    // Don't do anything if the vacation doesn't exist
    if (this.recievedVacationId == undefined || this.recievedVacationId == -1) {
      alert('You can\'t delete a vacation that doesn\'t exist!');
    } else {
      
      console.log('Number of this vacation\'s excursions: ' + this.excursions.length);
      
      // If the vacation has excursions, don't delete it.
      if (this.anyExcurs) {
        console.log('We can\'t delete a Vacation with Excursions!');
        alert('We can\'t delete a Vacation with Excursions!');
      
      // If the vacation has no excursions, remove it from the database.
      } else {

        this.result = this.vacationService.removeVacation(this.recievedVacationId);

        console.log("The Raw Result Info: ");
        console.log(this.result);

        this.result.then((data: any) => {
          console.log("The Deeper Result Info: ");
          console.log(data);
          this.resultData = data;
        });

        // TODO: Find out why the vacations are not being deleted from the Vacation list.
        if (this.resultData != String && this.resultData != -1) {
          console.log('Vacation deleted. Now, you have more storage space to make a new one!');
          alert('Vacation deleted. Now, you have more storage space to make a new one!');
          this.commService.transmitData(this.recievedAccountId);
          this.router.navigate(['/vacation-list']);
        
        } else {
          console.log('Sorry, there was an error. You will have to wait to delete your vacation.');
          alert('Sorry, there was an error. You will have to wait to delete your vacation.');
        }
      } 
    }
  }

  // Add a new Excursion to the database.
  addExcurPath(): void {

    // If the vacation exists, add the excursion.
    if (this.recievedVacationId != undefined && this.recievedVacationId != -1) {
      console.log('Let\'s build an excursion!');
      alert('Let\'s build an excursion!');
      console.log("Transferring Excursion Id: " + this.chosenExcursionId);
      this.commService.transmitData(this.chosenExcursionId);
      console.log("Transferring Account Id: " + this.recievedAccountId);
      this.commService.transmitData2(this.recievedAccountId);
      console.log("Transferring Vacation Id: " + this.recievedVacationId);
      this.commService.transmitData3(this.recievedVacationId);  
      this.router.navigate(['/excursion-details']);

    // If the vacation does not exist, don't do anything.
    } else {
      console.log('We can\'t help you build an excursion for a vacation that doesn\'t exist!');
      alert('We can\'t help you build an excursion for a vacation that doesn\'t exist!');
    }
  }

  // Start searching for specific excursions by title.
  // TODO: Make sure only excursions that are part of the user's vacation are added to the search list.
  onListSubmit() {

    // If the vacation exists, search for excursions.
    if (this.recievedVacationId != undefined && this.recievedVacationId != -1) {
      // Get the value to search excursions for.
      // this.searchValue = this.searchForm.value.userData.searchBox;
      this.processedValue = this.searchValue.toString().substring(9).replace(']', '');
      console.log('Searching for Excursions with this title: ' + this.processedValue);
      this.excursions = [];

      // Searching for excursions using Firestore
      this.excursionService.retrieveExcursions(this.recievedAccountId).then((data) => {

        console.log("Excursions to search through: ");
        console.log(data);

        data.forEach(item => {
          if (item != undefined && item.account_id == this.recievedAccountId && item.vacation_id == this.recievedVacationId 
            && item.title != undefined && item.title.includes(this.processedValue)){
            console.log("Adding this Item: " + item);
            this.excursions.push(item);
          }
        });
      });
      
    // If the vacation does not exist, don't do anything. 
    } else {
      console.log('We can\'t help you search for an excursion for a vacation that doesn\'t exist!');
      alert('We can\'t help you search for an excursion for a vacation that doesn\'t exist!');
    }
  }
}
