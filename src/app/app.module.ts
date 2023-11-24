import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injectable, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';

import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import {
  TabsModule,
  PaginationModule,
  BsDropdownModule,
  PopoverModule,
  AlertModule,
  ModalModule,
  ProgressbarModule,
  TypeaheadModule, 
  CollapseModule} from 'ngx-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider} from "angularx-social-login";
import { QuillModule } from 'ngx-quill';
import { NgSelect2Module } from 'ng-select2';

import { AppRoutingModule } from './app-routing.module';

import { HttpService } from './services/http.service';
import { PlayerService } from './services/player.service';
import { AlertService } from './services/alert.service';

import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TruncatePipe1 } from './pipes/truncate1.pipe';
import { DatefilterPipe } from './pipes/datefilter.pipe';
import { TitlereplacePipe } from './pipes/titlereplace.pipe';
import { SortByPipe } from './pipes/sortby.pipe';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { ShabadComponent } from './components/shabad/shabad.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { PlayerComponent } from './components/audio-player/player/player.component';
import { WordDetailComponent } from './components/word-detail/word-detail.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoginComponent } from './components/login/login.component';
import { SiteLayoutComponent } from './components/layouts/site-layout/site-layout.component';
import { MyAccountComponent } from './components/profile/my-account/my-account.component';
import { RegisterComponent } from './components/register/register.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { UserPermissionComponent } from './components/profile/user-permission/user-permission.component';
import { PostApprovalComponent } from './components/profile/post-approval/post-approval.component';

import { environment} from './../environments/environment';
import { MyAccountLayoutComponent } from './components/layouts/my-account-layout/my-account-layout.component';
import { UsersListComponent } from './components/profile/users-list/users-list.component';
import { BlogCommentsComponent } from './components/profile/blog-comments/blog-comments.component';
import { AuthorsComponent } from './components/profile/authors/authors.component';
//import { ResourceManageComponent } from './components/profile/resource/resource.component';
import { UserPostPermissionsComponent } from './components/profile/user-post-permissions/user-post-permissions.component';
import { EditUserComponent } from './components/profile/users-list/edit-user/edit-user.component';
import { AddBlogComponent } from './components/blog/add-blog/add-blog.component';
import { AddVideoModalComponent } from './components/video/add-video-modal/add-video-modal.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { AddAudioComponent } from './components/audio/add-audio/add-audio.component';
import { ShabadSearchComponent } from './components/shabad-search/shabad-search.component';
import { ResourceComponent } from './components/resource/resource.component';
import { EngKeyboardComponent } from './components/keyboards/eng-keyboard/eng-keyboard.component';
import { PunKeyboardComponent } from './components/keyboards/pun-keyboard/pun-keyboard.component';

