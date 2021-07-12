import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() label: string;
  @Input() active: boolean;
  @Input() class: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
