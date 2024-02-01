import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';
import { SingleCompanyCategory, SubCategory } from 'src/model/company';
import { CategoryDialogService } from 'src/services/category-dialog.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  member: any;
  logoBaseUrl = environment.logoBaseUrl;
  categories: Array<SingleCompanyCategory> = [];
  allCategories: Array<SubCategory> = [];
  companySubCategories: Array<string> = [];
  companySegments: Array<string> = []
  targetCustomers: Array<string> = [];
  isMobile!: boolean;

  constructor(
    private cds: CategoryDialogService,
    private deviceService: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.member = data.member;
    this.categories = this.member.properties.general || [];
    this.prepareSubCategory();
    this.getDeviceInfo();
  }
  ngOnInit() {
  }

  getDeviceInfo() {
    this.isMobile = this.deviceService.isMobile();
  }

  prepareSubCategory() {
    const subCat = this.cds.getSubcategoriesByCatCode(this.member.code);
    if (subCat) {
      this.allCategories = this.cds.getSubcategories(subCat);
    }

    const { properties } = this.member;
    let tempSubCat: Array<string> = [];
    let segments: Array<string> = [];

    for (let subCat of this.allCategories) {
      const property = subCat.property;
      if (properties[property]?.length > 0) {
        tempSubCat.push(subCat.tittle);
        const segment = properties[property].map((s: any) => s.title.en);
        segments = [
          ...segments,
          ...segment
        ];

      }
    }

    this.companySubCategories = tempSubCat;
    this.companySegments = segments;

    const customers = this.member?.properties?.targetcustomer || [];
    if (customers.length > 0) {
      this.targetCustomers = customers.map((x: any) => x.title.en);
    }
  }

}
