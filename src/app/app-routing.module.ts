import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShabadComponent } from './components/shabad/shabad.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { AddBlogComponent } from './components/blog/add-blog/add-blog.component';
import { WordDetailComponent } from './components/word-detail/word-detail.component';
import { LoginComponent } from './components/login/login.component';
import { SiteLayoutComponent } from './components/layouts/site-layout/site-layout.component';
import { MyAccountLayoutComponent } from './components/layouts/my-account-layout/my-account-layout.component';
import { MyAccountComponent } from './components/profile/my-account/my-account.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { UserPermissionComponent } from './components/profile/user-permission/user-permission.component';
import { PostApprovalComponent } from './components/profile/post-approval/post-approval.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersListComponent } from './components/profile/users-list/users-list.component';
import { EditUserComponent } from './components/profile/users-list/edit-user/edit-user.component';
import { BlogCommentsComponent } from './components/profile/blog-comments/blog-comments.component';
import { AuthorsComponent } from './components/profile/authors/authors.component';
//import { ResourceManageComponent } from './components/profile/resource/resource.component';
import { UserPostPermissionsComponent } from './components/profile/user-post-permissions/user-post-permissions.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ShabadSearchComponent } from './components/shabad-search/shabad-search.component';
import { ResourceComponent } from './components/resource/resource.component';

import { AuthGuard } from './auth/auth.guard';
import { ArtistlistComponent } from './components/artistlist/artistlist.component';
import { VideoplayerComponent } from './components/videoplayer/videoplayer.component';
import { SearchresultComponent } from './components/searchresult/searchresult.component';
import { ArchivefulllistComponent } from './components/archivefulllist/archivefulllist.component';
import { PodcastlistComponent } from './components/podcastlist/podcastlist.component';
import { CommentaryComponent } from './components/commentary/commentary.component';
import { GurbanilistComponent } from './components/gurbanilist/gurbanilist.component';
import { ArtistgurbanilistComponent } from './components/artistgurbanilist/artistgurbanilist.component';
import { PodcastnavComponent } from './components/profile/podcastnav/podcastnav.component';
import { PodcastComponent } from './components/profile/podcastnav/podcast/podcast.component';
import { PodcastcrudComponent } from './components/profile/podcastnav/podcastcrud/podcastcrud.component';
import { DailypodcastComponent } from './components/profile/podcastnav/dailypodcast/dailypodcast.component';
import { ResourcesnavComponent } from './components/profile/resourcesnav/resourcesnav.component';
import { PodcastsubcategoryComponent } from './components/podcastsubcategory/podcastsubcategory.component';
import { ArtistfulllistComponent } from './components/artistfulllist/artistfulllist.component';
import { MediadurationuploadComponent } from './components/profile/mediadurationupload/mediadurationupload.component';
import { BlogsearchComponent } from './components/blog/blogsearch/blogsearch.component';

import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsServiceComponent } from './components/terms-service/terms-service.component';
import { ViewSearchComponent } from './components/view-search/view-search.component';
import { DonateComponent } from './components/donates/donates.component';

