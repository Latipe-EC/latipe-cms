export interface ProductListGetVm {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  products: ProductGetVm[];

}

export interface ProductGetVm {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  productClassifications: ProductClassification[];
}

export interface ProductClassification {

  'id'?: string;
  'image'?: string;
  'name'?: string;
  'quantity'?: number;
  'price'?: number;
  'promotionalPrice'?: number;
  'sku'?: string;
  'code'?: string;
}

export interface ProductNameListVm {
  productNames: ProductNameGetVm[];

}

export interface ProductNameGetVm {
  name: string;
}