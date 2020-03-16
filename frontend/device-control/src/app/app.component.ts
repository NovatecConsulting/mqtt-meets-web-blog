import {Component, OnInit} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {MqttService} from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private mqttService?: MqttService;
  lightStatus = 'ON';

  readonly lightStatusTopic = 'light';

  constructor(private oauthService: OAuthService) {}

  async ngOnInit() {
    const authConfig: AuthConfig = {
      issuer: 'http://keycloak:8083/auth/realms/master',
      redirectUri: window.location.origin,
      clientId: 'frontend',
      scope: 'mqtt',
      requireHttps: false
    };
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (this.oauthService.hasValidAccessToken()) {
      this.connectMQTT();
    } else {
      this.oauthService.initImplicitFlow();
    }
  }

  private async connectMQTT() {
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
