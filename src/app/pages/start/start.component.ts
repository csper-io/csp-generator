import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { APIToken } from 'src/app/models/apitoken';
import { APITokenService } from 'src/app/services/apitoken.service';
import { Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import { Policy } from 'src/app/models/policy';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  token: APIToken
  origin: string

  constructor(private projectService: ProjectService,
    private tokenService: APITokenService,
    private router: Router,
    private policyService: PolicyService) {
  }

  ngOnInit() {
  }

  newProject() {
    this.projectService.newTempProject(origin).subscribe((token) => {
      this.tokenService.saveToken(origin, token)
      this.token = token

      this.projectService.getProject(this.token.projectID).subscribe((p) => {
        let endpointURL = ""
        if (!environment.production) {
          endpointURL = "http://localhost:8080/endpoint/" + this.token.projectID
        } else {
          endpointURL = `https://${this.token.projectID}.endpoint.${environment.origin.replace("https://", "")}`
        }
        let starterPolicy = "default-src 'self'; script-src 'self' 'report-sample'; style-src 'self' 'report-sample'; base-uri 'self'; object-src 'none'; report-uri " + endpointURL

        let policy: Policy = {
          policy: starterPolicy, makePrimary: true, projectID: this.token.projectID
        } as Policy

        this.policyService.savePolicy(policy).subscribe((p) => {
          this.router.navigate(["/collect", this.token.projectID])
        })
      })
    })
  }
}
