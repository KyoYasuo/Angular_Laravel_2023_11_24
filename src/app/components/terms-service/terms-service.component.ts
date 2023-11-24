import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-service',
  templateUrl: './terms-service.component.html',
  styleUrls: ['./terms-service.component.scss']
})
export class TermsServiceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementById("main2").scrollTo(0,0);
  }

}
