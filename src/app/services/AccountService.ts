import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';

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

  // Create an Account on the Api
  public async createAccount(username: string | undefined, email: string | undefined, password: string | undefined, passcode: string | undefined) {
    try {
      const response = await fetch( this.baseUrl, {
        method: 'POST',
        body: JSON.stringify ({
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
        throw new Error(`Error! Status: ${response.status}`);
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
        return 'An unexpected error occurred.'
      }
    }
  }

  // Get all the accounts from the Api
  public retrieve() {
    return this.http.get<any>(this.baseUrl, { });
  }

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
}
