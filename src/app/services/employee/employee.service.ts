import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Employee {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // private employees: Employee[] = [];
  private employeesSubject: BehaviorSubject<Employee[]>;
  public employees$: Observable<Employee[]>;
  public localStorage: Storage | undefined;
  constructor() {
    const savedEmployees = localStorage.getItem('employees');
    const employees = savedEmployees ? JSON.parse(savedEmployees) : [];
    this.employeesSubject = new BehaviorSubject<Employee[]>(employees);
    this.employees$ = this.employeesSubject.asObservable();
  }

  private saveEmployeesToLocalStorage(employees: Employee[]): void {
    localStorage.setItem('employees', JSON.stringify(employees));
  }
  getEmployees(params: any): Observable<any> {
    const savedEmployees = localStorage.getItem('employees');
    const employees = savedEmployees ? JSON.parse(savedEmployees) : [];

    // Simulasi data server-side processing
    // Anda dapat menyesuaikan logika ini sesuai kebutuhan aplikasi Anda
    const start = params.start || 0;
    const length = params.length || employees.length;
    const searchValue = params.search.value || '';

    console.log(employees);
    let filteredEmployees = employees.filter((employee: Employee) => {
      if (searchValue != '') {
        return (
          employee.username.toLowerCase().includes(searchValue.toLowerCase()) ||
          employee.firstName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else {
        return employee;
      }
    });

    if (params.order.length > 0) {
      const orderColumn = params.order[0].column;
      const orderDir = params.order[0].dir;
      console.log(orderColumn, orderDir);
      switch (orderColumn) {
        // Example sorting by username
        case 0:
          filteredEmployees = filteredEmployees.sort(
            (a: Employee, b: Employee) => {
              const nameA = a.username.toUpperCase();
              const nameB = b.username.toUpperCase();
              if (nameA < nameB) {
                return orderDir === 'asc' ? -1 : 1;
              }
              if (nameA > nameB) {
                return orderDir === 'asc' ? 1 : -1;
              }
              return 0;
            }
          );
          break;

        case 1:
          filteredEmployees = filteredEmployees.sort(
            (a: Employee, b: Employee) => {
              const nameA = a.email.toUpperCase();
              const nameB = b.email.toUpperCase();
              if (nameA < nameB) {
                return orderDir === 'asc' ? -1 : 1;
              }
              if (nameA > nameB) {
                return orderDir === 'asc' ? 1 : -1;
              }
              return 0;
            }
          );
          break;

        case 2:
          filteredEmployees = filteredEmployees.sort(
            (a: Employee, b: Employee) => {
              const nameA = a.firstName.toUpperCase();
              const nameB = b.firstName.toUpperCase();
              if (nameA < nameB) {
                return orderDir === 'asc' ? -1 : 1;
              }
              if (nameA > nameB) {
                return orderDir === 'asc' ? 1 : -1;
              }
              return 0;
            }
          );
          break;

        case 3:
          filteredEmployees = filteredEmployees.sort(
            (a: Employee, b: Employee) => {
              const nameA = a.lastName.toUpperCase();
              const nameB = b.lastName.toUpperCase();
              if (nameA < nameB) {
                return orderDir === 'asc' ? -1 : 1;
              }
              if (nameA > nameB) {
                return orderDir === 'asc' ? 1 : -1;
              }
              return 0;
            }
          );
          break;
        // Add cases for other columns as needed
      }
    }
    const totalRecords = filteredEmployees.length;
    filteredEmployees = filteredEmployees.slice(start, start + length);

    console.log(filteredEmployees);

    return of({
      totalRecords: totalRecords,
      filteredRecords: filteredEmployees.length,
      employees: filteredEmployees,
    });
  }
  
  findEmployeeByUsername(username:String): Employee {
    const savedEmployees = localStorage.getItem('employees'); 
    const employees = savedEmployees ? JSON.parse(savedEmployees) : [];
    return employees.find((e:Employee) =>e.username == username)
  }

  addEmployee(employee: Employee): void {
    const currentEmployees = this.employeesSubject.value;
    currentEmployees.push(employee);
    this.saveEmployeesToLocalStorage(currentEmployees);
    this.employeesSubject.next(currentEmployees);
  }

  updateEmployee(username: string, employee: Employee): void {
    const currentEmployees = this.employeesSubject.value;
    let index = currentEmployees.findIndex((em:Employee)=>em.username ==username)
    currentEmployees[index] = employee;
    this.saveEmployeesToLocalStorage(currentEmployees);
    this.employeesSubject.next(currentEmployees);
  }

  deleteEmployee(index: number): void {
    // this.employees.splice(index, 1);
  }
}
