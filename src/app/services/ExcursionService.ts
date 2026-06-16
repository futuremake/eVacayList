import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Excursion } from '../models/excursion.model';
import { DocumentReference, DocumentData, Firestore, query, collectionData } from '@angular/fire/firestore';
import { addDoc, collection, orderBy } from 'firebase/firestore';

type CurrentExcursion = {
  id: number | undefined;
  account_id: number | undefined;
  vacation_id: number | undefined;
  title: string | undefined;
  start_date: string | undefined;
  description: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ExcursionService {
  // excursions: Excursion[] = [{
  //   id: 1,
  //   account_id: 1,
  //   vacation_id: 1,
  //   title: '4th of July Beach Party!',
  //   start_date: '2026-05-16',
  //   description: 'We do July 4th right. Dance the sand into the air on the 4th of July beach party!'
  // }, {
  //   id: 2,
  //   account_id: 2,
  //   vacation_id: 2,
  //   title: 'The Oscars Award Show',
  //   start_date: '2026-05-16',
  //   description: 'See if your favorite actor won the top award, or any award, at the Oscars award show!'
  // }, {
  //   id: 3,
  //   account_id: 3,
  //   vacation_id: 3,
  //   title: 'The National Bot Fight Tournment!',
  //   start_date: '2026-05-16',
  //   description: 'If you are a Bot-fighter or just like to watch metal-crush-metal on the battlefield, then see the best fights in the nation at the National Bot Fight Tournament!'
  // }, {
  //   id: 4,
  //   account_id: 4,
  //   vacation_id: 4,
  //   title: 'The Texas State Fair!',
  //   start_date: '2026-05-16',
  //   description: 'The biggest State Fair in America. See the best of the Lone Star State at the Texas State Fair!'
  // }]

  // constructor() { }

  // public getExcursions(): any {
  //   const excursionObservable = new Observable(observer => {
  //     setTimeout(() => {
  //       observer.next(this.excursions);
  //     }, 1000);
  //   })

  //   return excursionObservable;
  // }

  // The URL of the Api
  baseUrl: string = 'http://localhost:8080/api/excursions';
    
  // The Variables
  firestore: Firestore = inject(Firestore);

  // The imported service
  constructor(private http: HttpClient) { }

  // Create an excursion in the Api
  public async createExcursion(accountId: number | undefined, vacationId: number | undefined, title: string | undefined, 
    startDate: string | undefined, description: string | undefined) {
    console.log('Excur Service accountId: ' + accountId);
    console.log('Excur Service vacationId: ' + vacationId);
    console.log('Excur Service title: ' + title);
    console.log('Excur Service startDate: ' + startDate);
    console.log('Excur Service description: ' + description);
    try {
      const response = await fetch(this.baseUrl,  {
        method: 'POST',
        body: JSON.stringify({
          accountId: accountId,
          vacationId: vacationId,
          title: title,
          startDate: startDate,
          description: description
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      const result = (await response.json()) as Excursion;
      console.log('Result is: ', JSON.stringify(result, null, 4));
      return result;
    }
    catch (error) {
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected Error: ', error)
        return 'An unexpected error has occurred.';
      }
    }
  }

  // // Create an Excursion in the Firebase Database.
  // createExcursion = async(newAccountId: number | undefined, newVacationId: number | undefined, newTitle: string | undefined, 
  //   newStartDate: string | undefined, newDescription: string | undefined):
  //   Promise<void | DocumentReference<DocumentData>> => {

  //     // Can't make an Excursion with missing values
  //     if (!newAccountId || !newVacationId || !newTitle || !newStartDate || !newDescription){
  //       console.log('We can\'t make an Excursion with missing values:\n '
  //         + newAccountId + '\n'
  //         + newVacationId + '\n'
  //         + newTitle + '\n'
  //         + newStartDate + '\n'
  //         + newDescription);

  //       return;
  //     }

  //     const futureExcursion: CurrentExcursion = {
  //       id: undefined,
  //       account_id: newAccountId,
  //       vacation_id: newVacationId,
  //       title: newTitle,
  //       start_date: newStartDate,
  //       description: newDescription
  //     }

  //     futureExcursion.id = undefined
  //     newAccountId && (futureExcursion.account_id = newAccountId);
  //     newVacationId && (futureExcursion.vacation_id = newVacationId);
  //     newTitle && (futureExcursion.title = newTitle);
  //     newStartDate && (futureExcursion.start_date = newStartDate);
  //     newDescription && (futureExcursion.description = newDescription);

  //     // Make and save the new Excursion to the Firebase Database
  //     try {
  //       const newExcursionRef = await addDoc(
  //         collection(this.firestore, "excursions"),
  //         futureExcursion
  //       );
  //     } catch (error) {
  //       console.error('Error writing new Excursion to Firebase Database: ' + error);
  //       return;
  //     }
  //   }

  // Retrieve all excursions in the Api
  public retrieve() {
    return this.http.get<any>(this.baseUrl, { });
  }

  // // Retrieve all excursions in the Firebase Database
  // retrieve = () => {
  //   // Create the query to load all the excursions and listen for new ones.
  //   const excursionsQuery = query(collection(this.firestore, 'excursions'), orderBy('timestamp', 'desc'));
  //   // Start listening to the query
  //   return collectionData(excursionsQuery);
  // }

  // // Retrieve information about a vacation's specific excursion
  // // public retrieveVacationExcursions(excursionId: number | undefined) {
  // //   return this.http.get<any>(this.baseUrl + '/' + excursionId, { });
  // // }

  // Update a excursion in the Api
  public async updateExcursion(excursionId: number | undefined, title: string | undefined, startDate: string | undefined,
    description: string | undefined) {

    try {
      const response = await fetch(this.baseUrl + '/' + excursionId, { 
        method: 'PATCH',
        body: JSON.stringify({
          title: title,
          startDate: startDate,
          description: description
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      const result = (await response.json()) as Excursion;
      console.log('Result is: ', JSON.stringify(result, null, 4));
      return result;
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


  // Delete an Excursion in the Api
  public async deleteExcursion(excursionId: number | undefined) {

    try {

      const response = await fetch(this.baseUrl + '/' + excursionId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      console.log('Account deleted successfully');
      return 'Account deleted successfully';
    }
    catch (error) {
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected error: ', error);
        return 'An unexpected error has occurred.';
      }
    }
  }
}
