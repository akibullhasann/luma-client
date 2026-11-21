export type { SignInFormValues, SignUpFormValues } from "./auth";
export type { DashboardMenuItem, DashboardRole } from "./dashboard";
export type {
  ServiceStatus,
  ServiceFormValues,
  FormErrors,
  FieldProps,
  IconInputProps,
} from "./service";


export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export type Appointment = {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceImage: string;
  serviceCategory: string;
};