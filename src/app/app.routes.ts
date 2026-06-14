import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { LogIn } from './log-in/log-in';
import { VacationList } from './vacation-list/vacation-list';
import { VacationDetails } from './vacation-details/vacation-details';
import { ExcursionDetails } from './excursion-details/excursion-details';
import { HowTo } from './how-to/how-to';
import { NewAccount } from './new-account/new-account';
import { NewPassword } from './new-password/new-password';
import { Profile } from './profile/profile';

export const routes: Routes = [
    { path: "", component: HomePage },
    { path: "home", component: HomePage },
    { path: "log-in", component: LogIn },
    { path: "vacation-list", component: VacationList },
    { path: "vacation-details", component: VacationDetails },
    { path: "excursion-details", component: ExcursionDetails },
    { path: "how-to", component: HowTo },
    { path: "new-account", component: NewAccount },
    { path: "new-password", component: NewPassword },
    { path: "profile", component: Profile }
];