import { MatCardModule, MatToolbarModule, MatIconModule, MatRadioModule, MatCheckboxModule, MatSlideToggleModule, MatAutocompleteModule, MatFormFieldModule, MatChipsModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxAudioPlayerModule, } from '../../projects/ngx-audio-player/src/lib/ngx-audio-player.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlModule } from 'ngx-owl-carousel';
import { ArtistlistComponent } from './components/artistlist/artistlist.component';
//import {AudioPlayerService} from 'ngx-audio-player/lib/service/audio-player-service/audio-player.service'
import { YtPlayerAngularModule } from 'yt-player-angular';
import { VideoplayerComponent } from './components/videoplayer/videoplayer.component';
import { MatVideoModule } from 'mat-video';
import { EmbedVideo } from 'ngx-embed-video';
import { SearchresultComponent } from './components/searchresult/searchresult.component';
import { ArchivefulllistComponent } from './components/archivefulllist/archivefulllist.component';
import { PodcastlistComponent } from './components/podcastlist/podcastlist.component';
import { CommentaryComponent } from './components/commentary/commentary.component';
import { FileSaverModule } from 'ngx-filesaver';
import { ResourcesService } from './services/resources.services';
import { GurbanilistComponent } from './components/gurbanilist/gurbanilist.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
//import { PodcastComponent } from './components/profile/podcast/podcast.component';
import { RbLetterAvatarModule } from 'rb-letter-avatar'; // <-- import the module
import {SuiModule} from 'ng2-semantic-ui';
import { ArtistgurbanilistComponent } from './components/artistgurbanilist/artistgurbanilist.component';
//import { PodcastcrudComponent } from './components/profile/podcastcrud/podcastcrud.component';
import { DataTablesModule } from 'angular-datatables';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { PodcastnavComponent } from './components/profile/podcastnav/podcastnav.component';
import { PodcastcrudComponent } from './components/profile/podcastnav/podcastcrud/podcastcrud.component';
import { PodcastComponent } from './components/profile/podcastnav/podcast/podcast.component';
import { DailypodcastComponent } from './components/profile/podcastnav/dailypodcast/dailypodcast.component';
import { PodcastsubcategorycrudComponent } from './components/profile/podcastnav/podcastsubcategorycrud/podcastsubcategorycrud.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResourcesnavComponent } from './components/profile/resourcesnav/resourcesnav.component';
import { ResourcescategorycrudComponent } from './components/profile/resourcesnav/resourcescategorycrud/resourcescategorycrud.component';
import { ResourcessubcategorycrudComponent } from './components/profile/resourcesnav/resourcessubcategorycrud/resourcessubcategorycrud.component';
import { ResourceManageComponent } from './components/profile/resourcesnav/resource/resource.component';
import { MediaartistcrudComponent } from './components/profile/resourcesnav/mediaartistcrud/mediaartistcrud.component';
import { HeadersearchComponent } from './components/headersearch/headersearch.component';
import { TagcrudComponent } from './components/profile/resourcesnav/tagcrud/tagcrud.component';
import { MediacrudComponent } from './components/profile/resourcesnav/mediacrud/mediacrud.component';
import { AuditingComponent } from './components/profile/resourcesnav/auditing/auditing.component';
import { AddpodcastcrudComponent } from './components/profile/podcastnav/addpodcastcrud/addpodcastcrud.component';
import { ModelcontentComponent } from './components/modelcontent/modelcontent.component';
import { PodcastsubcategoryComponent } from './components/podcastsubcategory/podcastsubcategory.component';
import { ArchiveComponent } from './components/profile/podcastnav/archive/archive.component';
import { Tagcrud2Component } from './components/profile/resourcesnav/tagcrud2/tagcrud2.component';
import { FooterComponent } from './components/footer/footer.component';
import { ArtistfulllistComponent } from './components/artistfulllist/artistfulllist.component';
import { MediadurationuploadComponent } from './components/profile/mediadurationupload/mediadurationupload.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { BlogsearchComponent } from './components/blog/blogsearch/blogsearch.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CommonModule } from '@angular/common';
import { myPaginationComponent } from './components/my-pagination/my-pagination.component';
import { ENETDOWN } from 'constants';

import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsServiceComponent } from './components/terms-service/terms-service.component';

import { Route, DefaultUrlSerializer, UrlSerializer, UrlTree, Router } from '@angular/router';
import { ViewSearchComponent } from './components/view-search/view-search.component';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { DonateComponent } from './components/donates/donates.component';
import { HighlightSearch } from './pipes/highlight.pipe';
import * as Sentry from "@sentry/angular";

//import { EncodeHttpParamsInterceptor } from './services/httpInterceptor.service.ts';


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 3,
  spaceBetween: 20,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
};

let config = new AuthServiceConfig([

  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FACEBOOK_APP_ID)
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
  }
]);

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: '' // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#0f78be',
      text: '#FFFFFF'
    }
  },
  theme: 'edgeless',
  type: 'opt-out',
  "content": {
    "deny": "Close",
  }
};

export function provideConfig() { return config; }

