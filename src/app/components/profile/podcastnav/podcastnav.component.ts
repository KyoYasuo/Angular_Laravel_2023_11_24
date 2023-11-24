import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-podcastnav',
  templateUrl: './podcastnav.component.html',
  styleUrls: ['./podcastnav.component.scss']
})
export class PodcastnavComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }
enable=false;
  ngOnInit() {
    this.route.params.subscribe(params => {
      var id=params['id'];
      if(id!=undefined)
      {
       this.enable=true;
      }
    });
  }

}
