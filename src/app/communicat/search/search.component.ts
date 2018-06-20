import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  private readonly apiPath = '/api/services/app/AuthEdxUserService/GetAllCountry';
  searchName = '';
  countryNodes = [];
  currentModel = null;
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get<any>(`${CourseConfig.CourseRootUrl}${this.apiPath}`).subscribe(data => {
      if (data.success) {
        this.countryNodes = [];
        let total = 0;
        data.result.items.forEach(item => {
          this.countryNodes.push(new Country(item.country, item.num, this.httpClient));
          total += item.num;
        });
        this.countryNodes.unshift(new Country('All Country', total, this.httpClient));
      }
    });
  }
  searchItem(item: Country) {
    this.countryNodes.forEach(d => d.active = '');
    item.active = 'active';
    this.currentModel = item;
    if (item.nodes.length === 0) {
      item.loadNodes(this.searchName);
    }
    console.log(item);
  }


}

class Country {

  public active: string;
  public nodes = [];
  constructor(public name: string, public num: number, public httpClient: HttpClient) {
  }

  loadNodes(searchName: string) {
    let country = this.name;
    if (country === 'All Country') {
      country = '';
    }
    const userSearchPath = '/api/services/app/AuthEdxUserService/GetAllUserPage';
    const parm = `?SkipCount=0&MaxResultCount=100&country=${country}&name=${searchName}`;
    const url = `${CourseConfig.CourseRootUrl}${userSearchPath}${parm}`;
    this.httpClient.get<any>(url).subscribe(data => {
      if (data.success) {
        this.nodes = data.result.items;
      }
    });
  }
}

