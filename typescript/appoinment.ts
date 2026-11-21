export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

// type that will be send to the backend
export type AppointmentFormValues = {
  serviceId: string;
  customerId: string;
  appointmentDate: string; // "2026-11-25"
  timeSlot: string;        // "10:30" (২৪ ঘণ্টা)
  message?: string;
};

// return from the server 
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