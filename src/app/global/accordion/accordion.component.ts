import { Component, OnInit, Input } from '@angular/core';
import { SettingsComponent } from '../../dashboard/settings/settings.component';

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {
  @Input() header: string;
  @Input() is_open: boolean;
  @Input() id: string;

  constructor(public settings: SettingsComponent) { }

  ngOnInit(): void {
  }

  toggleContent() {
    this.is_open = !this.is_open;
  }

}
