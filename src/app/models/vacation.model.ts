import { Injectable } from "@angular/core";

// @Injectable()
export class Vacation {
    id: number | undefined;
    account_id: number | undefined;
    title: string | undefined;
    lodging: string | undefined;
    start_date: string | undefined;
    end_date: string | undefined;
    description: string | undefined;
}