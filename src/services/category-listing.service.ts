import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { activeMemberLists, categoryColors, inactiveMemberList, largeSizedSlice, logoPadding, logoWidthHeight, totalCategories } from 'src/app/constant';
import { Category, CategoryItem, Company, CompanyImage, GeneralCategory, SingleCompanyCategory } from 'src/model/company';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryListingService {

  myFilterOptions = new Subject();

  constructor(private ul: UtilityService) { }

  getLogoInfo() {
    //Width= logo width + left padding + right padding.
    const logoWidth = logoWidthHeight + logoPadding + logoPadding;
    return { logoWidth };
  }

  getElementInfo(nativeElement: any, elementId: string) {
    const element = nativeElement.querySelector(`#${elementId}`);
    const height = element?.offsetHeight;
    return { element, height };
  }

  getSliceAngles(categoryLength: number) {
    return 180 / categoryLength;
  }

  getSliceAnglesOfLargeSize(categoryLength: number) {
    return 180 / categoryLength;
  }

  getCategoryTitleInfo() {
    //  height = height with padding + margin
    return 40 + 4;
  }

  getTotalRowsColumnsInSlice(height: number, sliceAngle: number) {
    const { logoWidth } = this.getLogoInfo();
    const categoryTitleHeight = this.getCategoryTitleInfo();

    // Here 2.5 is not logical value.. It's hit and try..
    let newHeight = height + categoryTitleHeight / 2.5;
    let width = this.ul.getWidthInAngle(newHeight, sliceAngle);
    const totalRows = Math.floor(newHeight / logoWidth) - 1; // minus 1 is the rows of title

    let totalRowsColumn = [];
    for (let i = 1; i <= totalRows; i++) {
      const rowItems = Math.floor(width / logoWidth);
      totalRowsColumn.push(rowItems);

      newHeight = newHeight - logoWidth;
      width = this.ul.getWidthInAngle(newHeight, sliceAngle);
    }

    return totalRowsColumn;
  }

  getTotalLogosInASlice(totalRowsColumn: any) {
    return totalRowsColumn.reduce((total: number, current: number) => total + current, 0);
  }

  getBackgroundColor(index: number) {
    const colorIndex = index % categoryColors.length;
    const bgColor = categoryColors[colorIndex];
    return bgColor;
  }

  getSliceContent(categoryImages: CompanyImage[], totalRowsColumn: number[]) {

    let categoryItemDetail = [];
    let remainingImages = categoryImages;
    let imgLength = categoryImages.length;
    if (imgLength > 0) {
      for (let j = 0; j < totalRowsColumn.length; j++) {
        let item = totalRowsColumn[j]
        const images = remainingImages.slice(0, item);
        let logos: CategoryItem[] = [];
        for (let i = 0; i < item; i++) {
          const url = images[i]?.imageUrl;
          const cName = images[i]?.companyName;
          if (images[i]) {
            let categoryItem = {
              logoUrl: url,
              companyName: cName,
              companyImage: images[i],
              shortName: this.ul.getFirstLetterString(cName),
              logoInSvg: images[i]?.company?.properties['logoinsvg']?.uri
            };
            logos.push(categoryItem);
          }
        }
        if (logos.length > 0) categoryItemDetail.push(logos);
        remainingImages.splice(0, item);;
      }
    }
    return { sliceContent: categoryItemDetail };
  }

  getImagesInCategory(logosList: any, category: any) {
    const categoryImages = logosList.filter((logoItem: any) => {
      const categories = logoItem.categories;
      const itemExist = categories?.filter((item: any) => item.code === category.code);
      return itemExist?.length > 0;
    });
    return categoryImages;
  }

  getLargeSizedAndSmallSizedAngle(itemLength: number) {
    const largeSizedSliceAngle = this.getSliceAnglesOfLargeSize(largeSizedSlice);
    const smallSizedSliceAngle = this.getSliceAnglesOfLargeSize(itemLength - largeSizedSlice);
    return { lsAngle: largeSizedSliceAngle, ssAngle: smallSizedSliceAngle };
  }

  getTotalImagesOfCompanies(value: Company[]) {
    const imageRes = value.filter((item: any) => item?.properties?.general && item?.properties?.general.length > 0);
    const images: CompanyImage[] = imageRes.map((item: any) => {
      let object = {
        id: item.id,
        categories: item.properties?.general,
        imageUrl: item?.image?.filename,
        companyName: item.name,
        company: item
      };
      return object;
    });
    return images;
  }

  getUniqueCategories(newValue: Array<any>): GeneralCategory[] {
    let newCategories: GeneralCategory[] = [];
    for (let data of newValue) {
      for (let item of data) {
        let itemDetail: GeneralCategory = {
          code: item.code,
          title: item.title.en,
          images: []
        }
        newCategories.push(itemDetail);
      }
    }

    let uniqueArr = newCategories.filter((obj: any, index: number, self) =>
      index === self.findIndex((t) => t.code === obj.code)
    );

    return uniqueArr;
  }

  getAllCategoriesAllImagesFromResponse(value: Company[]) {
    // Keeps Categories here..
    const newData = value.map((item: Company) => item.properties?.general);
    const newValue = newData.filter((item: any) => (item != undefined && item.length > 0));
    const categories = this.getUniqueCategories(newValue);
    const images = this.getTotalImagesOfCompanies(value);
    return { images, categories };
  }

  getCategoriesWithImages(images: CompanyImage[], categories: GeneralCategory[]) {
    let newCategories: GeneralCategory[] = [];
    for (let category of categories) {
      const catImages = this.getImagesInCategory(images, category);
      let data: GeneralCategory = {
        ...category,
        images: catImages,
      }
      newCategories.push(data);
    }
    return newCategories;
  }

  getSortedCategories(categories: GeneralCategory[]) {
    let sortedCat = categories.sort((a, b) => b.images.length - a.images.length);
    return sortedCat;
  }

  getSliceAngleByIndex(lsAngle: number, ssAngle: number, index: number) {
    let sliceAngle;
    if (index < largeSizedSlice) {
      sliceAngle = lsAngle;
    } else {
      sliceAngle = ssAngle;
    }
    return sliceAngle;
  }

  getCategoryWithSliceAngle(index: number, lsAngle: number, ssAngle: number, category: any) {
    let catWithSliceAngle: GeneralCategory;
    if (index < largeSizedSlice) {
      catWithSliceAngle = { sliceAngle: lsAngle * index, ...category };
    } else {
      let newIndex = (index - largeSizedSlice);
      const angleReached = lsAngle * (largeSizedSlice);
      const angle = angleReached + ssAngle * newIndex;
      catWithSliceAngle = { sliceAngle: angle, ...category };
    }
    return catWithSliceAngle;
  }

  removeDuplicateItems(categories: Category[], imagesToBeUpdate: CompanyImage[]) {
    const duplicateRemovedValue: CompanyImage[] = [];
    for (let item of imagesToBeUpdate) {
      // const exist = this.isItemExist(categories, item);
      // if (!exist) {
      //   duplicateRemovedValue.push(item);
      // }
      duplicateRemovedValue.push(item);
    }
    return duplicateRemovedValue;
  }

  getExistingImages(item: Category): CategoryItem[] {
    const existingImages: CategoryItem[] = item.categoryItems.reduce((accumulator: CategoryItem[], currentValue: CategoryItem[]) => {
      return accumulator = [...accumulator, ...currentValue];
    }, []);
    return existingImages;
  }

  isItemExist(categories: Category[], checkItem: CompanyImage) {
    let exist = false;
    for (let item of categories) {
      const existingImages = this.getExistingImages(item);
      const imageUrl = checkItem.imageUrl;
      const existItem = existingImages.find(image => {
        return image.logoUrl == imageUrl
      });

      if (existItem) {
        exist = true;
        break;
      }
    }
    return exist;
  }

  extractProvinceState(value: Company[]) {
    const provinceValue = value.map(x => x.properties['provincestate']);
    const state = provinceValue.filter(x => (typeof x === 'object' && x.hasOwnProperty("code")));
    const uniqueArray = Array.from(state.reduce((map, obj) => {
      if (!map.has(obj.code)) map.set(obj.code, obj);
      return map;
    }, new Map()).values());
    const states = uniqueArray.filter((x: any) => x.title.hasOwnProperty("en"));
    const provinceState = states.map((item: any) => {
      const province: SingleCompanyCategory = {
        ...item,
      }
      return province;
    });

    const sortedArray = provinceState.sort((a, b) => {
      const as = a.title.en.toLowerCase();
      const bs = b.title.en.toLowerCase();
      if (as.includes('other')) {
        return 1; // move a to the end of the array
      } else if (bs.includes('other')) {
        return -1; // move b to the end of the array
      } else {
        return 0; // leave the order of a and b unchanged
      }
    });

    return sortedArray;
  }

  extractTargetCustomer(value: Company[]) {
    const targetCustomer = value.map(x => x.properties['targetcustomer']);
    const state = targetCustomer.filter(x => (typeof x === 'object' && x));
    const allTargetCustomer = state.reduce((acc, cur) => {
      acc = [...acc, ...cur];
      return acc;
    }, []);
    const uniqueArray = Array.from(allTargetCustomer.reduce((map: any, obj: any) => {
      if (!map.has(obj.code)) map.set(obj.code, obj);
      return map;
    }, new Map()).values());

    const targetCustomers = uniqueArray.map((item: any) => {
      const province: SingleCompanyCategory = {
        ...item,
      }
      return province;
    });
    return targetCustomers;
  }

  filterCompaniesByProvinceState(allCompanies: Company[], provinceState: string) {
    const companiesWithProvinces = allCompanies.filter(item => {
      const tc = item.properties['provincestate'];
      return typeof tc === 'object' && tc.hasOwnProperty("code");
    });
    const filteredCompanies = companiesWithProvinces.filter(x => {
      const ps = x.properties['provincestate'];
      return ps.code == provinceState.toLowerCase();
    });
    return filteredCompanies;
  }

  filterCompaniesByTargetCustomer(allCompanies: Company[], targetCustomer: string) {
    const filteredCompanies = allCompanies.filter(item => {
      const tc = item.properties['targetcustomer'];
      let isTc = false;
      if (tc?.length > 0) {
        const findTc = tc.find((item: any) => {
          return item.code === targetCustomer.toLowerCase();
        });
        if (findTc) { isTc = true }
        else isTc = false;
      }

      return isTc;
    });
    return filteredCompanies;
  }

  getActiveNonActiveMembers(allCompanies: Company[], activeInactive: string) {
    let companies: Company[] = [];
    if (activeInactive == 'active') {
      companies = allCompanies.filter(item => {
        const title = item.membershipType.title.toLocaleLowerCase();
        const isActive = activeMemberLists.find(mType => title.includes(mType));
        return isActive && isActive != undefined;
      });
    } else {
      companies = allCompanies.filter(item => {
        const title = item.membershipType.title.toLocaleLowerCase();
        const isActive = inactiveMemberList.find(mType => title.includes(mType));
        return isActive && isActive != undefined;
      });
    }
    return companies;
  }

  setFilterOptionValue(data: any) {
    this.myFilterOptions.next(data)
  }
}

