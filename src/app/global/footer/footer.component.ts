import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  showPortal: boolean;
  year: number = new Date().getFullYear();

  constructor(private router: Router, public global: GlobalService) { }

  ngOnInit() {
      this.showPortal = this.global.getShowPortal;
  }

  navigateToAdmin() {
    this.router.navigate(['/admin-portal'])
  }

}
