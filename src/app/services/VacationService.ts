import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vacation } from '../models/vacation.model';
import { DocumentReference, DocumentData, Firestore, query, collectionData } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, orderBy, getFirestore, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';

type CurrentVacation = {
  id: number | undefined;
  account_id: number | undefined;
  title: string | undefined;
  lodging: string | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  description: string | undefined;
}

const firebaseConfig = {
        apiKey: "AIzaSyBY46CRU09sgwBGX75jfZOQhVzVoz3eMxQ",
        authDomain: "evacaylist.firebaseapp.com",
        projectId: "evacaylist",
        storageBucket: "evacaylist.firebasestorage.app",
        messagingSenderId: "46775024805",
        appId: "1:46775024805:web:a633f37ebf25fe87bb614c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize FireStore and get a reference to the service
const db = getFirestore(app);

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
  // firestore: Firestore = inject(Firestore);

  foundVacation: Vacation = new Vacation();
  vacationsArray: Vacation[] = [];
  
  // The imported service
  constructor(private http: HttpClient) { }

  // // Create a vacation on the Api
  // public async createVacation(accountId: number | undefined, title: string | undefined, lodging: string | undefined, 
  //   startDate: string | undefined, endDate: string | undefined, description: string | undefined) {

  //   try {
  //     const response = await fetch(this.baseUrl, {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         account_id: accountId,
  //         title: title,
  //         lodging: lodging,
  //         start_date: startDate,
  //         end_date: endDate,
  //         description: description
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json'
  //       },
  //     });

  //     if(!response.ok) {
  //       throw new Error(`Error! Status: ${ response.status }`);
  //     }

  //     const result = (await response.json()) as Vacation;
  //     console.log('Result is: ', JSON.stringify(result, null, 4));
  //     return result;

  //   }
  //   catch (error) {
  //     if (error instanceof Error) {
  //       console.log('Error message: ', error.message);
  //       return error.message;
  //     } else {
  //       console.log('Unexpected error: ', error );
  //       return 'An unexpected error has occurred.';
  //     }
  //   }
  // }

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

  // Create a Vacation in the Firebase Database
  public async createVacation(newAccountId: number | undefined, newTitle: string | undefined, newLodging: string | undefined, 
    newStartDate: string | undefined, newEndDate: string | undefined, newDescription: string | undefined) {
      
      try {
        const vacationRef = await addDoc(collection(db, 'vacations'), {
          account_id: newAccountId,
          title: newTitle,
          lodging: newLodging,
          start_date: newStartDate,
          end_date: newEndDate,
          description: newDescription
        });

        await updateDoc(vacationRef, {
          id: vacationRef.id
        });

        console.log("Document created with id: " + vacationRef.id);
        return vacationRef.id;

      } catch (error) {
        if (error instanceof Error) {
          console.log("Error Message: " + error.message);
          return error.message;
        } else {
          console.log("Unknown error: " + error);
          return "An Unknown Error has occurred.";
        }
      }

    }

  // Retrieve all vacations in the Firebase Database
  public async retrieveVacations(accountId: number | undefined) {

    const vacayRef = collection(db, "vacations");
    const q = query(vacayRef, where("id", "==", accountId));
    const querySnapshot = await getDocs(q);

    this.vacationsArray = [];

    querySnapshot.forEach((doc) => {
      console.log(doc.id + " => ");
      console.log(doc.data());
      this.foundVacation.id = doc.data()['id'];
      this.foundVacation.account_id = doc.data()['account_id'];
      this.foundVacation.title = doc.data()['title'];
      this.foundVacation.lodging = doc.data()['lodging'];
      this.foundVacation.start_date = doc.data()['start_date'];
      this.foundVacation.end_date = doc.data()['end_date'];
      this.foundVacation.description = doc.data()['description'];

      this.vacationsArray.push(this.foundVacation);
      this.foundVacation = new Vacation();
    });
    
    return this.vacationsArray; 
  }

  // Update a Vacation in the FireBase Database
  public async editVacation(vacationId: number | undefined, accountId: number | undefined, editTitle: string | undefined, 
    editLodging: string | undefined, editStartDate: string | undefined, editEndDate: string | undefined, 
    editDescription: string | undefined) {
      
    if (vacationId != undefined) {
      const editRef = doc(db, "vacations", vacationId.toString());
      const e = await updateDoc(editRef, {
        id: vacationId,
        account_id: accountId,
        title: editTitle,
        lodging: editLodging,
        start_date: editStartDate,
        end_date: editEndDate,
        description: editDescription
      });

      return e;
    }

    return -1;
  }


  // Delete a Vacation in the Firebase Database
  public async removeVacation(vacationId: number | undefined) {

    try {
      if (vacationId != undefined) {
        const removeRef = doc(db, "vacation", vacationId.toString());
        
        console.log("The stringified vacationId to use for vacation deletion: " + vacationId.toString());

        const r = await deleteDoc(removeRef);

        return r;
      }
    } catch (error) {
        if (error instanceof Error) {
          console.log("Error Message: " + error.message);
          return error.message;
        } else {
          console.log("Unknown error: " + error);
          return "An Unknown Error has occurred.";
        }
    }

    return -1;
  }
}
