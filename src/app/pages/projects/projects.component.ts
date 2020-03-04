import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { APITokenService } from 'src/app/services/apitoken.service';
import { APIToken } from 'src/app/models/apitoken';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  tokens: APIToken[]

  constructor(private projectService: ProjectService, private tokenService: APITokenService) { }

  ngOnInit() {
    this.tokens = this.tokenService.getAllTokens()
  }
}
