import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { DocumentReference, DocumentData, Firestore, collectionData, query } from '@angular/fire/firestore';
import { addDoc, updateDoc, collection, orderBy } from 'firebase/firestore';
import { timestamp } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

type CurrentAccount = {
  id: number | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  passcode: string | undefined;
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
export class AccountService {
  // accounts: Account[] = [{
  //   id: 1,
  //   username: 'FloatingSponge',
  //   email: 'ssquarepants@gmail.com',
  //   password: '1111111',
  //   passcode: '1111111'
  // }, {
  //   id: 2,
  //   username: 'runningSquid',
  //   email: 'stentacles@nick.com',
  //   password: '2222222',
  //   passcode: '2323232'
  // }, {
  //   id: 3,
  //   username: 'driftingStar',
  //   email: 'pseastar@nick.com',
  //   password: '3333333',
  //   passcode: '3434343'
  // }, {
  //   id: 4,
  //   username: 'ridingSquirel',
  //   email: 'sCheeks@nick.com',
  //   password: '4444444',
  //   passcode: '4545454'
  // }]

  // constructor() { }

  // public getAccounts(): any {
  //   const accountsObservable = new Observable(observer => {
  //     setTimeout(() => {
  //       observer.next(this.accounts);
  //     }, 10000);
  //   })

  //   return accountsObservable;
  // }


  // New Version

// The imported service
constructor(private http: HttpClient) { }

  // The URL of the Api
  baseUrl = 'http://localhost:8080/api/accounts';
  
  // The Variables
  // firestore: Firestore = inject(Firestore);

  // // Create an Account on the Api
  // public async createAccount(username: string | undefined, email: string | undefined, password: string | undefined, passcode: string | undefined) {
  //   try {
  //     const response = await fetch( this.baseUrl, {
  //       method: 'POST',
  //       body: JSON.stringify ({
  //         username: username,
  //         email: email,
  //         password: password,
  //         passcode: passcode
  //       }),

  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json'
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error! Status: ${response.status}`);
  //     }

  //     const result = (await response.json()) as Account;
  //     console.log('Result is: ', JSON.stringify(result, null, 4));
  //     return result;
  //   }
  //   catch (error) {
  //     if (error instanceof Error) {
  //       console.log('Error message: ', error.message);
  //       return error.message;
  //     } else {
  //       console.log('Unexpected Error: ', error);
  //       return 'An unexpected error occurred.'
  //     }
  //   }
  // }

  // // Create an Account on Cloud Firestore.
  // createAccount = async (newUsername: string | undefined, newEmail: string | undefined, newPassword: string | undefined, newPasscode: string | undefined):
  // Promise<void | DocumentReference<DocumentData>> => {

  //   // Can't make an account with missing values
  //   if (!newUsername || !newEmail || !newPassword || !newPasscode) {
  //     console.log('We can\'t add an account with missing values.\n ' 
  //       + newUsername + '\n' 
  //       + newEmail + '\n' 
  //       + newPassword + '\n' 
  //       + newPasscode);

  //     return;
  //   }

  //   const futureAccount: CurrentAccount = {
  //     id: undefined,
  //     username: newUsername,
  //     email: newEmail,
  //     password: newPassword,
  //     passcode: newPasscode,
  //   };

  //   futureAccount.id = undefined
  //   newUsername && (futureAccount.username = newUsername);
  //   newEmail && (futureAccount.email = newEmail);
  //   newPassword && (futureAccount.password = newPassword);
  //   newPasscode && (futureAccount.passcode = newPasscode);

  //   console.log('New Account Data:\n' 
  //       + newUsername + '\n' 
  //       + newEmail + '\n' 
  //       + newPassword + '\n' 
  //       + newPasscode);
    
  //   // Make and save the Account
  //   try {
  //     const newAccountRef = await addDoc(
  //       collection(this.firestore, "accounts"),
  //       futureAccount,
  //     );
  //     console.log(newAccountRef);

  //     return newAccountRef;
  //   } catch (error) {
  //     console.error('Error writing new account to Firebase Database: ' + error);
  //     return;
  //   }
  // }


  // Get all the accounts from the Api
  public retrieve() {
    return this.http.get<any>(this.baseUrl, { });
  }

  // Get all the accounts from the Firebase database
  // retrieve = () => {
  //   // Create the query to load all the accounts and listen for new ones.
  //   const accountsQuery = query(collection(this.firestore, 'accounts'), orderBy('timestamp', 'desc'));
  //   // Start listening to the query.
  //   return collectionData(accountsQuery);
  // }

  // Update an Account on the Api
  async updateAccount(accountId: number | undefined, username: string | undefined, email: string | undefined, password: string | undefined, 
    passcode: string | undefined) {

    try {
      const response = await fetch(this.baseUrl +'/' + accountId, {
        method: 'PATCH',
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          passcode: passcode
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${ response.status }`);
      }

      const result = (await response.json()) as Account;
      console.log('Result is: ', JSON.stringify(result, null, 4));
      return result;
    } 
    catch (error) {
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected Error: ', error);
        return 'An unexpected error has occurred.';
      }
    }
  }

  // // Update an Account on the Firebase Database
  // updateAccount = async(newUsername: string | undefined, newEmail: string | undefined, newPassword: string | undefined, 
  //   newPasscode: string | undefined):
  //   Promise<void | DocumentReference<DocumentData>> => {

  //     //TODO: Can't update an Account that doesn't exist



  //     // Can't update an Account with missing values
  //     if (!newUsername || !newEmail || !newPassword || !newPasscode) {
  //       console.log('We can\'t update an account with missing values.\n ' 
  //       + newUsername + '\n' 
  //       + newEmail + '\n' 
  //       + newPassword + '\n' 
  //       + newPasscode);

  //       return;
  //     }

  //     const updateAccount: CurrentAccount = {
  //       id: undefined,
  //       username: newUsername,
  //       email: newEmail,
  //       password: newPassword,
  //       passcode: newPasscode
  //     };

  //     updateAccount.id = undefined;
  //     newUsername && (updateAccount.username = newUsername);
  //     newEmail && (updateAccount.email = newEmail);
  //     newPassword && (updateAccount.password = newPassword);
  //     newPasscode && (updateAccount.passcode = newPasscode);

  //     // Update the Account and save the update in the Firebase Database
  //     try {
  //       // const newAccountRef = await updateDoc(
  //       //   collection(this.firestore, "accounts"),
  //       //   updateAccount,
  //       // );
  //     } catch {

  //     }

  //   }

  // Delete an Account on the Api
  async deleteAccount(accountId: number | undefined) {
    try {

      const response = await fetch(this.baseUrl + '/' + accountId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`)
      }

      console.log('Account deleted successfully');
      return 'Account deleted successfully';
    }
    catch (error) {
      if (error instanceof Error) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected error: ', Error);
        return 'An unexpected error has occured';
      }
    }
  }


  // Version 3

  public async createAccount(newUsername: string | undefined, newEmail: string | undefined, newPassword: string | undefined, newPasscode: string | undefined) {

    // Add a new document in collection 'accounts'
    // var accountsRef = db.collection("accounts");

    try {
      const accountRef = await addDoc(collection(db, "accounts"), {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        passcode: newPasscode,
      });

      await updateDoc(accountRef, {
        id: accountRef
      });

      console.log("Document written with id: " + accountRef.id);

      return accountRef;

    } catch (error) {    
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected Error: ', error);
        return 'An unexpected error occurred.'
      }
    }
  }

}
