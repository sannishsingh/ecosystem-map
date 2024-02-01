
export interface Company {
    address: CompanyAddress,
    adminContact: AdminContact,
    companyWebsiteAddress: string,
    featured: boolean,
    id: number,
    image: MemberImage,
    members: Member[],
    membershipId: number,
    membershipType: MemberShipType,
    name: string,
    properties: CompanyProperty,
    startDate: string;
    code?: string
}

interface CompanyAddress {
    cityName: string,
    country: CountryInfo,
    streetAddress: string,
    zipCode: string
}

interface CountryInfo {
    code: string,
}

interface AdminContact {
    emailAddress: MemberEmail,
    familyName: string,
    givenName: string,
    language: MemberLanguage,
    phoneNumber: MemberPhone,
    positionTitle: string
}

interface MemberLanguage {
    code: string
}

interface Member {
    emailAddress: MemberEmail,
    familyName: string,
    featured: boolean,
    givenName: string,
    id: number,
    membershipId: number,
    phone: MemberPhone,
    positionTitle: string,
    primary: boolean,

}

interface MemberEmail {
    value: string;
}
interface MemberPhone {
    value: string;
}

interface MemberImage {
    filename: string;
    id: string;
    uri: string;
}

interface MemberShipType {
    id: number;
    title: string;
    type: string;
}

export interface CompanyResponse {
    errors: any[],
    metadata: any,
    warning: any[],
    value: Array<Company>
}

interface CompanyProperty {
    general: any,
    [key: string]: any;
}

//  Customized model
export interface Category {
    backgroundColor: string,
    categoryItems: CategoryItem[][],
    categoryName: string,
    sliceAngle: number,
    companies: CompanyImage[],
    code: string
}

export interface CategoryItem {
    logoUrl: string;
    companyName: string;
    shortName: string;
    companyImage: CompanyImage;
    categoryCode?: string;
    logoInSvg: string
}

export interface GeneralCategory {
    code: string;
    title: string;
    images: CompanyImage[],
    sliceAngle?: number
}

export interface CompanyImage {
    id: string;
    categories: any;
    imageUrl: string;
    companyName: string;
    company: Company,
    subCategories?: string[],
    segments?: string[]
}

export interface SubCategoryWithValue {
    property: string;
    title: string;
    value: number;
}

export interface SeriesDataEmphasis {
    itemStyle?: {
        borderWidth: number,
        borderColor: string
    },
    offset?: number
}

export interface ChartSeriesData {
    code: string;
    name: string;
    value: number;
    emphasis?: SeriesDataEmphasis,
    itemStyle?: any
}

export interface TableElement {
    category: string;
    company: string;
    subCategory: string;
    segment: string;
    type: string;
    state: string;
}

export interface SubCategory {
    tittle: string;
    property: string;
}

export interface SingleCompanyCategory {
    code: string;
    title: {
        en: string
    }
}