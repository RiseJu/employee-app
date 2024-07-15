import { Component } from '@angular/core';
import {
  Employee,
  EmployeeService,
} from '../services/employee/employee.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  editIndex: string | null = null;
  employees: Employee[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const index = params.get('index');
      console.log(index)
      if (index !== null) {
        this.editIndex = index;
        // const employee = this.employees[this.editIndex];findEmployeeByUsername
        const employee = this.employeeService.findEmployeeByUsername(index)
        console.log(employee)
        if (employee) {
          this.employeeForm.patchValue({
            ...employee,
            birthDate: new Date(employee.birthDate).toISOString().split('T')[0],
          });
        }
      }
    });
  }

  onSubmit(): void {
    const employee: Employee = {
      ...this.employeeForm.value,
      birthDate: new Date(this.employeeForm.value.birthDate),
    };
    if (this.editIndex !== null) {
      this.employeeService.updateEmployee(this.editIndex, employee);
    } else {
      this.employeeService.addEmployee(employee);
    }
    this.router.navigate(['/']);
  }
}
