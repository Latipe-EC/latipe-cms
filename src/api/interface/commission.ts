export interface CreateCommissionRequest {
  name: string;
  feeOrder: number;
  minPoint: number;
}

export interface UpdateCommissionRequest {
  id: string;
  name: string;
  feeOrder: number;
  minPoint: number;
}

export interface CommissionResponse {
  id?: string;
  name: string;
  feeOrder: number;
  minPoint: number;
}

