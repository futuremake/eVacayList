import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class CommunicationService {

    // The variable that holds the input data (number)
    private dataStream = new BehaviorSubject<number|undefined>(-1);

    // Another variable that holds the input data (number)
    private dataStream2 = new BehaviorSubject<number|undefined>(-1);

    // A third variable that holds the input data (number)
    private dataStream3 = new BehaviorSubject<number|undefined>(-1);

    // The variable that holds the input data (string)
    private datastreamString = new BehaviorSubject<string | undefined>('N/A');

    // The variable that outputs the held data (number)
    currentData$ = this.dataStream.asObservable();

    // Another variable that outputs the held data (number)
    currentData2$ = this.dataStream2.asObservable();

    // A Third variable that outputs the held data (number)
    currentData3$ = this.dataStream3.asObservable();

    // The variable that outputs the held data (string)
    currentDataString$ = this.datastreamString.asObservable();

    // The function that carries data from one class to another (number)
    transmitData(newNumber: number|undefined) {
        this.dataStream.next(newNumber);
    }

    // Another function that carrys data from one class to another (number)
    transmitData2(newNumber: number|undefined) {
        this.dataStream2.next(newNumber);
    }

    // A third function that carrys data from one class to another (number)
    transmitData3(newNumber: number|undefined) {
        this.dataStream3.next(newNumber);
    }

    // The function that carries data from one class to another (string)
    transmitDataString(newString: string | undefined) {
        this.datastreamString.next(newString);
    }
}
