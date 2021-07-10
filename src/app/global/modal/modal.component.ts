import { Component, Input, OnInit } from '@angular/core';
import { SettingsComponent } from '../../dashboard/settings/settings.component';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() header: string;
  @Input() is_open: boolean;
  @Input() id: string;
  
  constructor(public settings: SettingsComponent) { }

  ngOnInit(): void {
  }

  toggleContent() {
    this.is_open = !this.is_open;

    switch(this.id) {
      case "hyperlink-modal" : {
        this.settings.hyperlinkModalIsOpen = this.is_open; 

        let modal = document.getElementById(this.id);
        if(this.is_open) {
          modal.style.display = 'block'
        } else {
          modal.style.display = 'none'
        }
      } break;
    }
  }

}
