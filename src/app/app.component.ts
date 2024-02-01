import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Category, CategoryItem, Company, CompanyImage, CompanyResponse, GeneralCategory, SingleCompanyCategory, SubCategory, } from 'src/model/company';
import { CategoryDialogService } from 'src/services/category-dialog.service';
import { CategoryListingService } from 'src/services/category-listing.service';
import { LoaderService } from 'src/services/loader.service';
import { MembersService } from 'src/services/members.service';
import { UtilityService } from 'src/services/utility.service';
import { ZoomMapService } from 'src/services/zoom-map.service';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { RightMenuComponent } from './components/right-menu/right-menu.component';
import { logoWidthHeight } from './constant';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  logoBaseUrl: string = environment.logoBaseUrl;
  svgLogoBaseUrl: string = environment.svgLogoBaseUrl;
  logoWidth: number = logoWidthHeight;
  categories: Array<Category> = [];

  @ViewChild('zoomAbleDiv', { static: true })
  zoomAbleDiv!: ElementRef;

  @ViewChild('zoomAbleMap', { static: true })
  zoomAbleMap!: ElementRef;

  provinceStates: SingleCompanyCategory[] = [];
  targetCustomers: SingleCompanyCategory[] = [];
  provinceState: string = 'all';
  targetCustomer: string = 'all';
  searchQuery: string = '';
  view: string = 'pie';
  memberType: string = 'all';
  allCompanies: Array<Company> = [];
  filteredCompanies: Array<Company> = [];
  selectedCategory!: Category;
  filteredSelectedCategory!: Category;
  isMobile!: boolean;
  isDirectory!: boolean;
  subCategories: Array<SubCategory> = [];
  selectedSubCategory!: SubCategory;
  segments: Array<SingleCompanyCategory> = [];
  selectedSegment!: SingleCompanyCategory;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public ul: UtilityService,
    private cl: CategoryListingService,
    public zoom: ZoomMapService,
    private ms: MembersService,
    private elementRef: ElementRef,
    private loader: LoaderService,
    private cds: CategoryDialogService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.matIconRegistry.addSvgIcon("linkedin",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/linkedin.svg")
    );
    this.matIconRegistry.addSvgIcon("twitter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/twitter.svg")
    );
    this.matIconRegistry.addSvgIcon("website",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/website.svg")
    );
    this.matIconRegistry.addSvgIcon("facebook",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/facebook.svg")
    );

    this.getDeviceInfo();
  }


  ngOnInit() {

    this.cl.myFilterOptions.subscribe((data: any) => {

      const type = data.type;
      if (type === 'state') {
        this.provinceState = data.value;
        this.onStateSelection({});
      } else if (type === 'tc') {
        this.targetCustomer = data.value;
        this.onTargetCustomerSelection({});
      } else if (type === 'memberType') {
        this.memberType = data.value;
        this.onMemberTypeChange({});
      } else if (type === 'search') {
        this.searchQuery = data.value;
        this.search();

      } else if (type === 'clearSearch') {
        this.clearSearch();
      } else if (type === 'view') {
        this.view = data.value;
        this.onViewChange({});
      }
    });

    // this handle direct opening to directory url.. 
    this.route.queryParamMap.subscribe(params => {
      const viewParam = params.get('view');
      // http://localhost:4200/?view=dir
      if (viewParam && viewParam == 'dir') {
        this.view = 'dir';
        this.isDirectory = true;
      } else {
        this.isDirectory = false;
      }
    });

  }

  getDeviceInfo() {
    this.isMobile = this.deviceService.isMobile();
  }

  ngAfterViewInit() {
    this.loadCategories();
    this.cdr.detectChanges();
    this.setDirectoryView();

  }

  setDirectoryView() {
    if (this.isMobile) {
      setTimeout(() => {
        this.view = 'dir';
      }, 1000);
    }
  }

  generateSliceItems(items: GeneralCategory[]) {
    const { lsAngle, ssAngle } = this.cl.getLargeSizedAndSmallSizedAngle(items.length);
    const itemLength = items.length;
    for (let category of items) {
      let index = items.indexOf(category);
      const catWithSliceAngle = this.cl.getCategoryWithSliceAngle(index, lsAngle, ssAngle, category);
      this.createRowsColumns(catWithSliceAngle, index, itemLength);

      // Set default category for mobile
      if (index == (itemLength - 1) && (this.isMobile || this.isDirectory)) {
        this.setDefaultCategory();
      }
    }
  }

  setDefaultCategory() {
    const cat = this.categories.find(x => x.code == 'digital-payments');
    if (cat) {
      this.selectedCategory = cat;
      this.filteredSelectedCategory = cat;
      this.getSubCategories(cat.code);
    }
  }

  createRowsColumns(category: GeneralCategory, index: number, itemLength: number) {
    const { height } = this.cl.getElementInfo(this.elementRef.nativeElement, 'myElement');
    const { lsAngle, ssAngle } = this.cl.getLargeSizedAndSmallSizedAngle(itemLength);
    let sliceAngle = this.cl.getSliceAngleByIndex(lsAngle, ssAngle, index);
    const totalRowsColumn = this.cl.getTotalRowsColumnsInSlice(height, sliceAngle);
    const totalLogos = this.cl.getTotalLogosInASlice(totalRowsColumn);


    if (index == 0) {
      console.log('total logo in slice', index + 1, category.images.length);
      console.log('Logos in large slice', sliceAngle, 'deg', totalLogos);
    };
    if (index == 12) {
      console.log('total logo in slice', index + 1, category.images.length);
      console.log('Logos in small slice', sliceAngle, 'deg', totalLogos)
    };
    let companies = JSON.parse(JSON.stringify(category.images));
    const members = this.cl.removeDuplicateItems(this.categories, category.images);

    const bgColor = this.cl.getBackgroundColor(index);

    const { sliceContent } = this.cl.getSliceContent(members, totalRowsColumn);
    let categoryItem: Category = {
      categoryName: category.title,
      backgroundColor: bgColor,
      categoryItems: [...sliceContent],
      sliceAngle: category?.sliceAngle || 0,
      companies: companies,
      code: category.code
    }
    this.categories.push(categoryItem);

    if (category.code == this.selectedCategory?.code) {
      this.selectedCategory = {
        ...categoryItem
      }
      this.filteredSelectedCategory = {
        ...categoryItem
      };
    }
  }

  loadCategories() {
    let body = { offset: 0 };
    this.loader.showLoader();
    this.ms.loadMembers(body).subscribe((res: CompanyResponse) => {
      this.allCompanies = res.value;
      this.filteredCompanies = this.allCompanies;
      this.provinceStates = this.cl.extractProvinceState(res.value);
      this.targetCustomers = this.cl.extractTargetCustomer(res.value);
      this.processCompanies(res.value);
      this.loader.hideLoader();
    });
  }

  handleLogoClick(colItem: CategoryItem, code: string) {
    const member = {
      ...colItem.companyImage.company,
      code
    }
    this.dialog.open(MemberDetailsComponent, {
      width: this.isMobile ? '100%' : '80%',
      height: this.isMobile ? '99%' : "75%",
      panelClass: 'member-detail-dialog',
      data: {
        member: member
      },
    });
  }
  handleTitleClick(category: Category) {
    this.dialog.open(CategoryDetailsComponent, {
      width: '100%',
      height: this.isMobile ? '99%' : "90%",
      panelClass: 'first-dialog',
      data: {
        category: category
      },
    });
  }

  processCompanies(filteredCompanies: Company[]) {
    const companies = this.allCompanies;
    const { categories } = this.cl.getAllCategoriesAllImagesFromResponse(companies);
    const { images } = this.cl.getAllCategoriesAllImagesFromResponse(filteredCompanies);
    const categoriesWithImages = this.cl.getCategoriesWithImages(images, categories);
    const sortedCategories = this.cl.getSortedCategories(categoriesWithImages);
    this.generateSliceItems(sortedCategories);
  }

  onTargetCustomerSelection(event: any) {
    this.searchQuery = '';
    this.provinceState = 'all';
    this.memberType = 'all';
    if (this.targetCustomer === 'all') {
      this.filteredCompanies = this.allCompanies;
    } else {
      this.filteredCompanies = this.cl.filterCompaniesByTargetCustomer(this.allCompanies, this.targetCustomer);
    }
    this.categories = [];
    this.processCompanies(this.filteredCompanies);
  }

  onStateSelection(event: any) {
    this.searchQuery = '';
    this.targetCustomer = 'all';
    this.memberType = 'all';
    if (this.provinceState === 'all') {
      this.filteredCompanies = this.allCompanies;
    } else {
      this.filteredCompanies = this.cl.filterCompaniesByProvinceState(this.allCompanies, this.provinceState);
    }
    this.categories = [];
    this.processCompanies(this.filteredCompanies);
  }

  search() {
    if (this.searchQuery) {
      this.filteredCompanies = this.allCompanies.filter(item => {
        return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });

      //  filter selected category..
      const companies = this.selectedCategory?.companies || [];
      const filteredCompanies = companies.filter(item => {
        return item.company.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });

      this.filteredSelectedCategory = {
        ...this.selectedCategory,
        companies: filteredCompanies
      }

    } else {
      this.filteredCompanies = this.allCompanies;
    }
    this.categories = [];
    this.processCompanies(this.filteredCompanies);

    // reset selected category and sub-category
    this.selectedSubCategory = {} as SubCategory;
    this.selectedSegment = {} as SingleCompanyCategory;
    this.segments = [];
  }

  clearSearch() {
    this.searchQuery = '';
    this.search();
  }

  onMemberTypeChange(event: any) {
    this.searchQuery = '';
    this.targetCustomer = 'all';
    this.provinceState = 'all';
    if (this.memberType === 'all') {
      this.filteredCompanies = this.allCompanies;
    } else {
      this.filteredCompanies = this.cl.getActiveNonActiveMembers(this.allCompanies, this.memberType);
    }

    this.categories = [];
    this.processCompanies(this.filteredCompanies);
  }

  openMenu() {
    if (this.isMobile) {
      this.searchQuery = '';
      this.provinceState = 'all';
      this.targetCustomer = 'all';
      this.memberType = 'all';
      this.view = 'dir';
      this.filteredCompanies = this.allCompanies;

      this.categories = [];
      this.processCompanies(this.filteredCompanies);
    }
    const dialogConfig = {
      height: '100%',
      width: this.isMobile ? '100%' : '26%',
      panelClass: 'custom-dialog-container',
      position: {
        right: '0'
      },
      data: this.allCompanies
    };
    this.dialog.open(RightMenuComponent, dialogConfig);
  }

  onMouseEnter(event: any, angle: number) {
    const hoveredElement = event.currentTarget as HTMLElement;
    hoveredElement.style.transform = `rotate(${-angle}deg) scale(1.2)`;
  }

  onMouseLeave(event: any, angle: number) {
    const hoveredElement = event.currentTarget as HTMLElement;
    hoveredElement.style.transform = `rotate(${-angle}deg)`;
  }

  onMouseEnterOnTitle(index: number, code: string) {
    let firstElement: HTMLElement;
    let secondElement: HTMLElement;
    if (index == (this.categories.length - 1)) {
      firstElement = this.elementRef.nativeElement.querySelector(`#${code}`) as HTMLElement;
      const secondElementId = this.categories[0].code;
      secondElement = this.elementRef.nativeElement.querySelector(`#${secondElementId}`) as HTMLElement;
    } else {
      firstElement = this.elementRef.nativeElement.querySelector(`#${code}`) as HTMLElement;
      const secondElementId = this.categories[index + 1].code;
      secondElement = this.elementRef.nativeElement.querySelector(`#${secondElementId}`) as HTMLElement;
    }
    firstElement.style.borderLeft = `4px solid #7C7C7C`;
    secondElement.style.borderLeft = `4px solid #7C7C7C`;

  }

  onMouseLeaveOnTitle(index: number, code: string) {
    let firstElement: HTMLElement;
    let secondElement: HTMLElement;
    if (index == (this.categories.length - 1)) {
      firstElement = this.elementRef.nativeElement.querySelector(`#${code}`) as HTMLElement;
      const secondElementId = this.categories[0].code;
      secondElement = this.elementRef.nativeElement.querySelector(`#${secondElementId}`) as HTMLElement;
    } else {
      firstElement = this.elementRef.nativeElement.querySelector(`#${code}`) as HTMLElement;
      const secondElementId = this.categories[index + 1].code;
      secondElement = this.elementRef.nativeElement.querySelector(`#${secondElementId}`) as HTMLElement;
    }

    // #f4f4f4
    firstElement.style.borderLeft = `2px solid #7C7C7C`;
    secondElement.style.borderLeft = `2px solid #7C7C7C`;
  }

  navigateToHomePage() {
    window.open("https://www.fintechaustralia.org.au/", "_blank");
  }

  navigateToAustralianPaymentPlusPage() {
    window.open("https://www.fintechaustralia.org.au/service-providers/australianpaymentsplus/", "_blank");
  }


  clickCategoryItem(index: number, category: Category) {
    this.selectedCategory = category;
    this.filteredSelectedCategory = this.selectedCategory;
    this.getSubCategories(category.code);

    // reset selected category and sub-category
    this.selectedSubCategory = {} as SubCategory;
    this.selectedSegment = {} as SingleCompanyCategory;
    this.segments = [];
  }

  getSubCategories(code: string) {
    const subCat = this.cds.getSubcategoriesByCatCode(code);
    this.subCategories = this.cds.getSubcategories(subCat);
  }

  onViewChange(event: any) {
    this.clearSearch();
    if (this.view == 'dir') {
      const cat = this.categories.find(x => x.code == 'digital-payments');
      if (cat) {
        this.selectedCategory = cat;
        this.filteredSelectedCategory = cat;
        this.getSubCategories(cat.code);
      }
    } else {
      setTimeout(() => {
        this.processCompanies(this.allCompanies);
      }, 1000);
    }
  }

  companyDetail(element: any) {
    const member = {
      ...element.company,
      code: this.selectedCategory?.code
    }
    this.dialog.open(MemberDetailsComponent, {
      width: this.isMobile ? '100%' : '80%',
      height: this.isMobile ? '99%' : "75%",
      panelClass: 'member-detail-dialog',
      data: {
        member: member
      },
    });
  }

  onSubCategoryClick(subCat: SubCategory) {
    this.searchQuery = '';
    this.selectedSubCategory = subCat;
    this.segments = this.cds.getAllSegments(subCat.property, this.selectedCategory);
    const newCompanies = this.getNewCompanies();
    this.filteredSelectedCategory = {
      ... this.filteredSelectedCategory,
      companies: newCompanies
    };

    // Reset segment selection.
    this.selectedSegment = {} as SingleCompanyCategory;
  }

  onSegmentClick(segment: SingleCompanyCategory) {
    this.selectedSegment = segment;

    const newCompanies = this.getNewCompanyFilterBySegment();
    this.filteredSelectedCategory = {
      ... this.filteredSelectedCategory,
      companies: newCompanies
    };
  }

  getNewCompanies() {
    const { property } = this.selectedSubCategory;
    const newCompanies = this.selectedCategory.companies;
    const filteredCompanies = newCompanies.filter(item => item.company.properties[property]?.length > 0);
    return filteredCompanies;
  }

  getNewCompanyFilterBySegment() {
    const { property: catCode } = this.selectedSubCategory;
    const { code: segmentCode } = this.selectedSegment;
    const companiesFilterBySubCategory = this.getNewCompanies();
    const filteredBySegmentCompanies = companiesFilterBySubCategory.filter(item => {
      const segments = item.company.properties[catCode];
      const exist = segments.find((x: any) => x.code == segmentCode);
      return exist?.code == segmentCode;
    });
    return filteredBySegmentCompanies;
  }

}