const routes: Routes = [

	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: '',
		// redirectTo: 'shabad'
		component 	: SiteLayoutComponent,
		// canActivate: [AuthGuard],
		children	: [
			{
				path: '',
				pathMatch: 'full',
				 redirectTo: 'shabad'
				//component: HomeComponent
			},
			{
				path: 'home',
				pathMatch: 'full',
				// redirectTo: 'shabad'
				component: HomeComponent
			},
			{
				path: 'shabad/:id',
				pathMatch: 'full',
				component: ShabadComponent
			},
			{
				path: 'shabad/:id/:shabad_id',
				pathMatch: 'full',
				component: ShabadComponent
			},
			{
				path: 'shabad/:id/:shabad_id/:mediaid/:type',
				pathMatch: 'full',
				component: ShabadComponent
			},
			{
				path: 'blog',
				pathMatch: 'full',
				component: BlogComponent
			},
			{
				path: 'blog/:id',
				pathMatch: 'full',
				component: BlogDetailComponent
			},
			{
				path: 'blogsearch/:id',
				pathMatch: 'full',
				component: BlogsearchComponent
			},
			{
				path: 'worddetail',
				pathMatch: 'full',
				component: WordDetailComponent
			},
			{
				path: 'resources',
				pathMatch: 'full',
				component: ResourceComponent
			},
			{
				path: 'login',
				pathMatch: 'full',
				component: LoginComponent
			},
			{
				path: 'register',
				pathMatch: 'full',
				component: RegisterComponent
			},
			{
				path: 'forgot-password',
				pathMatch: 'full',
				component: ForgotPasswordComponent
			},
			/*{
				path: 'reset-password',
				pathMatch: 'full',
				component: ResetPasswordComponent
			},*/
			{
				path: 'reset-password/:token',
				pathMatch: 'full',
				component: ResetPasswordComponent
			},
			{
				path: 'search',
				pathMatch: 'full',
				component: ShabadSearchComponent
			},
			{
				path: 'artistlist/:title/:id',
				pathMatch: 'full',
				component: ArtistlistComponent
			},
			{
				path: 'gurbanilist/:title/:id/:urlid/:cid/:ctitle',
				pathMatch: 'full',
				component: GurbanilistComponent
			},
			{
				path: 'gurbanilist/:title/:id/:urlid',
				pathMatch: 'full',
				component: GurbanilistComponent
			},
			{
				path: 'videoplayer',
				pathMatch: 'full',
				component: VideoplayerComponent
			},
			{
				path: 'artistfulllist',
				pathMatch: 'full',
				component: ArtistfulllistComponent
			},
			{
				path: 'videoplayer',
				pathMatch: 'full',
				component: VideoplayerComponent
			},
			{
				path: 'search/:search/:id',
				pathMatch: 'full',
				component: SearchresultComponent
			},
			{
				path: 'searchresult',
				pathMatch: 'full',
				component: SearchresultComponent
			},
			{
				path: 'searchresult/:lang/:value',
				pathMatch: 'full',
				component: SearchresultComponent
			},
			{
				path: 'artistgurbanilist/:id/:title',
				pathMatch: 'full',
				component: ArtistgurbanilistComponent
			},
			{
				path: 'archivelist',
				pathMatch: 'full',
				component: ArchivefulllistComponent
			},
			{
				path: 'podcastlist',
				pathMatch: 'full',
				component: PodcastlistComponent
			},
			
			{
				path: 'podcastsubcategory',
				pathMatch: 'full',
				component: PodcastsubcategoryComponent
			},
			{
				path: 'podcastlist/:id',
				pathMatch: 'full',
				component: PodcastlistComponent
			},
			{
				path: 'podcastlist/:id/:search',
				pathMatch: 'full',
				component: PodcastlistComponent
			},
			{
				path: 'podcastlist/:id/:search/:type',
				pathMatch: 'full',
				component: PodcastlistComponent
			},
			
			
			{
				path: 'commentary/:id',
				pathMatch: 'full',
				component: CommentaryComponent
			},
			{
				path: 'commentary/:id/:shabad_id',
				pathMatch: 'full',
				component: CommentaryComponent
			},
			{
				path: 'privacy-policy',
				pathMatch: 'full',
				component: PrivacyPolicyComponent
			},
			{
				path: 'terms-and-conditions',
				pathMatch: 'full',
				component: TermsServiceComponent
			},
			{
				path: 'view-search',
				pathMatch: 'full',
				component: ViewSearchComponent
			},
			{
				path: 'donate',
				pathMatch: 'full',
				component: DonateComponent
			},

			
		]
	},
	{
		path: 'my-account',
		// redirectTo: 'shabad'
		component 	: MyAccountLayoutComponent,
		canActivate: [AuthGuard],
		children	: [
			{
				path: '',
				pathMatch: 'full',
				component: MyAccountComponent
			},
			{
				path: 'change-password',
				pathMatch: 'full',
				component: ChangePasswordComponent
			},
			{
				path: 'mediadurationupload',
				pathMatch: 'full',
				component: MediadurationuploadComponent
			},
			{
				path: 'users',
				pathMatch: 'full',
				component: UsersListComponent
			},
			{
				path: 'user/edit/:id',
				pathMatch: 'full',
				component: EditUserComponent
			},
			{
				path: 'blog-comments',
				pathMatch: 'full',
				component: BlogCommentsComponent
			},
			{
				path: 'authors',
				pathMatch: 'full',
				component: AuthorsComponent
			},
			{
				path: 'resourcesnav',
				pathMatch: 'full',
				component: ResourcesnavComponent
			},
			{
				path: 'podcastnav',
				component:PodcastnavComponent,
				// children: [
				// 	{
				// 		path:'',
				// 		component:PodcastComponent,		
				// 	},
				// 	{
				// 		path:'podcast',
				// 		component:PodcastComponent,		
				// 	},
				// 	{
				// 		path: 'addpodcast',
				// 		component: PodcastcrudComponent
				// 	},
				// 	{
				// 		path: 'dailypodcast',
				// 		component: DailypodcastComponent
				// 	}
				// ]
			},
			{
				path: 'podcastnav/:id',
				component:PodcastnavComponent,
			
			},
			{
				path: 'user-permission',
				pathMatch: 'full',
				component: UserPermissionComponent
			},
			{
				path: 'posts',
				pathMatch: 'full',
				component: PostApprovalComponent
			},
			{
				path: 'user-post-permissions',
				pathMatch: 'full',
				component: UserPostPermissionsComponent
			},
		]
	},
	{
		path: '**',
		pathMatch: 'full',
		component: PageNotFoundComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
