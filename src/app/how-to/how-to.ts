import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../services/CommunicationService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-to',
  imports: [],
  templateUrl: './how-to.html',
  styleUrl: './how-to.css',
})
export class HowTo implements OnInit {

  // The variables
  title = 'How-To Page';

  receivedAccountId: number|undefined = -1;

  // The Imported Services
  constructor(private commService: CommunicationService, private router: Router) {}

  ngOnInit(): void {
    
    // // Recieving the account id (if it exists)
    // this.commService.currentData$.subscribe((data) => {
    //   this.receivedAccountId = data;
    //   console.log("Received data: " + data);
    // });

    // Receiving the account id from sessionStorage (if it exists)
    const accountInfo = JSON.parse(sessionStorage.getItem('accountInfo') || '{}');
    console.log('The raw account info: ');
    console.log(accountInfo);

    this.receivedAccountId = accountInfo.account_id;
    console.log('The received account Id: ' + this.receivedAccountId);

  }

  // Send the user back to the previous page
  startPagePath(): void {

    // Send the user back to the home page.
    if (this.receivedAccountId == undefined || this.receivedAccountId < 0) {
      alert('Going back to the starting page!');
      this.router.navigate(['/home']);
    }

    // Send the user back to the vacation list page.
    if (this.receivedAccountId != undefined && this.receivedAccountId != -1){
      alert('Going back to the Vacation List page!');
      // this.commService.transmitData(this.receivedAccountId);

      sessionStorage.setItem('accountInfo', JSON.stringify({'account_id' : this.receivedAccountId}));
      this.router.navigate(['/vacation-list']);
    } 
  }
}
