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
    if(this.is_open) {
      this.is_open = false;
    } else {
      this.is_open = true;
    }

    switch(this.id) {
      case "general-settings-accordion" : {
        this.settings.generalSettingsIsOpen = this.is_open; 
        this.settings.userSettingsIsOpen = false;
        this.settings.userManagementIsOpen = false;
      } break;
      case "user-settings-accordion" : { 
        this.settings.userSettingsIsOpen = this.is_open; 
        this.settings.generalSettingsIsOpen = false;
        this.settings.userManagementIsOpen = false;
      } break;
      case "user-management-accordion" : { 
        this.settings.userManagementIsOpen = this.is_open; 
        this.settings.generalSettingsIsOpen = false;
        this.settings.userSettingsIsOpen = false;
      } break;
    }
  }

}
