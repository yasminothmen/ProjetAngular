// student-edit-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-edit-modal',
  templateUrl: './student-edit-modal.component.html',
  styleUrls: ['./student-edit-modal.component.css']
})
export class StudentEditModalComponent {
  editStudentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editStudentForm = this.fb.group({
      firstname: [data.student.firstname, Validators.required],
      lastname: [data.student.lastname, Validators.required],
      email: [data.student.email, [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.editStudentForm.valid) {
      const updatedStudent = {
        ...this.data.student,  // Conserve les données originales
        ...this.editStudentForm.value
      };
      this.dialogRef.close(updatedStudent);
    }
  }

  cancelEdit(): void {
    this.dialogRef.close();
  }
}