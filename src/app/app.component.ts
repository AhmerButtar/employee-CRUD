import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy } from '@angular/core';
import { Employee } from './models/employee.model';
import { EmployeeService } from './MyServices/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {



  title = 'employee-CRUD';

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;


  employeeForm!: FormGroup;

  employees: Employee[];
  employeesToDisplay: Employee[] = [];



  educationOptions = [
    "Matric",
    "Intermediate",
    "Bachlors",
    "Masters",
    "PhD"

  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = this.employees;
  }

  ngOnInit(): void {

    this.employeeForm = this.fb.group({
      firstname: this.fb.control(''),
      lastname: this.fb.control(''),
      birthday: this.fb.control(''),
      gender: this.fb.control(''),
      education: this.fb.control('default'),
      company: this.fb.control(''),
      jobExperiance: this.fb.control(''),
      salary: this.fb.control(''),

    });
    this.employeeService.getEmployee().subscribe(res => {
      for(let emp of res){
        this.employees.unshift(emp);
      }
      this.employeesToDisplay = this.employees;
    })
  }

  ngAfterViewInit(): void {
    console.log('ViewChild initialized:', this.addEmployeeButton);

  }

  removeEmployee(event: any){
    this.employees.forEach((val,index) => {
      if ( val.id === parseInt(event)){
        this.employeeService.deleteEmployee(event).subscribe((res) =>{
          this.employees.splice(index,1);
        })
      }
    });
  }

  editEmployee(event: any) {

    
    this.employees.forEach((val,index) => {
      if ( val.id === event){
        this.setForm(val);
      }
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click(); 
  }


  setForm(emp: Employee){
    this.Firstname.setValue(emp.firstname);
    this.Lastname.setValue(emp.lastname);
    this.Birthday.setValue(emp.birthdate);
    this.Gender.setValue(emp.gender);

    let educationIndex =0;
    this.educationOptions.forEach((val,index) => {
      if(val === emp.education) educationIndex = index;
    })
    this.Education.setValue(educationIndex);

    this.Company.setValue(emp.company);
    this.JobExperiance.setValue(emp.jobExperiance);
    this.Salary.setValue(emp.salary);
    this.fileInput.nativeElement.value = '';
  }

  

  addEmployee(){
    let employee: Employee = {
      firstname: this.Firstname.value,
      lastname: this.Lastname.value,
      birthdate: this.Birthday.value,
      gender: this.Gender.value,
      education: this.educationOptions[parseInt(this.Education.value)],
      company: this.Company.value,
      jobExperiance: this.JobExperiance.value,
      salary: this.Salary.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    }
    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
    })
  }

  clearForm() {
    this.Firstname.setValue('');
    this.Lastname.setValue('');
    this.Birthday.setValue('');
    this.Gender.setValue('');
    this.Education.setValue('');
    this.Company.setValue('');
    this.JobExperiance.setValue('');
    this.Salary.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  public get Firstname(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  public get Lastname(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  public get Birthday(): FormControl {
    return this.employeeForm.get('birthday') as FormControl;
  }
  public get Gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }
  public get Education(): FormControl {
    return this.employeeForm.get('education') as FormControl;
  }
  public get Company(): FormControl {
    return this.employeeForm.get('company') as FormControl;
  }
  public get JobExperiance(): FormControl {
    return this.employeeForm.get('jobExperiance') as FormControl;
  }
  public get Salary(): FormControl {
    return this.employeeForm.get('salary') as FormControl;
  }

  searchEmployees(event: any){
    let filteredEmployees: Employee[]= [];
    if(event === ''){
      this.employeesToDisplay = this.employees;
    } else {
      filteredEmployees = this.employees.filter((val,index) => {
        let targetKey = val.firstname.toLocaleLowerCase() + ' ' + val.lastname.toLocaleLowerCase();
        let searchKey = event.toLocaleLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }

  }

}
