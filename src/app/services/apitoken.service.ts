import { Injectable } from '@angular/core';
import { APIToken } from '../models/apitoken';

// origin:https://c0nrad.io => APIToken
// projectid:5e44454ca618302e571b54a1
// projects: [5e44454ca618302e571b54a1, 5e44454ca618302e571b54a1]


@Injectable({
  providedIn: 'root'
})
export class APITokenService {

  constructor() {
  }

  isKnownOrigin(origin: string): boolean {
    return localStorage.getItem(origin).length > 0
  }

  isKnownProjectID(projectID: string): boolean {
    return !localStorage.getItem(projectID) || localStorage.getItem(projectID).length > 0
  }

  saveToken(origin: string, token: APIToken) {
    localStorage.setItem(origin, JSON.stringify(token))
    localStorage.setItem(token.projectID, JSON.stringify(token))
    this.addToProjectsArray(token.projectID)
  }

  getTokenByOrigin(origin: string): APIToken {
    return JSON.parse(localStorage.getItem(origin))
  }

  getTokenByProjectID(projectID: string): APIToken {
    return JSON.parse(localStorage.getItem(projectID))
  }

  addToProjectsArray(projectID: string) {
    console.log("Add to Projects Array", projectID)
    if (!localStorage.getItem("projects") || localStorage.getItem("projects").length == 0) {
      localStorage.setItem("projects", JSON.stringify([projectID]))
    } else {
      let previous = JSON.parse(localStorage.getItem("projects"))
      previous.push(projectID)
      localStorage.setItem("projects", JSON.stringify(previous))
    }
  }

  getAllTokens(): APIToken[] {
    if (!localStorage.getItem("projects") || localStorage.getItem("projects").length == 0) {
      return []
    } else {
      let projects = JSON.parse(localStorage.getItem("projects")) as string[]
      let out = [] as APIToken[]
      for (var projectID of projects) {
        out.push(this.getTokenByProjectID(projectID))
      }
      return out
    }
  }
}
