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

  // excursions = [
  //   'Excur1',
  //   'Excur2',
  //   'Excur3',
  //   'Excur4',
  //   'Excur5',
  //   'Excur6',
  //   'Excur7',
  //   'Excur8',
  // ]

  // excursions: Excursion[] = [];

  // constructor(private excursionService: ExcursionService) { }

  // ngOnInit(): void {
  //   const excursionObservable = this.excursionService.getExcursions();
  //   excursionObservable.subscribe((ExcursionData: Excursion[]) => {
  //     this.excursions = ExcursionData;
  //   });
  // }

  
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

  // The imported services
  constructor(private excursionService: ExcursionService, private commService: CommunicationService,
    private vacationService: VacationService, private router: Router) { }

  ngOnInit(): void {
    // this.excursionService.retrieve().subscribe((data) => {
    //   console.log(data);
    //   this.excursions = data._embedded.excursions;
    // });

    // Receieve the vacation id from the vacation list.
    // this.commService.currentData$.subscribe((data) => {
    //   this.recievedVacationId = data;
    //   console.log("Retrieved Vacation Id: " + data);
    // })

    // Receieve the account id and the vacation id from the vacation list.
    this.commService.currentDataString$.subscribe((data) => {
      this.recievedVacayData = data;
      console.log("Retrieved Vacation Data: " + data);

      // Convert the recieved data into usable values
      this.dataArray = data?.split(',');
      this.recievedAccountId = parseInt(this.dataArray[0]);
      console.log('The Received Account Id: ' + this.recievedAccountId);
      this.recievedVacationId = parseInt(this.dataArray[1]);
      console.log('The Received Vacation Id: ' + this.recievedVacationId);
    });

    // // Get the vacation's associated excursions.
    // this.excursionService.retrieveVacationExcursions(this.recievedVacationId).subscribe((data) => {
    //   if(data._embedded == undefined){
    //     console.log(data);
    //     this.excursions.push(data);
    //   } else {
    //     console.log(data);
    //     this.excursions = data._embedded.excursions;
    //   }
    // });


    // Get the vacation's associated excursions.
    this.excursionService.retrieve().subscribe((data) => {
      console.log(data);

      // Only one excursion? Add it.
      if(data._embedded == undefined){
        this.excursions.push(data);
        this.anyExcurs = true;

      // More than one Excursion? Add only the user's excursions.
      } else {
        for (let excursion of data._embedded.excursions) {
          if(excursion.vacationId == this.recievedVacationId) {
            this.excursions.push(excursion);
            this.anyExcurs = true;
          }
        }
      }
      console.log('Number of this vacation\'s excursions: ' + this.excursions.length);
    });


    // Get the vacation's details.
    this.vacationService.retrieve().subscribe((data) => {
      console.log(data);

      // If the vacation exists, show details.
      if (this.recievedVacationId != undefined && this.recievedVacationId > 0) {
        if(data._embedded == undefined) {
          this.vacayTitle = data.title + ' Details:';
          // this.vacation.accountId = data.account_id;
          // this.vacation.title = data.title;
          // this.vacation.lodging = data.lodging;
          // this.vacation.start_date = data.start_date;
          // this.vacation.end_date = data.end_date;
          // this.vacation.description = data.description;

          this.chosenVacation.account_id = data.account_id;
          this.chosenVacation.title = data.title;
          this.chosenVacation.lodging = data.lodging;
          this.chosenVacation.start_date = data.start_date;
          this.chosenVacation.end_date = data.end_date;
          this.chosenVacation.description = data.description;
          
        } else {
          for (let vacation of data._embedded.vacations) {
            if (vacation.id == this.recievedVacationId) {
              // this.vacayTitle = vacation.title + ' Details:';
              // this.vacation.accountId = vacation.account_id;
              // this.vacation.title = vacation.title;
              // this.vacation.lodging = vacation.lodging;
              // this.vacation.start_date = vacation.start_date;
              // this.vacation.end_date = vacation.end_date;
              // this.vacation.description = vacation.description;

              this.vacayTitle = vacation.title + ' Details:';
              this.chosenVacation.account_id = vacation.account_id;
              this.chosenVacation.title = vacation.title;
              this.chosenVacation.lodging = vacation.lodging;
              this.chosenVacation.start_date = vacation.start_date;
              this.chosenVacation.end_date = vacation.end_date;
              this.chosenVacation.description = vacation.description;
              break;
            }
          }
        }

      // If the vacation does not exist, add placeholder values.
      } else {
        this.chosenVacation.account_id = -1;
        this.chosenVacation.title = 'vacay1';
        this.chosenVacation.lodging = 'some hotel';
        this.chosenVacation.start_date = '2026-05-01';
        this.chosenVacation.end_date = '2026-05-31';
        this.chosenVacation.description = 'a short vacation description.';
      }
    });
  }

  // Get the details of the selected excursion.
  excurDetailsPath(excurId: number | undefined) {
    console.log('Show me the excursion details!');
    alert('Show me the excursion details!');
    this.chosenExcursionId = excurId;
    this.commService.transmitDataString(this.chosenExcursionId + ',' + this.recievedAccountId + ',' + this.recievedVacationId);
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
    this.commService.transmitData(this.chosenVacation.account_id);
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
    if (this.recievedVacationId != undefined && this.recievedVacationId < 0) {
      this.vacationService.createVacation(this.recievedAccountId, this.chosenVacation.title, this.chosenVacation.lodging, 
        this.chosenVacation.start_date, this.chosenVacation.end_date, this.chosenVacation.description);
      console.log('Congratulations! You have just created a vacation plan!');
      alert('Congratulations! You have just created a vacation plan!');
      this.commService.transmitData(this.recievedAccountId);
      this.router.navigate(['/vacation-list']);
    
    // If the vacation already exists, update it in the database
    } else {
      this.vacationService.updateVacation(this.recievedVacationId, this.recievedAccountId, this.chosenVacation.title, this.chosenVacation.lodging,
        this.chosenVacation.start_date, this.chosenVacation.end_date, this.chosenVacation.description);
      console.log('You have successfully imporved your vacation plan.');
      alert('You have successfully imporved your vacation plan.');
      this.commService.transmitData(this.recievedAccountId);
      this.router.navigate(['/vacation-list']);
    }
  }

  // Delete a vacation
  deleteVacay(): void {
    
    // Don't do anything if the vacation doesn't exist
    if (this.recievedVacationId == undefined || this.recievedVacationId < 0) {
      alert('You can\'t delete a vacation that doesn\'t exist!');
    } else {
      
      console.log('Number of this vacation\'s excursions: ' + this.excursions.length);
      
      // If the vacation has excursions, don't delete it.
      if (this.anyExcurs) {
        console.log('We can\'t delete a Vacation with Excursions!');
        alert('We can\'t delete a Vacation with Excursions!');
      
      // If the vacation has no excursions, remove it from the database.
      } else {
        this.vacationService.deleteVacation(this.recievedVacationId);
        console.log('Vacation deleted. Now, you have more storage space to make a new one!');
        alert('Vacation deleted. Now, you have more storage space to make a new one!');
        this.commService.transmitData(this.recievedAccountId);
        this.router.navigate(['/vacation-list']);    
      } 
    }
  }

  // Add a new Excursion to the database.
  addExcurPath(): void {

    // If the vacation exists, add the excursion.
    if (this.recievedVacationId != undefined && this.recievedVacationId > 0) {
      console.log('Let\'s build an excursion!');
      alert('Let\'s build an excursion!');
      this.commService.transmitDataString(this.chosenExcursionId + ',' + this.recievedAccountId + ',' + this.recievedVacationId);
      this.router.navigate(['/excursion-details']);

    // If the vacation does not exist, don't do anything.
    } else {
      console.log('We can\'t help you build an excursion for a vacation that doesn\'t exist!');
      alert('We can\'t help you build an excursion for a vacation that doesn\'t exist!');
    }
  }

  // Start searching for specific excursions by title.
  onListSubmit() {

    // If the vacation exists, search for excursions.
    if (this.recievedVacationId != undefined && this.recievedVacationId > 0) {
      // Get the value to search excursions for.
      // this.searchValue = this.searchForm.value.userData.searchBox;
      this.processedValue = this.searchValue.toString().substring(9).replace(']', '');
      console.log('Searching for Excursions with this title: ' + this.processedValue);
      this.excursions = [];

      this.excursionService.retrieve().subscribe((data) => {
        console.log(data);

        // Only one excursion? If it has the search value, add it.
        if (data._embedded == undefined && data.title.includes(this.processedValue)) {
          this.excursions.push(data);

        // More than one excursion? Add only the user's excursions that have the search value.
        } else {
          for (let excursion of data._embedded.excursions) {
            if (excursion.vacationId == this.recievedVacationId && excursion.title.includes(this.processedValue)) {
              this.excursions.push(excursion);
            }
          }
        }
      });
      
    // If the vacation does not exist, don't do anything. 
    } else {
      console.log('We can\'t help you search for an excursion for a vacation that doesn\'t exist!');
      alert('We can\'t help you search for an excursion for a vacation that doesn\'t exist!');
    }
  }
}
