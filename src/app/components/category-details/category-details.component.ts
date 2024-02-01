import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Category, ChartSeriesData, CompanyImage, SubCategory } from 'src/model/company';
import { EChartsOption } from 'echarts';
import { CategoryDialogService } from 'src/services/category-dialog.service';
import { segmentChartOption, subCategoryChartOption, TableColumns } from 'src/app/constant';
import { MemberDetailsComponent } from '../member-details/member-details.component';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {

  category: Category;
  logoBaseUrl = environment.logoBaseUrl;
  subCategories: Array<SubCategory> = [];
  chartOption1: EChartsOption = subCategoryChartOption;
  chartOption2: EChartsOption = segmentChartOption;
  displayedColumns: string[] = TableColumns;
  selectedSubCategory!: ChartSeriesData;
  selectedSegment!: ChartSeriesData;
  showSegmentChart: boolean = false;
  chartInstance1: any;
  chartInstance2: any;
  companies: Array<CompanyImage> = [];
  searchQuery: string = '';
  filteredData: Array<CompanyImage> = [];
  segmentClickedDataIndex: number | undefined;
  segmentClickedEvent: any;
  isMobile!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cds: CategoryDialogService,
    private deviceService: DeviceDetectorService,
    public dialog: MatDialog
  ) {
    this.category = data.category;
    this.prepareSubCategory();
    this.getDeviceInfo();
  }

  ngOnInit() {

  }

  getDeviceInfo() {
    this.isMobile = this.deviceService.isMobile();
  }
  onChartClick(params: any) {
    // Reset top filter
    this.searchQuery = '';

    this.cds.activateSelectedSlice(params, this.chartInstance1, this.chartOption1);
    this.selectedSubCategory = params.data;
    this.segmentClickedEvent = params;
    const { code } = this.selectedSubCategory;
    const segments = this.cds.getAllSegments(code, this.category);
    this.prepareSegmentSeriesData(segments);
    this.getNewCompanies();
    // setTimeout(() => this.cds.showFirstSliceLabel(this.chartInstance2), 100);
  }

  onCatChartInit(ec: any) {
    this.chartInstance1 = ec;
  }

  onSegChartInit(ec: any) {
    this.chartInstance2 = ec;
  }

  onSegmentClick(event: any) {
    // Reset top filter
    this.searchQuery = '';

    this.selectedSegment = event.data;
    this.segmentClickedEvent = event;
    this.getNewCompanyWithFilterBySegment();
    const index = this.toggleSegmentSliceClick(event);
    // reset all
    if (typeof index !== 'undefined' && index >= 0) {
      this.cds.setSelectedSliceOffset(this.chartInstance2, event);
    }
  }

  companyDetail(element: any) {
    const member = {
      ...element.company,
      code: this.category.code
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

  segmentChartRendered(event: any) {
    console.log(event);
  }

  toggleSegmentSliceClick(event: any) {
    let dataIndex = event.dataIndex;
    if (this.segmentClickedDataIndex == dataIndex) {
      this.segmentClickedDataIndex = undefined;
      this.clearSegmentFilter();
    } else {
      this.segmentClickedDataIndex = dataIndex
    }
    return this.segmentClickedDataIndex;
  }

  clearSearch() {
    this.searchQuery = '';
    this.search();
  }

  prepareSubCategory() {
    const subCat = this.cds.getSubcategoriesByCatCode(this.category.code);
    if (subCat) {
      this.subCategories = this.cds.getSubcategories(subCat);
    }

    this.prepareCompaniesWithSubCatAndSegment(this.category.companies);
    const catWithValue = this.cds.getSubCatWithValue(subCat, this.category);
    const seriesData = this.cds.prepareChartSeriesData(catWithValue);
    if (this.chartOption1.series != null && Array.isArray(this.chartOption1.series)) {
      this.chartOption1.series[0].data = [...seriesData];
    }

    // setTimeout(() => this.cds.showFirstSliceLabel(this.chartInstance1), 1000);
  }

  prepareSegmentSeriesData(segments: any) {
    this.showSegmentChart = true;
    const seriesData = this.cds.prepareChartSegmentSeriesData(segments);
    if (this.chartOption2.series != null && Array.isArray(this.chartOption2.series)) {
      this.chartOption2.series[0].data = [...seriesData];
    }
  }


  clearSegmentChart() {
    // clear if segment filter is there..
    this.clearSegmentFilter();

    this.showSegmentChart = false;
    this.selectedSubCategory = {} as ChartSeriesData;
    this.prepareCompaniesWithSubCatAndSegment(this.category.companies);
    // setTimeout(() => this.cds.showFirstSliceLabel(this.chartInstance1), 1000);

  }

  clearSegmentFilter() {
    this.getNewCompanies();
    this.selectedSegment = {} as ChartSeriesData;

    // Clear chart selected as well
    this.cds.resetSelectedSliceOffset(this.chartInstance2, this.segmentClickedEvent);
    this.segmentClickedDataIndex = undefined;
  }

  prepareCompaniesWithSubCatAndSegment(companies: CompanyImage[]) {
    let newCompanies: Array<CompanyImage> = [];
    for (let item of companies) {
      const { properties } = item.company;
      const index = companies.indexOf(item);
      let tempSubCat: Array<string> = [];
      let segments: Array<string> = [];

      for (let subCat of this.subCategories) {
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

      let newCompanyImage: CompanyImage = {
        ...item,
        subCategories: tempSubCat,
        segments: segments
      }
      newCompanies.push(newCompanyImage);

    }

    this.companies = newCompanies;
    this.search();
  }

  getNewCompanies() {
    const { code } = this.selectedSubCategory;
    const newCompanies = this.category.companies;
    const filteredCompanies = newCompanies.filter(item => item.company.properties[code]?.length > 0);
    this.prepareCompaniesWithSubCatAndSegment(filteredCompanies);
    return filteredCompanies;
  }

  getNewCompanyWithFilterBySegment() {
    const { code: catCode } = this.selectedSubCategory;
    const { code: segmentCode } = this.selectedSegment;
    const companiesFilterBySubCategory = this.getNewCompanies();
    const filteredBySegmentCompanies = companiesFilterBySubCategory.filter(item => {
      const segments = item.company.properties[catCode];
      const exist = segments.find((x: any) => x.code == segmentCode);
      return exist?.code == segmentCode;
    });
    this.prepareCompaniesWithSubCatAndSegment(filteredBySegmentCompanies);
  }

  search() {
    if (this.searchQuery) {
      this.filteredData = this.companies.filter(item => {
        return item.company.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    } else {
      this.filteredData = this.companies;
    }

  }
}
