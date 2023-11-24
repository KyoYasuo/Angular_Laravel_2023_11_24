import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class HelperService {

	constructor() { }

	isYoutubeUrl(url) {
		let urlReg = '^(http(s)?:\/\/)?((w){3}.)?(youtu(be|.be))?(\.com)?\/.+';

		return (url.match(urlReg));
	}

	isVimeoUrl(url) {
		let urlReg = '^(http(s)?:\/\/)?((w){3}.)?(vimeo)?(\.com)?\/.+';

		return (url.match(urlReg));
	}

	getYoutubeEmbedUrl(url) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	    var match = url.match(regExp);
	    let videoId =  (match&&match[7].length==11)? match[7] : null;

	    if (videoId) {
	    	return "https://www.youtube.com/embed/" + videoId;
	    } else {
	    	return url;
	    }
	}

	toSnakeCase(string: string) {
	    return string.replace(/\.?([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
	}
}
