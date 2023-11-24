import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {filter, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { ResourcesService } from 'src/app/services/resources.services';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLS } from 'src/app/config/urls.config';
import { ADVANCE_SEARCH_OPTIONS, TOTAL_PAGES } from 'src/app/config/global.config';
import { HttpService } from 'src/app/services/http.service';
import { HelperService } from 'src/app/services/helper.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { UserService } from 'src/app/services/user.service';

declare var $;
@Component({
	selector: 'app-resources',
	templateUrl: './resource.component.html',
	encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
        width: 15% !important;
        left: 35%;
    }
  `],
  providers: [NgbModalConfig, NgbModal]
})
export class ResourceManageComponent implements OnInit {
	form: FormGroup;
	mediaList=[];
	mediaObjects=[]; 
	artistList=[];
	artistObjects=[];
	categoriesList=[];
	categoriesObjects=[];
	ngOnInit()
	{
		this.fetchData();
		this.getTranslationAuthors();
		this.getTblAuthors();
		this.getTblMelodies();
		this.loadSingers();
		
	}
	dragAndDropExample = ['C#', 'Java'];

validateAction(action) {
		try{
		let flag = this._user.isUserValidateForThisAction(action);
	
		return flag;
		}
		catch(e)
		{
			return false;
		}
	}

	// public requestAutocompleteItems = (text: string): Observable<any> => {
    //     const url = `{{ httpservice.getAPI() }}api/v1/media/search-media-title?keyword=${text}`;
	// 	var result;
	// 	this.http
    //         .get<any>(url).subscribe((res)=>{
    //              result=res.media_data;

    //      			return result;
	// 		});
    //         //.pipe(map(items => items.map(item => item.full_name)));
	// }
    fetchData()
    {
            this.rs.get("featured-api/listing").subscribe((res) => {
			
			var media_result=res.result.media_result;
			  
			var cat_result=res.result.cat_result;
			  
			var author_result=res.result.author_result;
			  
            for(var i=0;i<media_result.length;i++)
            {
                if(media_result[i].featured!=0)
                {
                this.mediaObjects.push({id:media_result[i].id,value:media_result[i].title,display:media_result[i].title,sort:media_result[i].featured_display_order});   
                }
                this.mediaList.push({id:media_result[i].id,value:media_result[i].title,author:media_result[i].author});
                this.mediaList=this.mediaList.sort((a,b)=> {return a.value.localeCompare(b.value)})

            }
            for(var i=0;i<cat_result.length;i++)
            {
                if(cat_result[i].featured!=0)
                {
                this.categoriesObjects.push({id:cat_result[i].id,value:cat_result[i].title,display:cat_result[i].title,sort:cat_result[i].featured_display_order});   
                }
                this.categoriesList.push({id:cat_result[i].id,value:cat_result[i].title});
                
                this.categoriesList=this.categoriesList.sort((a,b)=> {return a.value.localeCompare(b.value)})
            }
            for(var i=0;i<author_result.length;i++)
            {
                if(author_result[i].featured!=0)
                {
                this.artistObjects.push({id:author_result[i].id,value:author_result[i].title,display:author_result[i].title,sort:author_result[i].featured_display_order});   
                }
                this.artistList.push({id:author_result[i].id,value:author_result[i].title});
                this.artistList=this.artistList.sort((a,b)=> {return a.value.localeCompare(b.value)})
            
            }
              
              this.mediaObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });

              this.categoriesObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });
              this.artistObjects.sort(function (a, b) {
                return a.sort - b.sort;
              });
		}, (error) =>{
			console.log( error);
		});

    }
    success=false;
    err=false;
    successmsg;
    hidemodal()
    {
        this.modalService.dismissAll();
    }
     
	save(content,x)
	{
        this.modalService.open(content, { centered: true,windowClass: 'dark-modal' });
		var data;
		if(x==1)
		{
			var featured_media_id=[];
			for(var i=0;i<this.mediaObjects.length;i++)
			{
					featured_media_id[i]={"media_id":this.mediaObjects[i].id.toString()};
			}
            //data={featured_media_id:featured_media_id};

            var data2=new URLSearchParams();
            data2.set("featured_media_id",JSON.stringify(featured_media_id));
            this.rs.post("featured-api/save-featured-media",data2).subscribe((res)=>{

                if(res['message']!=null)
                {
                    this.hidemodal();
                    this.successmsg=res['message'];
                    this.success=true;
                    this.err=false;
                }
                else{
                    this.err=true;
                    this.success=false;

                    this.hidemodal();
                }
            }, (error) =>{
                console.log(error);
                this.err=true;
                this.success=false;

                this.hidemodal();
            });
            
		}
		else if(x==2){
			var featured_author_id=[];
			for(var i=0;i<this.artistObjects.length;i++)
			{
				featured_author_id[i]={"author_id":this.artistObjects[i].id};
			}
            //data={"featured_author_id":featured_author_id};
            var data2=new URLSearchParams();
            data2.set("featured_author_id",JSON.stringify(featured_author_id));
            
            this.rs.post("featured-api/save-featured-author",data2).subscribe((res)=>{

                if(res['message']!=null)
                {
                      this.hidemodal();
                    this.successmsg=res['message'];
                    this.success=true;
                    this.err=false;
                }
                else{
                    this.err=true;
                    this.success=false;

                    this.hidemodal();
                }
            }, (error) =>{
                console.log(error);

                this.err=true;
                this.success=false;

                this.hidemodal();
            });;
		}
		else{

			var featured_category_id=[];
			for(var i=0;i<this.categoriesObjects.length;i++)
			{
				featured_category_id[i]={"cat_id":this.categoriesObjects[i].id};
			}
            //data={"featured_category_id":featured_category_id};
            var data2=new URLSearchParams();
            data2.set("featured_category_id",JSON.stringify(featured_category_id));
            
            this.rs.post("featured-api/save-featured-category",data2).subscribe((res)=>{

                if(res['message']!=null)
                {
                    this.hidemodal();
                    this.successmsg=res['message'];
                    this.success=true;
                    this.err=false;
                }
                else{
                    this.err=true;
                    this.success=false;

                    this.hidemodal();
                }
            }, (error) =>{
                console.log(error);

                this.err=true;
                this.success=false;

                this.hidemodal();
            });;
		} 
	}
    constructor(private _user: UserService, private httpservice: HttpService,private _helper: HelperService,private _http: HttpService,private rs:ResourcesService,config: NgbModalConfig, private modalService: NgbModal,  private loadingBar:LoadingBarService
		) {
        this.form = new FormBuilder().group({
            chips: [['chip'], []]
        });
        config.backdrop = 'static';
        config.keyboard = false;
    }

   



	featuredTracks: Array<any> = [];
	featuredArtists: Array<any> = [];
	featuredCategories: Array<any> = [];
	featuredCategoriesList = [];

	getFeaturedArtist() {
		let url = URLS.get_featured_authors; ///media-authors/featured

		this._http.get(url, {})
		.subscribe((res:any) => {
			let result = res.data;

			if (result.length == 0) {
				return;
			}

			this.featuredArtists = result;

		}, (error) =>{
			console.log(error);
		});
	}

	// getFeaturedCategories() {
	// 	let url = URLS.categories + "/featured";

	// 	this._http.get(url, {})
	// 	.subscribe((res) => {
	// 		let result = res.data;

	// 		if (result.length == 0) {
	// 			return;
	// 		}

	// 		this.featuredCategories = result;

	// 	}, (error) =>{
	// 		console.log(error);
	// 	});
	// }





	isLoadingMore: Boolean = false;
	searchKeword: string = "";
	selectedSearchOption: any = 3;
	searchOtions: Array<any> = ADVANCE_SEARCH_OPTIONS;

	// advanceSearchOptions = {
	// 	selectedLanguage: 'gurmukhi',
	// 	languages: [
	// 		{
	// 			code: 'gurmukhi',
	// 			name: 'Gurmukhi',
	// 			content: ['gurbani', 'teeka', 'audio']
	// 		},
	// 		{
	// 			code: 'roman',
	// 			name: 'Roman',
	// 			content: ['gurbani']
	// 		},
	// 		{
	// 			code: 'english',
	// 			name: 'English',
	// 			content: ['gurbani', 'english-translation', 'audio']
	// 		}
	// 	],
	// 	selectedContent: 'gurbani',
	// 	contents: [
	// 		{
	// 			code : 'gurbani',
	// 			name: 'Gurbani',
	// 			is_show: true
	// 		},
	// 		{
	// 			code : 'teeka',
	// 			name: 'Teeka',
	// 			is_show: true
	// 		},
	// 		{
	// 			code : 'english-translation',
	// 			name: 'English Translation',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'commentary',
	// 			name: 'Commentary',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'working-translation',
	// 			name: 'Working Translation',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'qna',
	// 			name: 'QNA',
	// 			is_show: false
	// 		},
	// 		{
	// 			code : 'audio',
	// 			name: 'Audio',
	// 			is_show: true
	// 		}
	// 	],
	// 	selectedTblAuthor: 0,
	// 	selectedTblMelody: 0,
	// 	selectedRaagiSinger: 0,
	// 	selectedAuthor: 0,
	// 	selectedAuthorCode: '',
	// 	pageFrom: 1,
	// 	pageTo: TOTAL_PAGES
	// }


	advanceSearchOptions = {
		languages: [
			{
				code: 'gurmukhi',
				name: 'Gurmukhi',
				content: ['gurbani', 'teeka', 'commentary','audio']
			},
			{
				code: 'roman',
				name: 'Roman',
				content: ['gurbani']
			},
			{
				code: 'english',
				name: 'English',
				content: ['gurbani', 'english-translation','commentary' ,'audio']
			}
		],
			selectedLanguage: 'english',
			selectedContent:'audio',
			selectedTblAuthor: 0,
			selectedTblMelody: 0,
			selectedRaagiSinger: 0,
			selectedAuthor: 0,
			selectedAuthorCode: '',
			pageFrom: 1,
			pageTo: TOTAL_PAGES
		}
	
	totalPages: number = TOTAL_PAGES;

	searchedResult = {
		data: [],
		pagination: {
			page: 1,
			limit: 25
		}
	};

	translationAuthors: Array<any> 	= [];
	tblAuthors: Array<any> 	= [];
	tblMelodies: Array<any> 	= [];
	singers: Array<any> 	= [];

	isEngKeyboardShow: boolean = false;
	isPunKeyboardShow: boolean = false ;

	loader=false;

	/**
	 * Intial state
	 */
	/**
	 * Search shabad data
	 *
	 * @param Boolean loadOnShowMore=false
	 */
	is_search=false;
	searchdata=[];
	datalength=[];

	metadata={};
	pageChanged(event) {
	//	this.searchedResult.pagination.page=event.page-1;
		this.searchData(true);
	}
	searchData(loadOnShowMore=false) {


		//this.loader=true;

		// this.rs.get("featured-api/listing?search="+this.searchKeword).subscribe((res) => {
		// 	this.search=res.result;
		// 	this.loader=false;
		// 	this.searchval=true;
		// }, (error) =>{
		//   console.log(error);
		//   this.loader=false;
		//   this.searchval=true;
		// });



		this.isLoadingMore = true;
		this.checkSearchKeywordLang();

		if (loadOnShowMore) {
			this.searchedResult.pagination.page++;
		}

		let url = "scripture/advance-search";//URLS.advance_search;
		let params = {
		    search_keyword	: this.searchKeword,
			search_option	: this.selectedSearchOption,
		    page 			: this.searchedResult.pagination.page,
			limit			: this.searchedResult.pagination.limit,
			res:"media"
		}

		this.setAdvanceSearchParams(params);

		this.loadingBar.start();
		this.rs.get2(url,params)
		.subscribe((res) => {

			this.is_search=true;
			var searchdata2=res["data"];
			let arr=[];
			Object.keys(searchdata2).map(function(key){
				arr.push(searchdata2[key]);
			});
			this.searchdata=arr;
			this.searchdata=this.searchdata.filter((x)=> x['data_m'].length>=1);
			this.datalength=[];
			for(var i=0;i<this.searchdata.length;i++)
			{
			   this.datalength.push(this.searchdata[i]['data_m'].length);	
			}
			
			// if (!loadOnShowMore) {
			// 	this.searchedResult.data = [];
			// }

			// if (res.data && res.data.length > 0) {

			// 	res.data.forEach((val) => {
			// 		if (res.included) {
			// 			res.included.forEach((rel) => {
			// 				if (rel.type == 'author') {
			// 					if (rel.id == val['attributes']['author_id']) {
			// 						val['author_data'] = rel.attributes;
			// 					}
			// 				}

			// 				if (rel.type == 'melody') {
			// 					if (rel.id == val['attributes']['melody_id']) {
			// 						val['melody_data'] = rel.attributes;
			// 					}
			// 				}
			// 			});
			// 		}

			// 	});

			// 	this.searchedResult.data = this.searchedResult.data.concat(res.data);
			//}

			//this.searchedResult.pagination['total'] = res["data"].length;
			this.metadata['total']=res['total'];
			this.metadata['per_page']=res['per_page'];
			this.isLoadingMore = false;

		this.loadingBar.complete();
		}, (err) => {
			console.log(err);
			this.isLoadingMore = false;
		});
	}


	add(item)
	{
		this.mediaObjects.push({value: item.auth_name
		,id: item.id
		,display: item.title});
	}
	/**
	 * Check the language of search keywork is gurmukhi or any other
	 */
	checkSearchKeywordLang() {
		if (this.advanceSearchOptions.selectedLanguage !== 'gurmukhi'
			|| this.advanceSearchOptions.selectedContent == 'audio') {
			return;
		}
		var englishRerExP = /^[A-Za-z0-9\s]*$/;

		this.advanceSearchOptions.selectedLanguage = 'gurmukhi';
		if (englishRerExP.test(this.searchKeword)) {
			this.advanceSearchOptions.selectedLanguage = 'english';
		}

		//this.setHideShowContentBasedOnLanguage();
	}

	/**
	 * Set parameters for advance searc request
	 *
	 * @param Object params
	 */
	setAdvanceSearchParams(params) {
		params['language']	=  this.advanceSearchOptions.selectedLanguage;
		params['content']	=  this.advanceSearchOptions.selectedContent;

		if (this.advanceSearchOptions.selectedTblAuthor > 0) {
			params['author'] =  this.advanceSearchOptions.selectedTblAuthor;
		}

		if (this.advanceSearchOptions.selectedAuthor > 0) {
			params['translation_author'] =  this.advanceSearchOptions.selectedAuthor;
		}

		if (this.advanceSearchOptions.selectedTblMelody > 0) {
			params['raag'] =  this.advanceSearchOptions.selectedTblMelody
		}

		if (this.advanceSearchOptions.selectedRaagiSinger > 0) {
			params['audio_author_id'] =  this.advanceSearchOptions.selectedRaagiSinger
		}

		params['pageF']		=  this.advanceSearchOptions.pageFrom,
		params['pageT']		=  this.advanceSearchOptions.pageTo
	}

	/**
	 * Get list of translations authors
	 */ 
	getTranslationAuthors(){
		let url = URLS.get_translation_authors;
		this._http.get(url)
		.subscribe((response:any) => {
			this.translationAuthors = response.data;

			this.translationAuthors.forEach((author) => {
				author['authorCode'] = this._helper.toSnakeCase(author.ReferredColumn);
			});
		}, (error) =>{
			console.log(error);
		});
	}

	/**
	 * Get TBL Authors table data list
	 */
	getTblAuthors() {
		let url = URLS.tbl_authors;
		let params = {
			sort : 'author',
    		direction : 'asc',
		}
		this._http.get(url, params)
		.subscribe((response) => {
			this.tblAuthors = response.data;
		}, (error) =>{
			console.log(error);
		});
	}

	/**
	 * Get melodies data
	 */
	getTblMelodies() {
		let url = URLS.tbl_melodies;
		let params = {
			sort : 'melody',
    		direction : 'asc',
		}
		this._http.get(url, params)
		.subscribe((response) => {
			this.tblMelodies = response.data;
		}, (error) =>{
			console.log(error);
		});
	}

	/**
	 * Method for get counting of 1 to particular number
	 *
	 * @param Interger i
	 */
	counter(i: number) {
	    return new Array(i);
	}

	/**
	 * On change search language
	 *
	 * @param String  lang
	 */
	onChangeLanguage(lang) {

		this.advanceSearchOptions['selectedLanguage'] = lang;

		if (this.advanceSearchOptions.selectedContent !== 'gurbani') {
			this.resetSearchedData();
		}

		this.advanceSearchOptions.selectedContent = 'gurbani';

		//this.setHideShowContentBasedOnLanguage();
	}

	/**
	 * Hide and Show content options based on language
	 */
	// setHideShowContentBasedOnLanguage() {
	// 	let selectedLangObj = this.getSelectedLanguageObj();

	// 	this.advanceSearchOptions.contents.forEach((content) => {
	// 		content.is_show = false;

	// 		if (selectedLangObj
	// 			&& selectedLangObj['content']
	// 			&& selectedLangObj['content'].indexOf(content.code) != -1) {
	// 			content.is_show = true;

	// 			//search optoins setting
	// 			// this.selectedSearchOption = 3;
	// 			this.searchOtions.forEach((so) => {
	// 				so.is_show = true;
	// 			});
	// 		}
	// 	});
	// }

	/**
	 * Get selected language object data
	 */
	getSelectedLanguageObj() {
		let selectedLangObj = {};
		this.advanceSearchOptions.languages.forEach((lang) => {
			if (lang.code == this.advanceSearchOptions.selectedLanguage) {
				selectedLangObj = lang;
			}
		});

		return selectedLangObj;
	}

	/**
	 * Get selected content object data
	 */
	// getSelectedContentObj() {
	// 	let selectedContentObj = {};

	// 	this.advanceSearchOptions.contents.forEach((content) => {
	// 		if (content.code == this.advanceSearchOptions.selectedContent) {
	// 			selectedContentObj = content;
	// 		}
	// 	});

	// 	return selectedContentObj;
	// }

	/**
	 * Perform actions on change of content or selection of content
	 *
	 * @param String content
	 */
	onChangeContent(content) {

		this.advanceSearchOptions.selectedContent = content;

		this.resetSearchedData();

		this.selectedSearchOption = 3;
		if (this.advanceSearchOptions['selectedContent'] == 'teeka') {
			this.setDefaultTranslationAuthorSelcted('ManmohanSinghPunjabi');
			this.selectedSearchOption = 1;
		}

		if (this.advanceSearchOptions['selectedContent'] == 'english-translation') {
			this.setDefaultTranslationAuthorSelcted('ManmohanSinghEnglish');
			this.selectedSearchOption = 1;
		}

		this.searchOtions.forEach((so) => {
			so.is_show = true;

			if ((this.advanceSearchOptions['selectedContent'] == 'teeka'
				|| this.advanceSearchOptions['selectedContent'] == 'english-translation')
				&& (so.code == 3 || so.code == 4)) {
					so.is_show = false;
			}
		});
	}

	/**
	 * Set selection of default author
	 *
	 * @param String authorCode
	 */
	setDefaultTranslationAuthorSelcted(authorCode) {
		if (this.translationAuthors.length == 0) {
			return
		}

		this.translationAuthors.forEach((author) => {
			if (author.ReferredColumn == authorCode) {
				this.advanceSearchOptions.selectedAuthor = author.id;
				this.advanceSearchOptions.selectedAuthorCode = author.authorCode;
			}
		})
	}

	/**
	 * set selected translation authour on change of translation author
	 */
	onChangeTranslationAuthor() {
		this.resetSearchedData();

		if (this.advanceSearchOptions['selectedAuthor'] == 0) {
			this.advanceSearchOptions.selectedAuthorCode = '';

			return;
		}

		this.translationAuthors.forEach((author) => {
			if (author.id == this.advanceSearchOptions['selectedAuthor']) {
				this.advanceSearchOptions.selectedAuthorCode = author.authorCode;
			}
		})
	}

	/**
	 * Reset searched data list
	 */
	resetSearchedData() {
		this.searchedResult = {
			data: [],
			pagination: {
				page: 1,
				limit: 25
			}
		};
	}

	/**
	 * Add words in search keyword if english keyboard key select
	 *
	 * @param String  word
	 */
	onEngKeyboardDataEnter(word) {
		this.searchKeword += word;
	}

	/**
	 * Add words in search keyword if punjabi keyboard key select
	 *
	 * @param String  word
	 */
	onPunKeyboardDataEnter(word) {
		this.searchKeword += word;
	}

	/**
	 * show and hide keyboards and show one at a time
	 *
	 * @param String  keyboardType
	 */
	showHideKeyboard(keyboardType) {

		if (keyboardType == 'eng') {
			this.isPunKeyboardShow = false;
			this.isEngKeyboardShow = !this.isEngKeyboardShow;
		} else {
			this.isEngKeyboardShow = false;
			this.isPunKeyboardShow = !this.isPunKeyboardShow;
		}


		//language select based on keyboard
		/*if (this.isEngKeyboardShow) {
			// this.searchKeword = "";
			this.advanceSearchOptions['selectedLanguage'] = 'english';
			this.setHideShowContentBasedOnLanguage();
			this.resetSearchedData();
		} else if (this.isPunKeyboardShow) {
			// this.searchKeword = "";
			this.advanceSearchOptions['selectedLanguage'] = 'gurmukhi';
			this.setHideShowContentBasedOnLanguage();
			this.resetSearchedData();
		}*/
	}

	/**
	 * make some changes on focus of search keyword input
	 */
	onFocusOfSearchInput() {
		this.hideBothKeyboards();
	}

	/**
	 * hide both keyboards
	 */
	hideBothKeyboards() {
		this.isEngKeyboardShow = false;
		this.isPunKeyboardShow = false;
	}

	/**
	 * Load raagi singers list
	 */
	loadSingers() {
		let url = URLS.get_authors;

		this._http.get(url)
		.subscribe((res:any) => {

			if (res.data.length == 0) {
				return;
			}

			let singers = res.data;
			this.singers = singers;
		}, (err) => {
			console.log(err);
		});
	}

	/**
	 * Clear search keyword from input
	 */
	clearSearchInput() {
		this.searchKeword = "";
	}

	/**
	 * reset all search and selection options data
	 */
	resetSearchAndOptions() {
		this.clearSearchInput();
		this.hideBothKeyboards();
		this.resetSearchedData();

		this.selectedSearchOption = 3; //set search option to first letter search

		// reset to defalut selected options
		this.advanceSearchOptions.selectedLanguage = 'gurmukhi';
		this.advanceSearchOptions.selectedContent = 'gurbani';
		this.advanceSearchOptions.selectedContent = 'gurbani';
		this.advanceSearchOptions.selectedTblAuthor = 0,
		this.advanceSearchOptions.selectedTblMelody = 0,
		this.advanceSearchOptions.selectedRaagiSinger = 0,
		this.advanceSearchOptions.selectedAuthor = 0,
		this.advanceSearchOptions.selectedAuthorCode = '',
		this.advanceSearchOptions.pageFrom = 1,
		this.advanceSearchOptions.pageTo = TOTAL_PAGES

	}







}
