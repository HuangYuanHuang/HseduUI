import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-hsedu-nav',
  templateUrl: './hsedu-nav.component.html',
  styleUrls: ['./hsedu-nav.component.css']
})
export class HseduNavComponent implements OnInit {

  currentLang = '中文';
  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
  }
  changeLang(lang: string, name: string) {
    this.currentLang = name;
    this.translate.use(lang);

  }
}
