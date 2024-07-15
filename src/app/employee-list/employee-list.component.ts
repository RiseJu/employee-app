import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  Employee,
  EmployeeService,
} from '../services/employee/employee.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';

import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    NgFor,
    MatTableModule,
    MatPaginatorModule,
    DataTablesModule,
    MatCardModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName'];
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject();

  AfterViewInit() {
    this.callData();
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.callData();
  }

  callData(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log(dataTablesParameters);
        this.employeeService
          .getEmployees(dataTablesParameters)
          .subscribe((data) => {
            callback({
              recordsTotal: data.totalRecords,
              recordsFiltered: data.filteredRecords,
              data: data.employees,
            });
            this.dtTrigger.next({});
          });
      },
      columns: [
        {
          title: 'Username',
          data: 'username',
        },
        {
          title: 'Email',
          data: 'email',
        },
        {
          title: 'First name',
          data: 'firstName',
        },
        {
          title: 'Last name',
          data: 'lastName',
        },
        {
          title: 'Actions',
          data: null,
          defaultContent: '',
          orderable: false,
          render: (data: any, type: any, row: Employee) => {
            return `
              <button class="btn btn-primary btn-view">View</button>
              <button class="btn btn-success btn-edit">Edit</button>
              <button class="btn btn-danger btn-delete">Delete</button>
            `;
          },
        },
      ],
      rowCallback: (row: Node, data: Employee | {}, index: number) => {
        const self = this;
        $('td:last-child button.btn-view', row).on('click', () => {
          let employeeData = data as Employee;
          self.viewEmployee(employeeData.username);
        });
        $('td:last-child button.btn-edit', row).on('click', () => {
          let employeeData = data as Employee;
          self.editEmployee(employeeData.username);
        });
        $('td:last-child', row).on('click', 'button.btn-delete', () => {
          self.deleteEmployee(index);
        });
        return row;
      },
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next({});
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onCaptureEvent(event: any) {
    if (event.cmd == 'edit') {
      this.router.navigate(['/edit-employee', 0]);
    } else {
      this.employeeService.deleteEmployee(0);
    }
  }

  addEmployee(): void {
    this.router.navigate(['/add-employee']);
  }

  viewEmployee(username: string): void {
    this.router.navigate(['/employee', username]);
  }

editEmployee(username: string): void {
    this.router.navigate(['/edit-employee', username]);
  }

  deleteEmployee(index: number): void {
    this.employeeService.deleteEmployee(index);
  }
}
