import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ProjectService,UploadService]

})
export class EditComponent implements OnInit {

  public title:string;
  public project: Project;
  public status: string;
  public filesToUpload: Array<File>;
  public save_project;
  public url:string;

  constructor(
  
    private _projectService: ProjectService,
    private _uploadService: UploadService,
    private _route:ActivatedRoute,
    private _router:Router

  ) {

    this.title = "Editar proyecto";
    this.url = Global.url;
    

  }

  ngOnInit(): void {
    this._route.params.subscribe(params =>{
      let id = params.id;

      this.getProject(id);
    })

  }

  getProject(id){
          
    this._projectService.getProject(id).subscribe(
      response => {

        this.project = response.project;

      },
      error => {
        console.log(<any>error);
      },
    )




  }
  
  onSubmit(){
    this._projectService.updateProject(this.project).subscribe(
      
      response =>{
        if(response.project){
          
          if(this.filesToUpload){
            this._uploadService.makeFileRequest(Global.url+'upload-image/'+response.project._id,[],this.filesToUpload,'image').then((result:any) =>{
              this.status = 'success';
              console.log(result);
              this.save_project = result.project;
              
            })
          }
          else{
            this.save_project = response.project;
            this.status = 'success';
          }

        
        }
        else{
          this.status = 'failed';
        }
      },
      error =>{

      }


    );
  }
  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  

}
