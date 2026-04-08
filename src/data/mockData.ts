import { Product, Promotion, PageLink } from '../types';

export const products: Product[] = [
  { id: '1', name: 'David 的咖啡壺 (使用過)', code: 'H9388001', testId: '260313Test_0001' },
  { id: '2', name: '0922DevS06changename', code: 'H9388001', testId: '0922DevS06' },
  { id: '3', name: '260108Test_0001', code: 'H9388001', testId: '260108Test_0001' },
  { id: '4', name: 'SIH2111TESTBYE_zh', code: 'H9388001', testId: 'SIH2111TESTBYE' },
  { id: '5', name: '【WM】小辣椒薑蒜包 (160-180g) - 1包', code: 'H9388001', testId: '251027TestC_0001' },
  { id: '6', name: '260107Test_0002 SKU 名稱 From OpenAPI', code: 'H9388001', testId: '260107Test_0002' },
];

export const promotions: Promotion[] = [
  { id: '1', name: '202511262 (ProductPromotion)', status: 'On-going', code: 'H9388001', date: 'MMS_MDQA_20251126_00002' },
  { id: '2', name: '20251126 (ProductPromotion)', status: 'On-going', code: 'H9388001', date: 'MMS_MDQA_20251126_00001' },
  { id: '3', name: 'Gift (FreeGiftPromotion)', status: 'On-going', code: 'H9388001', date: 'MMS_FP_20251120_112000' },
  { id: '4', name: 'Free Gift Promotion (FreeGiftPromotion)', status: 'On-going', code: 'H9388001', date: 'MMS_FP_20250922_00001' },
];

export const pageLinks: PageLink[] = [
  { id: '1', title: '3pl Management' },
  { id: '2', title: '3pl Management / Calculator' },
  { id: '3', title: '3pl Management / Contract' },
  { id: '4', title: '3pl Management / Fee Settings / Penalty Setting' },
  { id: '5', title: '3pl Management / Fee Settings / Subscription Settings' },
  { id: '6', title: '3pl Management / Fee Settings / Subscription Settings / Create Subscription' },
  { id: '7', title: '3pl Management / Fee Settings / Warehouse Fee Settings' },
  { id: '8', title: '3pl Management / Home' },
];
