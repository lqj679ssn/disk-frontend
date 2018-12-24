import { NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResComponent } from "./components/res/res.component";
import { ResHomeComponent } from "./components/res/res-home.component";
import { RedirectComponent } from "./components/base/redirect.component";
import { OauthComponent } from "./components/user/oauth.component";
import { RefreshComponent } from "./components/user/refresh.component";

const routes: Routes = [
  // { path: '', component: LoginComponent},
  { path: 's/:res_str_id', component: RedirectComponent},
  { path: 'user/refresh', component: RefreshComponent},
  { path: 'res', component: ResHomeComponent},
  { path: 'res/next/:next', component: ResHomeComponent},
  { path: 'res/:res_str_id', component: ResComponent},
  { path: 'oauth/qtb/callback', component: OauthComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
