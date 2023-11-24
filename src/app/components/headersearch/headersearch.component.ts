import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

import { URLS } from './../../config/urls.config';
import { MEDIA_TYPE } from './../../config/media.config';
import { AUDIO_TAG_IDS, VEDIO_CATEGORY_IDS, ADVANCE_SEARCH_OPTIONS, TOTAL_PAGES } from './../../config/global.config';
declare var DeviceUUID;

import { HttpService } from './../../services/http.service';
// import { YtPlayerService,PlayerOptions } from 'yt-player-angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResourcesService } from 'src/app/services/resources.services';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
declare var $;

@Component({
  selector: 'app-headersearch',
  templateUrl: './headersearch.component.html',
  styleUrls: ['./headersearch.component.scss']
})
export class HeadersearchComponent implements OnInit {


	@Input() lgshow: boolean=true;

	isLoadingMore: Boolean = false;
	searchKeword: string = "";
	selectedSearchOption: any = 3;
	searchOtions: Array<any> = ADVANCE_SEARCH_OPTIONS;

	advanceSearchOptions = {
		selectedLanguage: 'gurmukhi',
		languages: [
			{
				code: 'gurmukhi',
				name: 'Gurmukhi',
				content: ['gurbani', 'teeka', 'audio']
			},
			{
				code: 'roman',
				name: 'Roman',
				content: ['gurbani']
			},
			{
				code: 'english',
				name: 'English',
				content: ['gurbani', 'english-translation', 'audio']
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
				is_show: false
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
			},
			{
				code : 'audio',
				name: 'Audio',
				is_show: true
			}
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
				private _helper: HelperService,private router:Router) { }

	/**
	 * Intial state
	 */
	ngOnInit() {
		//this.getTranslationAuthors();
		//this.getTblAuthors();
		//this.getTblMelodies();
		//this.loadSingers();
	}

	/**
	 * Search shabad data
	 *
	 * @param Boolean loadOnShowMore=false
	 */
	searchData(loadOnShowMore=false) {


		this.router.navigate(['/search',this.searchKeword,this.selectedSearchOption])
		// this.isLoadingMore = true;
		// this.checkSearchKeywordLang();

		// if (loadOnShowMore) {
		// 	this.searchedResult.pagination.page++;
		// }

		// let url = URLS.advance_search;
		// let params = {
		//     search_keyword	: this.searchKeword,
		// 	search_option	: this.selectedSearchOption,
		//     page 			: this.searchedResult.pagination.page,
		//     limit			: this.searchedResult.pagination.limit,

		// }

		// this.setAdvanceSearchParams(params);

		// this._http.get(url, params)
		// .subscribe((res) => {

		// 	if (!loadOnShowMore) {
		// 		this.searchedResult.data = [];
		// 	}

		// 	if (res.data && res.data.length > 0) {

		// 		res.data.forEach((val) => {
		// 			if (res.included) {
		// 				res.included.forEach((rel) => {
		// 					if (rel.type == 'author') {
		// 						if (rel.id == val['attributes']['author_id']) {
		// 							val['author_data'] = rel.attributes;
		// 						}
		// 					}

		// 					if (rel.type == 'melody') {
		// 						if (rel.id == val['attributes']['melody_id']) {
		// 							val['melody_data'] = rel.attributes;
		// 						}
		// 					}
		// 				});
		// 			}

		// 		});

		// 		this.searchedResult.data = this.searchedResult.data.concat(res.data);
		// 	}

		// 	this.searchedResult.pagination['total'] = res.meta.pagination.total;
		// 	this.isLoadingMore = false;
		// }, (err) => {
		// 	console.log(err);
		// 	this.isLoadingMore = false;
		// });
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
		.subscribe((res) => {

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
