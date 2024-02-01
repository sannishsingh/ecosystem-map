import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { categoriesSubCategories, categoryColors } from 'src/app/constant';
import { Category, ChartSeriesData, CompanyImage, SingleCompanyCategory, SubCategory, SubCategoryWithValue } from 'src/model/company';

@Injectable({
  providedIn: 'root'
})
export class CategoryDialogService {

  constructor() { }

  getSubcategoriesByCatCode(code: string) {
    const cat = categoriesSubCategories.find(cat => cat.code === code);
    return cat?.subCategories;
  }

  getSubcategories(subCat: any) {
    const subCategories: Array<SubCategory> = subCat.map((item: any) => {
      let newItem: SubCategory = {
        tittle: item.title,
        property: item.property
      }
      return newItem;
    });
    return subCategories;
  }

  getSubCatWithValue(subCat: Array<{ property: string; title: string }> | undefined, category: Category) {

    let subCatWithValue: Array<SubCategoryWithValue> = [];
    if (subCat != undefined) {
      for (let item of subCat) {
        const property = item.property;
        const total = category.companies.filter(companyItem => {
          const prop = companyItem.company.properties[property];
          return prop?.length > 0;
        });

        let newItem = {
          ...item,
          value: total.length
        }
        subCatWithValue.push(newItem);
      }
    }
    return subCatWithValue;

  }

  prepareChartSeriesData(subCategory: SubCategoryWithValue[]) {
    let data: ChartSeriesData[] = [];
    for (let item of subCategory) {
      let index = subCategory.indexOf(item);
      const bgColor = this.getBackgroundColor(index);
      let dataItem: ChartSeriesData = {
        code: item.property,
        name: item.title,
        value: item.value,
        itemStyle: { color: bgColor },
      }
      data.push(dataItem);
    }
    return data;
  }

  prepareChartSegmentSeriesData(segments: any[]) {
    let data: ChartSeriesData[] = [];
    for (let item of segments) {
      let index = segments.indexOf(item);
      const bgColor = this.getBackgroundColor(index);
      let dataItem: ChartSeriesData = {
        code: item.code,
        name: item.title.en,
        value: item.count,
        itemStyle: { color: bgColor },
      }
      data.push(dataItem);
    }
    return data;
  }

  getAllSegments(code: string, category: Category) {
    const segments = category.companies.filter(item => {
      const length = item.company.properties[code]?.length;
      return length && length > 0;
    });
    const getSegments = segments.map(item => item.company.properties[code]);

    const allSegments = getSegments.reduce((accumulator, currentValue) => {
      return accumulator = [...accumulator, ...currentValue];
    }, []);

    const uniqueSegments = allSegments.reduce((acc: any, item: any) => {
      const existingItem = acc.find((i: any) => i.code === item.code);
      if (existingItem) {
        existingItem.count++;
      } else {
        acc.push({ ...item, count: 1 });
      }
      return acc;
    }, []);

    return uniqueSegments;
  }

  activateSelectedSlice(params: any, chartInstance: any, chartOption: EChartsOption) {
    let dataIndex = params.dataIndex;
    let series = chartInstance.getOption().series[0];
    for (var i = 0; i < series.data.length; i++) {
      series.data[i].selected = false;
    }
    series.data[dataIndex].selected = true;
    // Update the chart
    chartInstance.setOption(chartOption);
  }

  resetAllSliceHighlight(chartInstance: any, event: any) {
    // get the options object
    const options = chartInstance.getOption();
    const seriesData = options.series[0].data;
    const totalSlices = seriesData.length;
    for (let i = 0; i < totalSlices; i++) {
      // Reset the highlight state
      chartInstance.dispatchAction({
        type: 'downplay',
        seriesIndex: event.seriesIndex,
        dataIndex: i,
      });
    }
  }

  HighlightSingleSlice(chartInstance: any, event: any) {
    chartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: event.seriesIndex,
      dataIndex: event.dataIndex,
    });

  }

  resetSelectedSliceOffset(chartInstance: any, event: any) {
    let options = chartInstance.getOption();
    options.series.forEach((series: any) => {
      if (series.type === 'pie') {
        series.selectedOffset = 0;
      }
    });
    chartInstance.setOption(options);

    // above code change offset and below code changes selected state. 
    chartInstance.dispatchAction({
      type: 'unselect',
      seriesIndex: event.seriesIndex,
      dataIndex: event.dataIndex,
    });

  }

  setSelectedSliceOffset(chartInstance: any, event: any) {
    let options = chartInstance.getOption();
    options.series.forEach((series: any) => {
      if (series.type === 'pie') {
        series.selectedOffset = 10;
      }
    });
    chartInstance.setOption(options);

  }

  showFirstSliceLabel(chartInstance: any) {
    const event = {
      seriesIndex: 0,
      dataIndex: 0,
    }
    this.HighlightSingleSlice(chartInstance, event);
  }

  getBackgroundColor(index: number) {
    const colorIndex = index % categoryColors.length;
    const bgColor = categoryColors[colorIndex];
    return bgColor;
  }
}
