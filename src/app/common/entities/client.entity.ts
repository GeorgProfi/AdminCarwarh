export interface Client {
  id: string;
  carWashId: string;
  name: string;
  sex: boolean; // male = true
  phone: string;
  dateOfRegistration: Date;
  email: string;
  cardId: string;
  enablePush: boolean;
  enableSms: boolean;
}
