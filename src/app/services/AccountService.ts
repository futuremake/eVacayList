import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';
import { DocumentReference, DocumentData, Firestore, collectionData, query } from '@angular/fire/firestore';
import { addDoc, updateDoc, collection, orderBy, getDocs, where, deleteDoc } from 'firebase/firestore';
import { timestamp } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

  accountsArray: Account[] = [];
  foundAccount: Account = new Account(); 

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

  // Create a document in the 'accounts' collection in the Firestore Database
  public async createAccount(newUsername: string | undefined, newEmail: string | undefined, newPassword: string | undefined, newPasscode: string | undefined) {    
    try {
      // Add a new document in collection 'accounts'
      const accountRef = await addDoc(collection(db, "accounts"), {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        passcode: newPasscode,
      });

      // Add the generated Id to the new document
      await updateDoc(accountRef, {
        id: accountRef.id
      });

      console.log("Document written with id: " + accountRef.id);
      return accountRef.id;

    } catch (error) {
      // Stop if something went wrong happened    
      if (error instanceof Error) {
        console.log('Error message: ', error.message);
        return error.message;
      } else {
        console.log('Unexpected Error: ', error);
        return 'An unexpected error occurred.';
      }
    }
  }

  // Get all the accounts from the Firestore Database
  public async retrieveAccounts() { 

    // // Test methods
    // // Test 1:
    // const docRef = doc(db, "accounts", "Md3mMvZCTJlhe9FJuwpW");
    // console.log("Document Reference Test 1: " + docRef);
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   console.log("Test Document Account Data 1: " + docSnap.data() 
    //   + "Account id: " + docSnap.id
    //   + docSnap.id);
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("Sorry, Test Document Account failed this time.");
    // }

    // // Test 2:
    // const docRef2 = doc(db, "accounts", "iEWIIf1j28eGjnXXCvKW");
    // console.log("Document Reference Test 2: " + docRef2);
    // const docSnap2 = await getDoc(docRef2);

    // if (docSnap2.exists()) {
    //   console.log("Test Document Account Data 2: " + docSnap2.data() + "Account id: " + docSnap2.id);
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("Sorry, Test Document Account failed this time.");
    // }

    // // Test 3:
    // const docRef3 = doc(db, "accounts", "pmd4Saok0IVk4OGtiMYY");
    // console.log("Document Reference Test 3: " + docRef3);
    // const docSnap3 = await getDoc(docRef3);

    // if (docSnap3.exists()) {
    //   console.log("Test Document Account Data 3: " + docSnap3.data() + "Account id: " + docSnap.id);
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("Sorry, Test Document Account failed this time.");
    // }

    // // Query Snapshot tests 2
    // const docRef4 = collection(db, 'accounts');
    // const r = query(docRef4, where("username", "==", "FloatingSponge"));
    // console.log("Query test 2 result: " + r);

    try {
      const q = query(collection(db, 'accounts'));
      const querySnapshot = await getDocs(q);

      // Query Snapshot Tests
      this.foundAccount = new Account();
      this.foundAccount.id = undefined;
      this.accountsArray = [];
      
      querySnapshot.forEach(doc => {
        console.log(doc.id + " => ");
        console.log(doc.data());
        // console.log(doc.data()['email']);
        this.foundAccount.id = doc.data()['id'];
        this.foundAccount.email = doc.data()['email'];
        this.foundAccount.username = doc.data()['username'];
        this.foundAccount.password = doc.data()['password'];
        this.foundAccount.passcode = doc.data()['passcode'];

        this.accountsArray.push(this.foundAccount);
        this.foundAccount = new Account();
      });

      // return querySnapshot;
      return this.accountsArray;
    } catch (error) {
        if (error instanceof Error) {
          console.log("Error Message: " + error.message);
          return error.message;
        } else {
          console.log("Unknown error: " + error);
          return "An Unknown Error has occurred.";
        }
    }

    // return -1;
  }

  public async retrieveAccount(accountId: number | undefined) {

    console.log("The Id to retrieve an account from: " + accountId);
    const docRef = collection(db, 'accounts');
    const q = query(docRef, where("account_id", "==", "accountId"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id + " => " );
      console.log(doc.data());
      this.foundAccount.id = doc.data()['id'];
      this.foundAccount.email = doc.data()['email'];
      this.foundAccount.username = doc.data()['username'];
      this.foundAccount.password = doc.data()['password'];
      this.foundAccount.passcode = doc.data()['passcode'];
    });

    return this.foundAccount;

  }


  // Update an Account's Password on Firestore
  public async editAccountPassword(editEmail: string | undefined, editUsername: string | undefined,
    editPassword: string | undefined, editPasscode: string | undefined) {

    const accountRef = collection(db, "accounts");
    const q = query(accountRef, where("email", "==", editEmail), where("username", "==", editUsername), 
    where("passcode", "==", editPasscode));
    const querySnapShot = await getDocs(q);

    this.foundAccount = new Account();

    querySnapShot.forEach((doc) => {
        if(doc.exists()) {
          this.foundAccount.id = doc.data()['id'];
          this.foundAccount.email = doc.data()['email'];
          this.foundAccount.username = doc.data()['username'];
          this.foundAccount.password = doc.data()['password'];
          this.foundAccount.passcode = doc.data()['passcode'];
        }
    });

    this.foundAccount.password = editPassword;

    if (this.foundAccount.id != undefined){
      const editRef = doc(db, "accounts", this.foundAccount.id.toString());
      const e = await updateDoc(editRef, {
        id: this.foundAccount.id,
        email: this.foundAccount.email,
        username: this.foundAccount.username,
        password: this.foundAccount.password,
        passcode: this.foundAccount.passcode,
      });

      return e;
    }

    return -1;
  }

  // Update an Account in the Firestore database
  public async editAccount(accountId: number | undefined, editUsername: string | undefined, editEmail: string | undefined,
    editPassword: string | undefined, editPasscode: string | undefined) {

    if (accountId != undefined) {
      const editRef = doc(db, "accounts", accountId.toString());
      const e = await updateDoc(editRef, {
        id: accountId,
        email: editEmail,
        username: editUsername,
        password: editPassword,
        passcode: editPasscode
      });

      return e;
    }
     
    return -1;
  }

  // Delete an Account on Firestore
  public async removeAccount(accountId: number | undefined) {

    if (accountId != undefined) {

      const removeRef = doc(db, "accounts", accountId.toString());
      const r = await deleteDoc(removeRef);

      return r;
    }

    return -1;
  }
}
