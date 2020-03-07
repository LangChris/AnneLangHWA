import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalService } from '../app/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(private titleService: Title, private global: GlobalService ) { }

  ngOnInit() {
    this.global.updateGeneralSettings();
    setTimeout(()=>{
      this.titleService.setTitle(this.global.getGeneralSettings.webpageTitle);
    },200);
  }
}
