export interface ContactEmail {
  id: number;
  email: string;
  description?: string;
}

export interface ContactPhone {
  id: number;
  number: string;
  description?: string;
}

export interface ContactAddress {
  id: number;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
  complement?: string;
  description?: string;
}

export interface ContactCategory {
  id: number;
  name: string;
}

export interface ExternalContact {
  id: string;
  name: string;
  surname?: string;
  isFavorite: boolean;
  photoName?: string;
  birthday?: Date;
  observation?: string;
  emails: ContactEmail[];
  categories: ContactCategory[];
  phones: ContactPhone[];
  addresses: ContactAddress[];
}

export default interface Contact {
  id: number;
  externalId: string;
  name: string;
  surname?: string;
  isFavorite: boolean;
  photoName?: string;
  birthday?: Date;
  observation?: string;
  emails: ContactEmail[];
  categories: ContactCategory[];
  phones: ContactPhone[];
  addresses: ContactAddress[];
}