/*export default class CustomUrlSerializer implements UrlSerializer {
    private _defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

    parse(url: string): UrlTree { 
        // Encode "+" to "%2B" replace(/%20/g, " ");
        //url = url.replace(/%28/g, '(').replace(/%29/g, ')').replace(/%20/g, ' ');
     	//var url1 = decodeURI(url);

        return this._defaultUrlSerializer.parse(url).replace(/%28/g, '(').replace(/%29/g, ')');
    }

    serialize(tree: UrlTree): string {
        return this._defaultUrlSerializer.serialize(tree).replace(/%28/g, '(').replace(/%29/g, ')');
    }
}*/


@NgModule({
  declarations: [
    AppComponent,
    myPaginationComponent,
    HeaderComponent,
    ShabadComponent,
    HomeComponent,
    PageNotFoundComponent,
    BlogComponent,
    BlogDetailComponent,
    SafeUrlPipe, TruncatePipe, TruncatePipe1, DatefilterPipe, TitlereplacePipe, SortByPipe, HighlightSearch,
    PlayerComponent,
    WordDetailComponent,
    LoaderComponent,
    LoginComponent,
    SiteLayoutComponent,
    MyAccountComponent,
    RegisterComponent,
    ChangePasswordComponent,
    UserPermissionComponent,
    PostApprovalComponent,
    MyAccountLayoutComponent,
    UsersListComponent,
    BlogCommentsComponent,
    AuthorsComponent,
    ResourceComponent,
    ResourceManageComponent,
    UserPostPermissionsComponent,
    EditUserComponent,
    AddBlogComponent,
    AddVideoModalComponent,
    EditBlogComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EditProfileComponent,
    AddAudioComponent,
    ShabadSearchComponent,
    EngKeyboardComponent,
    PunKeyboardComponent,
    ArtistlistComponent,
    VideoplayerComponent,
    SearchresultComponent,
    ArchivefulllistComponent,
    PodcastlistComponent,
    CommentaryComponent,
    GurbanilistComponent,
    ArtistgurbanilistComponent,
    PodcastnavComponent,
    PodcastcrudComponent,
    PodcastComponent,
    DailypodcastComponent,
    PodcastsubcategorycrudComponent,
    ResourcesnavComponent,
    ResourcessubcategorycrudComponent,
    ResourcescategorycrudComponent,
    MediaartistcrudComponent,
    HeadersearchComponent,
    TagcrudComponent,
    MediacrudComponent,
    AuditingComponent,
    AddpodcastcrudComponent,
    ModelcontentComponent,
    PodcastsubcategoryComponent,
    ArchiveComponent,
    Tagcrud2Component,
    FooterComponent,
    ArtistfulllistComponent,
    MediadurationuploadComponent,
    BlogsearchComponent,
    PrivacyPolicyComponent,
    TermsServiceComponent,
    ViewSearchComponent,
    DonateComponent,
    
  ],
  imports: [
    NgxPaginationModule
    ,
    NgSelect2Module,
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    PaginationModule .forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TypeaheadModule.forRoot(),
    AngularFontAwesomeModule,
    SwiperModule,
    LoadingBarHttpModule,
    SocialLoginModule,
    QuillModule.forRoot(),

    NgxAudioPlayerModule,
    BrowserAnimationsModule,
    MatCardModule, MatToolbarModule, MatIconModule, MatRadioModule, MatCheckboxModule, MatSlideToggleModule,
    FontAwesomeModule,
    OwlModule,
    YtPlayerAngularModule,
    MatVideoModule,
    EmbedVideo,
    FileSaverModule,
    ShareButtonsModule,
    NgbModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    TagInputModule,
    RbLetterAvatarModule,
    SuiModule,
    DataTablesModule,
    UiSwitchModule,
    NgSelectModule,
    FormsModule,
    SocialLoginModule,
    CollapseModule.forRoot(),
    NgbModule,
    LoadingBarModule,
    NgcCookieConsentModule.forRoot(cookieConfig)
    
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    HttpService,
    PlayerService,
    AlertService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
   /* { provide: UrlSerializer, useClass: CustomUrlSerializer },*/
   /* {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptor,
      multi: true
    },*/
    ResourcesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModelcontentComponent]
})
export class AppModule { }
