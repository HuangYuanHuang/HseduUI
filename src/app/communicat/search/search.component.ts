import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseConfig } from '../../../shard/CourseConfig';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { UserContactService } from '../../service/user-contact-service';
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
  constructor(private httpClient: HttpClient,
    public runConfig: RuntimeConfigService,
    private userContact: UserContactService) {
  }

  ngOnInit() {
    this.httpClient.get<any>(`${CourseConfig.CourseRootUrl}${this.apiPath}`).subscribe(data => {
      if (data.success) {
        this.countryNodes = [];
        let total = 0;
        data.result.items.forEach(item => {
          this.countryNodes.push(new Country(item.country, item.num, this.runConfig.userId, this.httpClient, this.userContact));
          total += item.num;
        });
        this.countryNodes.unshift(new Country('All Country', total, this.runConfig.userId, this.httpClient, this.userContact));
      }
    });
  }
  searchItem(item: Country) {
    this.countryNodes.forEach(d => d.active = '');
    item.active = 'active';
    this.currentModel = item;
    if (item.nodes.length === 0 || item.isSearch) {
      item.loadNodes('');
    }
    item.isSearch = false;
    console.log(item);
  }
  userSearch() {
    this.currentModel.loadNodes(this.searchName);
    this.currentModel.isSearch = true;
  }
  addFriend(item: UserDetailModel) {
    console.log(this.runConfig);
    const url = `${CourseConfig.CourseRootUrl}/api/services/app/UserApplyService/Create`;
    this.httpClient.post<any>(url, {
      fromUserId: this.runConfig.userId,
      toUserId: item.userId,
      bio: '',
      source: 'User Search'
    }).subscribe(data => {
      if (data.success) {
        item.status = 0;
      }
    });
  }
}

class Country {
  public isSearch = false;
  public active: string;
  public nodes = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 10;
  private searchName = '';
  constructor(public name: string, public num: number, private userId: number,
    public httpClient: HttpClient, private userContact: UserContactService) {
  }
  pageChange(page: any) {
    console.log(page);
    const skipCount = (page - 1) * this.pageSize;
    this.loadNodes(this.searchName, skipCount);
  }
  loadNodes(searchName: string, skipCount = 0) {
    let country = this.name;
    if (country === 'All Country') {
      country = '';
    }
    this.searchName = searchName;

    const userSearchPath = '/api/services/app/AuthEdxUserService/GetAllUserPage';
    const parm = `?SkipCount=${skipCount}&MaxResultCount=${this.pageSize}&country=${country}&name=${searchName}`;
    const url = `${CourseConfig.CourseRootUrl}${userSearchPath}${parm}`;
    this.httpClient.get<any>(url).subscribe(data => {
      this.nodes = [];
      if (data.success) {
        this.total = data.result.totalCount;
        data.result.items.forEach(item => {
          const model = new UserDetailModel(item.userIndex, item.userName, item.imageUrlMedium, item.country, item.bio);
          const resUserApply = this.userContact.userApplyNodes.filter(d => d.fromUserId === this.userId && d.toUserId === model.userId);
          if (resUserApply && resUserApply.length > 0) {
            model.status = resUserApply[0].status;
          }
          const resUserRequest = this.userContact.userRequestNodes.filter(d => d.fromUserId === model.userId && d.toUserId === this.userId);
          if (resUserRequest && resUserRequest.length > 0) {
            model.status = resUserRequest[0].status;
          }
          if (model.userId === this.userId) {
            model.status = 44;
            model.trClass = 'table-success';
          }
          this.nodes.push(model);

        });
      }
    });
  }
}

class UserDetailModel {
  public trClass = '';
  public status = -1;
  constructor(public userId: number, public userName: string,
    public imageUrlMedium: string, public country: string, public bio: string) {

  }
}

