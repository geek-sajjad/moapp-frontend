export interface Person {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface CreatePersonDto {
  name: string;
  phone?: string;
  address?: string;
}
