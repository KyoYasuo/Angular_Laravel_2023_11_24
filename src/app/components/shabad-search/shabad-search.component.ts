import { Component, OnInit, Input } from '@angular/core';

import { HttpService } from './../../services/http.service';
import { HelperService } from './../../services/helper.service';

import { URLS } from './../../config/urls.config';
import { TOTAL_PAGES, ADVANCE_SEARCH_OPTIONS } from './../../config/global.config';
import { Router } from '@angular/router';
declare var $;

@Component({
	selector: 'app-shabad-search',
	templateUrl: './shabad-search.component.html',
	styleUrls: ['./shabad-search.component.scss']
})
export class ShabadSearchComponent implements OnInit {

	pageChanged(event) {
		if(event.page==this.searchedResult.pagination.page){
			return;
		}
		this.searchedResult.pagination.page=event.page-1;
		this.searchData(true);
	}
	isLoadingMore: Boolean = false;
	searchKeword: string = "";
	selectedSearchOption: any = 3;
	currentPage = 1;
	enter: boolean = false;
	searchOtions: Array<any> = ADVANCE_SEARCH_OPTIONS;


	@Input('init')
	count: String = "#fff";
	
	advanceSearchOptions = {
		selectedLanguage: 'gurmukhi',
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
		selectedContent: 'gurbani',
		contents: [
			{
				code : 'gurbani',
				name: 'Gurbani',
				is_show: true
			},
			{
				code : 'teeka',
				name: 'Teeka',
				is_show: true
			},
			{
				code : 'english-translation',
				name: 'English Translation',
				is_show: false
			},
			{
				code : 'commentary',
				name: 'Commentary',
				is_show: true
			},
			{
				code : 'working-translation',
				name: 'Working Translation',
				is_show: false
			},
			{
				code : 'qna',
				name: 'QNA',
				is_show: false
			}/*,
			{
				code : 'audio',
				name: 'Audio',
				is_show: true
			}*/
		],
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

	constructor(private _http: HttpService,
				private _helper: HelperService,
				private router:Router) { }



				loading=false;
	/**
	 * Intial state
	 */
	hide:Boolean;
	ngOnInit() {
		document.getElementById("main2").scrollTo(0,0);
		this.hide=false;
		let getTranslationAuthors = sessionStorage.getItem('translationAuthors');
		let getTblAuthors = sessionStorage.getItem('tblAuthors');
		let getTblMelodies = sessionStorage.getItem('tblMelodies');
		let loadSingers = sessionStorage.getItem('singers');
		if(getTranslationAuthors) {
			this.translationAuthors = JSON.parse(getTranslationAuthors);
		}
		else {
			this.getTranslationAuthors();
		}
		if(getTblAuthors) {
			this.tblAuthors = JSON.parse(getTblAuthors);
		}
		else {
			this.getTblAuthors();
		}
		if(getTblMelodies) {
			this.tblMelodies = JSON.parse(getTblMelodies);
		}
		else {
			this.getTblMelodies();
		}
		if(loadSingers) {
			this.singers = JSON.parse(loadSingers);
		}
		else {
			this.loadSingers();
		}
		
		var self = this;
		$("body").on('keydown', function(e){
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if('' + keycode == '13'){
				self.f('all');
			}
		})
	}

	scrolll(){
		setTimeout(() => {	
			let screenwidth = $("body").width();
			if(screenwidth < 500 || true) {
				let q = $("#tableResult");
				let offset = $(q).offset().top;
				let mainScrollTop = $("#main2").scrollTop();
				$("#main2").animate(
					{
						scrollTop: mainScrollTop + offset - 80
					},
					800 //speed
				);
			}
		}, 1000);
	}
	first=true;
	/**
	 * Search shabad data
	 *
	 * @param Boolean loadOnShowMore=false
	 */
	searchData(loadOnShowMore=false) {
		this.searchKeword = this.searchKeword.trim();
// this.hide=true;
		if(this.searchKeword == "") return;
		this.isLoadingMore = true;
		
		this.checkSearchKeywordLang();

		if (loadOnShowMore) {
			this.searchedResult.pagination.page++;
		}

		let url = URLS.advance_search;
		// if($(".navbar-toggler").is(":visible"))
		// {
		// }
		// else{
		//         this.ro	
		// }
		let params = {
		    search_keyword	: this.searchKeword,
			search_option	: this.selectedSearchOption,
		    page 			: this.searchedResult.pagination.page,
		    limit			: this.searchedResult.pagination.limit,
		}


        
		
		this.setAdvanceSearchParams(params);


		if(this.first){
			this.first=false;
				if($(".navbar-toggler").is(":visible"))
				{

				}
				else{
				
					window.localStorage.setItem("params",JSON.stringify(params));
					$(".collapse").toggle();
					return this.router.navigate(['searchresult']);		
				}
	    }

		this._http.get(url, params)
		.subscribe((res) => {
	
			this.scrolll();
	
			this.loading=true;
			if (!loadOnShowMore) {
				this.searchedResult.data = [];
			}

			if (res.data && res.data.length > 0) {

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

				this.searchedResult.data = res.data;//this.searchedResult.data.concat(res.data);
				this.metadata=res.meta.pagination;
			}

			this.searchedResult.pagination['total'] = res.meta.pagination.total;
			this.isLoadingMore = false;
			this.startfrom=(parseInt(this.metadata['current_page'])-1)*parseInt(this.metadata['per_page'])+1;

			if(this.searchedResult.pagination['total'] <= 25)
			{
				setTimeout(() => {
					$(".pagination-last").hide();
					$(".pagination-first").hide();	
				}, 10);
			}
			}, (err) => {
				console.log(err);
				this.isLoadingMore = false;
			});
	}
	startfrom;
	metadata={};
	/**
	 * Check the language of search keywork is gurmukhi or any other
	 */
	checkSearchKeywordLang() {
		/*if (this.advanceSearchOptions.selectedLanguage !== 'gurmukhi'
			|| this.advanceSearchOptions.selectedContent == 'audio') {
			return;
		}*/
		var englishRerExP = /^[A-Za-z0-9\s]*$/;

		this.advanceSearchOptions.selectedLanguage = 'gurmukhi';
		if (englishRerExP.test(this.searchKeword)) {
			this.advanceSearchOptions.selectedLanguage = 'english';
		}

		this.setHideShowContentBasedOnLanguage();
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
		.subscribe((response) => {
			this.translationAuthors = response.data;

			this.translationAuthors.forEach((author) => {
				author['authorCode'] = this._helper.toSnakeCase(author.ReferredColumn);
			});
			sessionStorage.setItem('translationAuthors', JSON.stringify(this.translationAuthors));
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
			this.tblAuthors.sort((a,b) => a['attributes']['author'].localeCompare(b['attributes']['author']));
			sessionStorage.setItem('tblAuthors', JSON.stringify(this.tblAuthors));
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
			this.tblMelodies.sort((a,b) => a['attributes']['melody'].localeCompare(b['attributes']['melody']));
			sessionStorage.setItem('tblMelodies', JSON.stringify(this.tblMelodies));
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

		this.setHideShowContentBasedOnLanguage();
	}

	/**
	 * Hide and Show content options based on language
	 */
	setHideShowContentBasedOnLanguage() {
		let selectedLangObj = this.getSelectedLanguageObj();

		this.advanceSearchOptions.contents.forEach((content) => {
			content.is_show = false;

			if (selectedLangObj
				&& selectedLangObj['content']
				&& selectedLangObj['content'].indexOf(content.code) != -1) {
				content.is_show = true;

				//search optoins setting
				// this.selectedSearchOption = 3;
				this.searchOtions.forEach((so) => {
					so.is_show = true;
				});
			}
		});
	}

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
	getSelectedContentObj() {
		let selectedContentObj = {};

		this.advanceSearchOptions.contents.forEach((content) => {
			if (content.code == this.advanceSearchOptions.selectedContent) {
				selectedContentObj = content;
			}
		});

		return selectedContentObj;
	}

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
		if (this.advanceSearchOptions['selectedContent'] == 'commentary') {
			this.selectedSearchOption = 1;
		}

		this.searchOtions.forEach((so) => {
			so.is_show = true;

			if ((this.advanceSearchOptions['selectedContent'] == 'teeka'
				|| this.advanceSearchOptions['selectedContent'] == 'english-translation'
				|| this.advanceSearchOptions['selectedContent'] == 'commentary')
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
		this.currentPage = 1;
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
	
	f(str){

		if(this.isPunKeyboardShow || this.isEngKeyboardShow){ this.searchData(); }
		this.showHideKeyboard(str);
	}

	get(val)
{
	var arr = val.split(/></g);
	for(var i = 0; i < arr.length; i++){
		if(i!=0){
		 arr[i] = '<' + arr[i] + '>';
		}
		if(arr[i].includes(this.searchKeword))
		{
			return arr[i];
			break;
		}
	}

	
   //return val.split("<br>")[0];
}

	onKeydownEvent(event: KeyboardEvent): void {
		if (event.keyCode === 13 || event.which === 13 || event.key == 'Enter') {
			this.enter = true;
			this.resetSearchedData();
		  this.searchData();
		  let elem = document.activeElement as any;
		  elem.blur();
		  let input = document.getElementsByTagName('input') as any
		  input[0].blur();
		}
	  }
	search(){
	  if(this.searchKeword && !this.enter){
		  this.resetSearchedData();
		this.searchData();
	  }
	  this.enter = false;
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
		} else  if (keyboardType == 'pun') {
			this.isEngKeyboardShow = false;
			this.isPunKeyboardShow = !this.isPunKeyboardShow;
		}
		else if (keyboardType == 'all')  {
			this.isEngKeyboardShow = false;
			this.isPunKeyboardShow = false;
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
		.subscribe((res) => {

			if (res.data.length == 0) {
				return;
			}

			let singers = res.data;
			this.singers = singers;
			sessionStorage.setItem('singers', JSON.stringify(this.singers));
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