import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HomeComponent } from './home/Home';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'employee', component: EmployeeListComponent },
    { path: 'employee/:username', component: EmployeeDetailComponent },
    { path: 'add-employee', component: EmployeeFormComponent },
    { path: 'edit-employee/:index', component: EmployeeFormComponent },
];
