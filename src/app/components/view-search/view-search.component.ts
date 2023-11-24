import { Component, OnInit } from '@angular/core';

import { URLS } from './../../config/urls.config';
import { AUDIO_TAG_IDS, VEDIO_CATEGORY_IDS, ADVANCE_SEARCH_OPTIONS, TOTAL_PAGES } from './../../config/global.config';

import { HttpService } from './../../services/http.service';
import { HelperService } from 'src/app/services/helper.service';


declare var $;

@Component({
  selector: 'app-view-search',
  templateUrl: './view-search.component.html',
  styleUrls: ['../searchresult/searchresult.component.scss']
})
export class ViewSearchComponent implements OnInit {
  loading = true;
  numPages = 1;
  isLoadingMore: Boolean = true;

  totalPages: number = TOTAL_PAGES;

  searchedResult = {
    data: [],
    pagination: {
      page: 1,
      limit: 25
    }
  };
  paramData: any =[];
  metadata = {}; start = 50;  startfrom;

  constructor(private _http: HttpService, private _helper: HelperService) { }

  ngOnInit() {
    //this.viewSearchData();
    this.getPosts();
  }

  getPosts() {
    return new Promise<any>((resolve, reject) => {
      let apiUrl = URLS.advance_search;
      this._http.get(apiUrl + '?search_keyword=' + localStorage.getItem('search_keyword') +'&search_option=1&page=1&limit=25&language=gurmukhi&content=gurbani&pageF=1&pageT=1430').subscribe((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    }).then(data => {
      if (data) { return data; }
    });
  }

  viewSearchData(){

    let url = URLS.advance_search;
    this.paramData = localStorage.getItem('params');
    this.loading = true;

    let paramData = '{search_keyword:' + this.paramData.search_keyword + ', search_option: 1, page: 1, limit: 25, language: gurmukhi, content: gurbani, pageF: 1, pageT: 1430 }';
    this._http.get(url, paramData).subscribe((res) => {
      this.loading = false;
     
      /* if (res.data && res.data.length > 0) {
        res.data.forEach((val) => {
          if (res.included) {
            res.included.forEach((rel) => {
              if (rel.type == 'author') {
                if (rel.id == val['attributes']['author_id']) {
                  val['author_data'] = rel.attributes;
                }
              }

              if (rel.type == 'melody') {
                if (rel.id == val['attributes']['melody_id']) {
                  val['melody_data'] = rel.attributes;
                }
              }
            });
          }
        });
        this.searchedResult.data = res.data; //this.searchedResult.data.concat(res.data);
        
        this.metadata = res.meta.pagination;
      }

      this.searchedResult.pagination['total'] = res.meta.pagination.total;

      this.isLoadingMore = false;
      this.startfrom = (parseInt(this.metadata['current_page']) - 1) * parseInt(this.metadata['per_page']) + 1;
      this.numPages = this.metadata['total_pages'];
      if (this.searchedResult.pagination['total'] <= 25) {
        setTimeout(() => {
          $(".pagination-last").hide();
          $(".pagination-first").hide();
        }, 10);
      }
      setTimeout(() => {
        $('#resstr').attr('style', 'margin-left: ' + $('#p1').width() + 'px !important');
      }, 10); */

    }, (err) => {
      console.log(err);
      this.isLoadingMore = false;
    });

  }

}
