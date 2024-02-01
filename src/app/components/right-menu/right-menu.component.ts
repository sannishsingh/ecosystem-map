import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { SingleCompanyCategory } from 'src/model/company';
import { CategoryListingService } from 'src/services/category-listing.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss'],
  animations: [
    trigger('slideRightToLeft', [
      state('void', style({ transform: 'translateX(100%)' })),
      state('*', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class RightMenuComponent implements OnInit {

  showResourceMenu: boolean = false;
  showMenuContent: boolean = false;

  provinceStates: SingleCompanyCategory[] = [];
  targetCustomers: SingleCompanyCategory[] = [];

  provinceState: string = 'all';
  targetCustomer: string = 'all';
  searchQuery: string = '';
  view: string = 'dir';
  memberType: string = 'all';
  isMobile!: boolean;

  constructor(public dialogRef: MatDialogRef<RightMenuComponent>,
    private deviceService: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cl: CategoryListingService,) {

    this.prepareDropdownData(data);
    this.getDeviceInfo();
  }

  ngOnInit() {

  }

  getDeviceInfo() {
    this.isMobile = this.deviceService.isMobile();
  }


  prepareDropdownData(data: any) {
    this.provinceStates = this.cl.extractProvinceState(data);
    this.targetCustomers = this.cl.extractTargetCustomer(data);
  }

  close() {
    this.dialogRef.close();
    this.showResourceMenu = false;
  }

  showContent() {
    setTimeout(() => {
      this.showMenuContent = this.showResourceMenu;
    }, 400);
  }

  onStateSelection(event: any) {
    this.searchQuery = '';
    this.targetCustomer = 'all';
    this.memberType = 'all';

    let data = {
      type: 'state',
      value: this.provinceState
    }

    this.cl.setFilterOptionValue(data);
  }


  onTargetCustomerSelection(event: any) {
    this.searchQuery = '';
    this.provinceState = 'all';
    this.memberType = 'all';

    let data = {
      type: 'tc',
      value: this.targetCustomer
    }

    this.cl.setFilterOptionValue(data);
  }

  onMemberTypeChange(event: any) {
    this.searchQuery = '';
    this.targetCustomer = 'all';
    this.provinceState = 'all';

    let data = {
      type: 'memberType',
      value: this.memberType
    }

    this.cl.setFilterOptionValue(data);
  }

  onViewChange(event: any) {
    let data = {
      type: 'view',
      value: this.view
    }
    this.cl.setFilterOptionValue(data);
  }

  search() {
    if (this.searchQuery) {
      let data = {
        type: 'search',
        value: this.searchQuery
      }

      this.cl.setFilterOptionValue(data);
    } else {
      let data = {
        type: 'clearSearch',
        value: this.searchQuery
      }

      this.cl.setFilterOptionValue(data);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.search();
  }

  navigateToAustralianPaymentPlusPage() {
    window.open("https://www.fintechaustralia.org.au/service-providers/australianpaymentsplus/", "_blank");
  }



}
