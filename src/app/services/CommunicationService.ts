import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class CommunicationService {

    // The variable that holds the input data (number)
    private dataStream = new BehaviorSubject<number|undefined>(-1);

    // The variable that holds the input data (string)
    private datastreamString = new BehaviorSubject<string | undefined>('N/A');

    // The variable that outputs the held data (number)
    currentData$ = this.dataStream.asObservable();

    // The variable that outputs the held data (string)
    currentDataString$ = this.datastreamString.asObservable();

    // The function that carries data from one class to another (number)
    transmitData(newNumber: number|undefined) {
        this.dataStream.next(newNumber);
    }

    // The function that carries data from one class to another (string)
    transmitDataString(newString: string | undefined) {
        this.datastreamString.next(newString);
    }
}
