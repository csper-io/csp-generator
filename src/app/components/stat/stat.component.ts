import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit { 
  @Input() value : string 
  @Input() title : string

  constructor() { }

  ngOnInit() {
  }

}
