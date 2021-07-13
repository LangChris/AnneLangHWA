import { AfterContentInit, Component, ContentChildren, QueryList} from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(public global: GlobalService) { }

  ngAfterContentInit(): void {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {

      let availableTabs = this.tabs.filter((tab)=> (this.global.GetSession().type == tab.role || tab.role == 'ANY'));
      this.selectTab(availableTabs[0]);
    }
  }

  selectTab(tab: TabComponent){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    
    // activate the tab the user has clicked on.
    tab.active = true;

    this.global.setActiveTab(tab.label);
  }

}
