import { EChartsOption } from "echarts/types/dist/echarts";
import { TableElement } from "src/model/company";

export const categoryColors: Array<string> = [
    '#5e17eb',
    '#91efff',
    '#f53e3e',
    '#00bf63',
    '#fa9949',
    '#3ba2ad',
    '#2c3e51'
];

export const activeMemberLists = ['founding', 'startup', 'scaleup', 'enterprise', 'international scaleup', 'international enterpris'];

export const inactiveMemberList = ['free tier'];

export const categoriesSubCategories = [
    {
        title: 'Digital Lending',
        code: 'digital-lending',
        subCategories: [
            {
                property: 'digitallendingdebtbasedsecurit',
                title: 'Debt-Based Securities'
            },
            {
                property: 'digitallendingbalancesheetlend',
                title: 'Balance Sheet Lending'
            },
            {
                property: 'digitallendingp2pmarketplacele',
                title: 'P2P/ Marketplace Lending'
            }
        ]
    },
    {
        title: 'Digital Capital Raising',
        code: 'digital-capital-raising',
        subCategories: [
            {
                property: 'investmentbasedcrowdfunding',
                title: 'Investment-Based CrowdFunding'
            },
            {
                property: 'noninvestmentbasedcrowdfunding',
                title: 'Non Investment-Based CrowdFunding'
            }
        ]
    },
    {
        title: 'Digital Banks',
        code: 'digital-banks',
        subCategories: [
            {
                property: 'retailfacing',
                title: 'Retail-Facing'
            },
            {
                property: 'msmefacing',
                title: 'MSME-Facing'
            },
            {
                property: 'otherdigitalbanking',
                title: 'Other Digital Banking'
            }
        ]
    },
    {
        title: 'Digital Savings',
        code: 'digital-savings',
        subCategories: [
            {
                property: 'digitalsavings',
                title: 'Digital Savings'
            }
        ]
    },
    {
        title: 'Digital Payments',
        code: 'digital-payments',
        subCategories: [
            {
                property: 'paymentservices',
                title: 'Payment Services'
            },
            {
                property: 'stablecoinissuance',
                title: 'Stablecoin Issuance'
            },
            {
                property: 'cryptoassetpayments',
                title: 'Cryptoasset Payments'
            },
            {
                property: 'backendservices',
                title: 'Backend Services'
            },
            {
                property: 'otherdigitalpayments',
                title: 'Other digital Payments'
            }
        ]
    },
    {
        title: 'Cryptoasset Exchange',
        code: 'cryptoasset-exchange',
        subCategories: [
            {
                property: 'intermediationbrokerage',
                title: 'Intermediation & Brokerage'
            },
            {
                property: 'otherfinancialtransactionproce',
                title: 'Other Financial Transaction Processing'
            },
            {
                property: 'trading',
                title: 'Trading'
            }
        ]
    },
    {
        title: 'Digital Custody',
        code: 'digital-custody',
        subCategories: [
            {
                property: 'retailcustody',
                title: 'Retail Custody'
            },
            {
                property: 'institutionalcustody',
                title: 'Institutional Custody'
            },
            {
                property: 'otherdigitalcustody',
                title: 'Other Digital Custody'
            }
        ]
    },
    {
        title: 'InsurTech',
        code: 'insurtech',
        subCategories: [
            {
                property: 'insurtechsubcategories',
                title: 'Insurtech Subcategories'
            }
        ]
    },
    {
        title: 'WealthTech',
        code: 'wealthtech',
        subCategories: [
            {
                property: 'assetmanagement',
                title: 'Asset Management'
            },
            {
                property: 'personalfinancialservices',
                title: 'Personal Financial Services'
            }
        ]
    },
    {
        title: 'RegTech',
        code: 'regtech',
        subCategories: [
            {
                property: 'regtechsubcategories',
                title: 'Regtech Subcategories'
            }
        ]
    },
    {
        title: 'Alternative Credit Analytics',
        code: 'alternative-credit-analytics',
        subCategories: [
            {
                property: 'alternativecreditanalyticscate',
                title: 'Alternative Credit Analytics Subcategories'
            }
        ]
    },
    {
        title: 'Digital Identity',
        code: 'digital-identity',
        subCategories: [
            {
                property: 'digitalidentitycategories',
                title: 'Digital Identity Subcategories'
            }
        ]
    },
    {
        title: 'Tech. for Fintech or Enterprise',
        code: 'tech-for-fintech-or-enterprise',
        subCategories: [
            {
                property: 'techforenterprisecategories',
                title: 'Tech.for Enterprise/ Financial Services/ Fintechs Subcategories'
            }
        ]
    },
    {
        title: 'Consensus Services',
        code: 'consensus-services',
        subCategories: [
            {
                property: 'consensusservicessubcategories',
                title: 'Consensus Services Subcategories'
            }
        ]
    },
    {
        title: 'Sustainability',
        code: 'sustainability',
        subCategories: [
            {
                property: 'sustainability',
                title: 'Sustainability Services'
            }
        ]
    }
];

export const commonChartConfig = {
    type: 'pie',
    radius: ['60%', '80%'],
    avoidLabelOverlap: false,
    label: {
        show: false,
        position: 'center'
    },
    emphasis: {
        label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            formatter: (params: any) => {
                let labelName = params.name;
                const words = labelName.split(' ');
                if (words.length > 3) {
                    labelName = words.slice(0, 3).join(' ') + '\n' + words.slice(3).join(' ');
                }
                return params.percent + '%' + '\n' + labelName;
            }
        }
    },
    labelLine: {
        show: false
    },
    data: [],
    selectedMode: 'single',
    selectedOffset: 10,
}

export const TableColumns = ['company', 'category', 'subCategory', 'segment', 'type', 'state'];

export const subCategoryChartOption = {
    series: [
        {
            ...commonChartConfig,
            data: []
        }
    ]
} as EChartsOption;

export const segmentChartOption = {
    series: [
        {
            ...commonChartConfig,
            data: []
        }
    ]
} as EChartsOption;


export const logoWidthHeight = 40;
export const logoPadding = 4;
export const largeSizedSlice = 6;
export const totalCategories = 14; // We need this for get category color
