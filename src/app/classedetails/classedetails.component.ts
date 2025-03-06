import {Component, OnInit} from '@angular/core';
import {Class} from "../models/class";
import {ClassesService} from "../services/classes.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-classedetails',
  templateUrl: './classedetails.component.html',
  styleUrls: ['./classedetails.component.css']
})
export class ClassedetailsComponent implements OnInit{
class: Class | null = null;
error:string='';
constructor(
  private classService: ClassesService,
  private route:ActivatedRoute
) {
}
ngOnInit(){
  const classId = this.route.snapshot.paramMap.get('id');
  if(classId){
    this.classService.getClassById(classId).subscribe({
      next:(classData)=>{
        this.class=classData;

      },
      error:(error)=>{
        this.error = 'Error fetching class details';
        console.error(error);
      }
    })
  }
}

}
