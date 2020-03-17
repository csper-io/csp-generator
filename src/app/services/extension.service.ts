import { Injectable, NgZone } from '@angular/core';
import { Observable, bindCallback, of, forkJoin, noop, throwError } from 'rxjs';
import { flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { BuilderState } from '../models/builderstate';

// storage
// on domain 
// create new project 

// make a web request (see domain), inject headers 

// domain => APIToken
// projectid => APIToken

@Injectable({
  providedIn: 'root'
})
export class ExtensionService {

  constructor(public zone: NgZone
  ) { }

  getCurrentDomain(): Observable<string> {
    if (chrome && chrome.tabs) {

      return Observable.create(observer => {
        const domainCallback = (tabs: chrome.tabs.Tab[]) => {
          let tab = tabs[0]
          this.zone.run(() => {
            var matches = tab.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var domain = matches && matches[1];
            observer.next(domain)
            observer.complete()
          })
        }

        chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        }, domainCallback)
      })
    } else {
      return of(window.location.hostname)
    }
  }

  refreshPage() {
    if (chrome && chrome.tabs) {
      chrome.tabs.reload()
    }
  }

  getItem(key: string): Observable<string> {
    console.log("extension.service.ts:getItem", key)

    if (key === undefined) {
      debugger
    }

    if (!chrome || !chrome.storage) {
      return of(localStorage.getItem(key))
    }

    return Observable.create(observer => {
      const getItemCallback = (result) => {

        this.zone.run(() => {
          observer.next(result[key]);
          observer.complete();
        })
      };

      chrome.storage.sync.get([key], getItemCallback)
    });

  }

  setItem(key, value: string): Observable<any> {
    console.log("extension.service.ts:setItem", key, value)

    if (!chrome || !chrome.storage) {
      return of(localStorage.setItem(key, value))
    }

    let item = {}
    item[key] = value

    return Observable.create(observer => {
      const setItemCallback = () => {
        this.zone.run(() => {
          observer.next({});
          observer.complete();
        })
      };

      chrome.storage.sync.set(item, setItemCallback)
    });

  }

  isKnownDomain(domain: string): Observable<boolean> {
    return this.getItem(domain).pipe(
      map((result) => result.length > 0),
    )
  }

  isKnownProjectID(projectID: string): Observable<boolean> {
    return this.getItem(projectID).pipe(
      map((r) => !!r || r.length > 0),
    )
  }

  saveState(domain: string, token: BuilderState): Observable<any> {
    return forkJoin(this.setItem(domain, JSON.stringify(token)),
      this.setItem(token.projectID, JSON.stringify(token)),
      this.addToProjectsArray(token.projectID))

    // console.log("about to save token")

    // debugger
    // return this.setItem(domain, JSON.stringify(token)).pipe(
    //   tap((a) => {
    //     console.log("HERE", a)
    //   }),
    //   flatMap(() => {
    //     console.log("HERE2")
    //     return this.setItem(token.projectID, JSON.stringify(token))
    //   }),
    //   flatMap(() => {
    //     console.log("here3")
    //     return this.addToProjectsArray(token.projectID)
    //   })
    // )
  }

  getStateByDomain(domain: string): Observable<BuilderState> {
    return this.getItem(domain).pipe(
      map((i) => {
        if (!i) {
          throw throwError("no token for domain: " + domain);
        }
        return JSON.parse(i) as BuilderState
      })
    )
  }

  getStateByProjectID(projectID: string): Observable<BuilderState> {
    return this.getItem(projectID).pipe(
      map((i) => {
        if (!i) {
          throw throwError("no token for projectID: " + projectID);
        }
        return JSON.parse(i) as BuilderState

        return JSON.parse(i)
      })
    )
  }

  addToProjectsArray(projectID: string): Observable<any> {
    return this.getItem("projects").pipe(
      map((p) => {
        if (!p || p.length == 0) {
          return this.setItem("projects", JSON.stringify([projectID]))
        }

        let previous = JSON.parse(p)
        previous.push(projectID)
        return this.setItem("projects", JSON.stringify(previous))
      })
    )
  }

  deleteState(state: BuilderState): Observable<any> {
    return forkJoin(this.setItem(state.projectID, null), this.setItem(state.domain, null))
  }

  getAllStates(): Observable<BuilderState[]> {
    return this.getItem("projects").pipe(
      map((p) => {
        if (!p || p.length == 0) {
          return []
        }
        return JSON.parse(p) as string[]
      }),
      flatMap((projects) => {
        return forkJoin(
          projects.map((projectID: string) => this.getStateByProjectID(projectID))
        )
      })
    )
    // if (!localStorage.getItem("projects") || localStorage.getItem("projects").length == 0) {
    //   return []
    // } else {
    //   let projects = JSON.parse(localStorage.getItem("projects")) as string[]
    //   let out = [] as APIToken[]
    //   for (var projectID of projects) {
    //     out.push(this.getTokenByProjectID(projectID))
    //   }
    //   return out
    // }
  }
}