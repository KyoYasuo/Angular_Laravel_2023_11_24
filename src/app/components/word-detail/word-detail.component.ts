import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params} from "@angular/router";

import { HttpService } from './../../services/http.service';
import { URLS } from './../../config/urls.config';

@Component({
	selector: 'app-word-detail',
	templateUrl: './word-detail.component.html',
	styleUrls: ['./word-detail.component.scss']
})
export class WordDetailComponent implements OnInit {

	words: Array<any> = [];
	wordDetail: Object = {};
	isWordDetailApiRunning: Boolean = false;
	searchedWord: string = "";
	currentTimeout: any = null;
	selectedLang: string = "gurmukhi";

	constructor(private _http: HttpService, private _activeRoute: ActivatedRoute, private router: Router) {
		
		this._activeRoute.queryParams.subscribe(params => {
			if (Object.keys(params).length == 0) {
				this.words = [];
				this.wordDetail = {};
				this.searchedWord = "";
				this.selectedLang = "gurmukhi";
				return;
			};

			if (params['lang']) { this.selectedLang = params['lang']; }
			if (params['value']) { this.searchedWord = params['value'];	}
			this.getWordDetail(this.searchedWord);
	    });  
	}

	ngOnInit() {
		document.getElementById("main2").scrollTo(0,0);
	}

	replaceQueryString(url, param, value) {
		var re = new RegExp("([?|&])" + param + "=.*?(&|$)", "i");
		if (url.match(re))
			return url.replace(re, '$1' + param + "=" + value + '$2');
		else
			return url + '?' + param + "=" + value;
	}

	selectDictionaryLang(lang) {
		this.selectedLang = lang;

		//reset data
		this.searchedWord = "";
		this.words = [];
		window.history.replaceState({}, "lang", this.replaceQueryString(location.href, "lang", this.selectedLang));
		window.history.replaceState({}, "value", this.replaceQueryString(location.href, "value", this.searchedWord));
	}

	getWords() {
		if (!this.searchedWord) {
			return;
		}

		this.cancelTimeout();
		this.currentTimeout = setTimeout(() => {
			this.getSearchedWords();
		}, 1000);
	}

	getSearchedWords() {
		let url = URLS.get_words;

		url += '?lang=' + this.selectedLang;
		url += '&value=' + this.searchedWord;

		this._http.get(url)
		.subscribe((res) => {
			this.words = res.data;
		}, (error) =>{
			console.log(error);
		});
	}

	clearWordsList() {
		if (this.searchedWord) {
			return false;
		}

		this.words = [];
	}

	getWordDetail(selectedWord) {
		this.isWordDetailApiRunning = true;

		let url = URLS.get_word_detail;
		url += '?lang=' + this.selectedLang;
		url += '&value=' + selectedWord;

		this.searchedWord = selectedWord;
		this.words = []; //reset searched words

		window.history.replaceState({}, "lang", this.replaceQueryString(location.href, "lang", this.selectedLang));
		window.history.replaceState({}, "value", this.replaceQueryString(location.href, "value", this.searchedWord));

		this._http.get(url).subscribe((res) => {
			if (!res.data) {
				this.wordDetail = {};
				this.isWordDetailApiRunning = false;
			}
			this.wordDetail = res.data;

		    let queryParams: Params = {
		    	lang: this.selectedLang,
		    	value: this.searchedWord
		    };
			if(this.wordDetail) {
				this.scrolll();
			}

		    /* this.router.navigate(['.'], {
				relativeTo: this._activeRoute,
				queryParams: queryParams,
				queryParamsHandling: "merge", // remove to replace all query params by provided
			}); */

			this.isWordDetailApiRunning = false;
		}, (error) =>{
			console.log(error);
			this.isWordDetailApiRunning = false;
		});
	}

	scrolll(){
		setTimeout(() => {	
			let screenwidth = $("body").width();
			if(screenwidth < 500 || true) {
				let q = $("#dr-result");
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

	cancelTimeout() {
		clearTimeout(this.currentTimeout);
		this.currentTimeout = null;
	}

	enterKeyword(val) {
		this.searchedWord += val;
		this.getSearchedWords();
	}

}
