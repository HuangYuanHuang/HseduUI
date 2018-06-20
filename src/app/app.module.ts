import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HseduModule } from './hsedu/hsedu-module';
import { CommunicatModule } from './communicat/communicat.module';
import { AppRoutingModule } from './app-routing.module';
import { CourseModule } from './course/course.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RuntimeConfigService } from './service/runtime-config-service';
import { SignalrNoticeService } from './service/signalr-notice-service';
import { SignalrPointService } from './service/signalr-point-service';
import { SignalrOnlineChatService } from './service/signalr-online-chat-service';

import { NgxEchartsModule } from 'ngx-echarts';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    HttpClientModule, HttpModule,
    NgxEchartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    HseduModule,
    CourseModule,
    CommunicatModule,
    AppRoutingModule
  ],
  providers: [RuntimeConfigService,
    SignalrNoticeService,
    SignalrPointService,
    SignalrOnlineChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
