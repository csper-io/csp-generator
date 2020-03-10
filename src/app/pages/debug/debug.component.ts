import { Component, OnInit } from '@angular/core';
import { ExtensionService } from 'src/app/services/extension.service';
import { APIToken } from 'src/app/models/apitoken';
import { BuilderState } from 'src/app/models/builderstate';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  domain: string
  tokens: BuilderState[]

  constructor(private extensionService: ExtensionService) { }

  ngOnInit() {
    this.extensionService.getCurrentDomain().subscribe((domain) => {
      this.domain = domain
    })

    this.extensionService.getAllStates().subscribe((tokens) => {
      this.tokens = tokens
    })
  }

  deleteAll() {
    chrome.storage.sync.clear()
  }
}
