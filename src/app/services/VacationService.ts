import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vacation } from '../models/vacation.model';
import { DocumentReference, DocumentData, Firestore, query, collectionData } from '@angular/fire/firestore';
import { addDoc, collection, orderBy } from 'firebase/firestore';

type CurrentVacation = {
  id: number | undefined;
  account_id: number | undefined;
  title: string | undefined;
  lodging: string | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  description: string | undefined;
}

@Injectable({
  providedIn: 'root',
})

export class VacationService {
  // vacations: Vacation[] = [{
  //   id: 1,
  //   account_id: 1,
  //   title: 'San Diego Exploration',
  //   lodging: 'Motel 6',
  //   start_date: '2026-05-15',
  //   end_date: '2026-05-22',
  //   description: 'Southern California at its finest. Explore San Diego today!'
  // }, {
  //   id: 2,
  //   account_id: 2,
  //   title: 'Los Angelos Field Trip',
  //   lodging: 'Motel 6',
  //   start_date: '2026-05-15',
  //   end_date: '2026-05-22',
  //   description: 'A leading city of entertainment and creativity worldwide. You want to be a better artist? Take a field trip to Los Angelos.'
  // }, {
  //   id: 3,
  //   account_id: 3,
  //   title: 'San Francisco Trek',
  //   lodging: 'Motel 6',
  //   start_date: '2026-05-15',
  //   end_date: '2026-05-22',
  //   description: 'The Technological Capital of America (and perhaps the world), plan your trek to San Francisco!'
  // }, {
  //   id: 4,
  //   account_id: 4,
  //   title: 'The Texas State Fair',
  //   lodging: 'Motel 6',
  //   start_date: '2026-05-15',
  //   end_date: '2026-05-15',
  //   description: '2026-05-15'
  // }]

  // constructor() { }

  // public getVacations(): any {
  //   const vacationObservable = new Observable(observer => {
  //     setTimeout(() => {
  //       observer.next(this.vacations);
  //     }, 1000);
  //   })

  //   return vacationObservable;
  // }


// New Version

  // The URL of the Api
  baseUrl: string = "http://localhost:8080/api/vacations"

  // The Variables
  firestore: Firestore = inject(Firestore);
  
  // The imported service
  constructor(private http: HttpClient) { }

  // Create a vacation on the Api
  public async createVacation(accountId: number | undefined, title: string | undefined, lodging: string | undefined, 
    startDate: string | undefined, endDate: string | undefined, description: string | undefined) {

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify({
          account_id: accountId,
          title: title,
          lodging: lodging,
          start_date: startDate,
          end_date: endDate,
          description: description
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      });

      if(!response.ok) {
        throw new Error(`Error! Status: ${ response.status }`);
      }

      const result = (await response.json()) as Vacation;
      console.log('Result is: ', JSON.stringify(result, null, 4));
      return result;

    }
    catch (error) {
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected error: ', error );
        return 'An unexpected error has occurred.';
      }
    }
  }

  // // Create a Vacation on the Firebase Database
  // createVacation = async(newAccountId: number | undefined, newTitle: string | undefined, newLodging: string | undefined, 
  //   newStartDate: string | undefined, newEndDate: string | undefined, newDescription: string | undefined):
  //   Promise<void | DocumentReference<DocumentData>> => {

  //     // Can't make an account with missing values
  //     if (!newAccountId || !newTitle || !newLodging || !newStartDate || !newEndDate || !newDescription) {
  //       console.log('We can\'t make an account with missing values:\n '
  //         + newAccountId + '\n'
  //         + newTitle + '\n'
  //         + newLodging + '\n'
  //         + newStartDate + '\n'
  //         + newEndDate + '\n'
  //         + newDescription);

  //       return;
  //     }

  //     const futureVacation: CurrentVacation = {
  //       id: undefined,
  //       account_id: newAccountId,
  //       title: newTitle,
  //       lodging: newLodging,
  //       start_date: newStartDate,
  //       end_date: newEndDate,
  //       description: newDescription
  //     };

  //     futureVacation.id = undefined
  //     newAccountId && (futureVacation.account_id = newAccountId);
  //     newTitle && (futureVacation.title = newTitle);
  //     newLodging && (futureVacation.lodging = newLodging);
  //     newStartDate && (futureVacation.start_date = newStartDate);
  //     newEndDate && (futureVacation.end_date = newEndDate);
  //     newDescription && (futureVacation.description = newDescription);

  //     // Make and save the Vacation
  //     try {
  //       const newVacationRef = await addDoc(
  //         collection(this.firestore, "vacations"),
  //         futureVacation,
  //       );
  //     } catch (error) {
  //       console.error('Error writing new vacation to Firebase Database: ' + error);
  //       return;
  //     }
  //   }

  // Retrieve all vacations from the Api
  public retrieve() {
    return this.http.get<any>( this.baseUrl, { });
  }

  // Retrieve all vacations from the Firebase Database
  // retrieve = () => {
  //   // Create the query to load all the vacations and listen for new ones.
  //   const vacationsQuery = query(collection(this.firestore, "vacations"), orderBy('timestamp', 'desc'));
  //   // Start listening to the query
  //   return collectionData(vacationsQuery);
  // }

  // Retrieve all vacations associated with a specific account
  // public retrieveAccountVacations(accountId: number | undefined) {
  //   return this.http.get<any>(this.baseUrl + '/' + accountId, { });
  // }

  // Update a vacation on the Api
  public async updateVacation(vacationId: number | undefined, accountId: number | undefined, title: string | undefined, 
    lodging: string | undefined, startDate: string | undefined, endDate: string | undefined, description: string | undefined) {
    try {
      const response = await fetch(this.baseUrl + '/' + vacationId, {
        method: 'PATCH',
        body: JSON.stringify({
          vacation_id: vacationId,
          account_id: accountId,
          title: title,
          lodging: lodging,
          startDate: startDate,
          endDate: endDate,
          description: description
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = (await response.json()) as Vacation;
      console.log('result is: ', JSON.stringify(result, null, 4));
      return result;
    }
    catch (error) {
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected error: ', error);
        return 'An unexected error has occurred.';
      }
    }
  }

  // Delete a vacation on the Api
  public async deleteVacation(vacationId: number | undefined) {
    try {
      const response = await fetch(this.baseUrl + '/' + vacationId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      
      console.log('Vacation deleted successfully');
      return 'Vacation deleted successfully';
    }
    catch (error) {
      
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected error: ', error);
        return 'An unexpected error has occurred';
      }
    }
  }
}
