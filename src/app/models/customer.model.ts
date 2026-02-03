export interface Customer {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  phoneNumber: string;
  isArchived: boolean;
  userId: string;
}

export interface CreateCustomerDto {
  name: string;
  description?: string;
  phoneNumber: string;
}

export interface UpdateCustomerDto {
  name?: string;
  description?: string;
  phoneNumber?: string;
}
