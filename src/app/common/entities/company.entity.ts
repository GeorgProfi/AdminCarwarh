import { ECompanyStatus } from '../enums/company-status.enum';

export class Company {
  id!: string;

  name!: string;

  description!: string;

  logoId!: string;

  paymentAccount!: string;

  score!: number;

  status!: ECompanyStatus;

  tariff!: number;

  defaultBonuses!: number;

  defaultCashback!: number;
}
