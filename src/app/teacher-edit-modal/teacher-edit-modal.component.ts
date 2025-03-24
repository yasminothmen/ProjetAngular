import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-edit-modal',
  templateUrl: './teacher-edit-modal.component.html',
  styleUrls: ['./teacher-edit-modal.component.css']
})
export class TeacherEditModalComponent {
  editTeacherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TeacherEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize the form with the passed data
    this.editTeacherForm = this.fb.group({
      firstname: [data.teacher.firstname, Validators.required],
      lastname: [data.teacher.lastname, Validators.required],
      email: [data.teacher.email, [Validators.required, Validators.email]],
      matieresEnseignees: [data.teacher.matieresEnseignees, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editTeacherForm.valid) {
      const updatedTeacher = {
        ...this.data.teacher,  // Keep the original teacher object intact
        ...this.editTeacherForm.value,
        // Ensure matieresEnseignees is a string before calling .split(',')
        matieresEnseignees: typeof this.editTeacherForm.value.matieresEnseignees === 'string'
          ? this.editTeacherForm.value.matieresEnseignees.split(',').map((matiere: string) => matiere.trim())
          : this.editTeacherForm.value.matieresEnseignees  // If it's already an array, leave it unchanged
      };
      this.dialogRef.close(updatedTeacher);  // Return the updated teacher with the ID
    }
  }

  cancelEdit(): void {
    this.dialogRef.close();  // Close without updating
  }
}
