import {Component} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {MqttService} from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private mqttService?: MqttService;
  lightStatus: string;

  readonly lightStatusTopic = 'light';

  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private async configure() {
    const authConfig: AuthConfig = {
      issuer: 'http://localhost:8083/auth/realms/master',
      redirectUri: window.location.origin,
      clientId: 'frontend',
      scope: 'mqtt',
    };
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    if (!this.oauthService.getAccessToken()) {
      this.oauthService.initImplicitFlow()
    }

    if (this.oauthService.getAccessToken()) {
      this.connect();
    }
  }

  private async connect() {
    if (this.mqttService) {
      this.mqttService.disconnect();
    }
    this.mqttService = new MqttService({
      url: 'ws://localhost:8081/mqtt',
      username: this.oauthService.getIdentityClaims()['sub'],
      password: this.oauthService.getAccessToken()
    });

    this.mqttService.observe(this.lightStatusTopic).subscribe(message => {
      this.lightStatus = message.payload.toString();
    });
  }

  private changeLightStatus(newStatus: string) {
    this.mqttService.publish(this.lightStatusTopic, newStatus, {qos: 0, retain: true}).subscribe();
  }
}
