/* eslint-disable no-console */
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, Observable, of } from 'rxjs';
import { ConfigService } from "@virtual-class-frontend/virtual-class-config";

@Injectable()
export class AuthService {
  private settings: any;

  constructor(
    private config: ConfigService,
    private oauthService: OAuthService,
    private readonly router: Router,
    private zone:NgZone,
  ) {

    this.settings = {
      scope: 'openid profile email phone halliburton-asg',
      issuer: this.config.getEnvironment().authSettings.authority,
      clientId: this.config.getEnvironment().authSettings.client_id,
      redirectUri: this.config.getEnvironment().authSettings.redirect_uri,
      oidc: true,
      requestAccessToken: true,
      useSilentRefresh: true,
      silentRefreshRedirectUri: this.config.getEnvironment().authSettings.redirect_uri,
      postLogoutRedirectUri: this.config.getEnvironment().authSettings.post_logout_redirect_uri,
      showDebugInformation: true,
      requireHttps: false,
    };

    this.oauthService.configure(this.settings);

    this.oauthService.loadDiscoveryDocument();

    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.events.pipe(
      filter(event => (event.type === 'token_error' || event.type === 'token_expires')
          && !this.oauthService.hasValidIdToken(),
      ),
    ).subscribe(e => {
      console.log(e.type);

      this.oauthService
        .tryLogin()
        .then(info => {
          console.log('tryLogin ok', info);
          if (!info) {
            console.error('tryLogin error, logOut');
            this.zone.run(() => {
              this.router.navigateByUrl('/');
              location.reload();
            });
          }
        })
        .catch(err => {
          console.error('tryLogin catch error, logOut', err);
          this.zone.run(() => {
            this.oauthService.logOut();
            this.router.navigateByUrl('/');
            location.reload();
          });
        });
    });

  }

  login(path?: { url: string; search: string; }): void {
    this.oauthService.initImplicitFlow(JSON.stringify(path));
    this.oauthService.tryLoginImplicitFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  getLoginState(): { url: string; search: string; } {
    return this.oauthService?.state ? JSON.parse(this.oauthService.state) : { url: null, search: null } ;
  }

  getUserClaims$(): Observable<any> {
    return of(this.oauthService.getIdentityClaims());
  }

  getUserClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  getUserToken(): any {
    return this.oauthService.getAccessToken();
  }

  loginImplicitFlow(): any {
    return this.oauthService.tryLoginImplicitFlow();
  }

  hasValidToken(): any {
    return this.oauthService.hasValidIdToken();
  }

}
