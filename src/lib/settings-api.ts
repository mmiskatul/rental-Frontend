import { apiRequest } from "@/lib/api";

export type AdminSettings = {
  business: {
    companyName: string;
    supportEmail: string;
    supportPhone: string;
    businessHours: string;
    hqAddress: string;
    about: string;
  };
  bookingPolicy: {
    autoApproveVerifiedCustomers: boolean;
    requireDeposit: boolean;
    allowSameDayBookings: boolean;
    enforceMinimumRentalPeriod: boolean;
  };
  cancellation: {
    freeCancellationHours: number;
    lateCancellationFeePercent: number;
    noShowFee: string;
    refundProcessingTime: string;
  };
  pricing: {
    serviceFeePercent: number;
    taxRatePercent: number;
    weeklyDiscountPercent: number;
    monthlyDiscountPercent: number;
  };
  notifications: {
    emailNewBookings: boolean;
    smsUrgentAlerts: boolean;
    dailySummaryReport: boolean;
  };
  updatedAt: string;
};

type ApiAdminSettings = {
  business: {
    company_name: string;
    support_email: string;
    support_phone: string;
    business_hours: string;
    hq_address: string;
    about: string;
  };
  booking_policy: {
    auto_approve_verified_customers: boolean;
    require_deposit: boolean;
    allow_same_day_bookings: boolean;
    enforce_minimum_rental_period: boolean;
  };
  cancellation: {
    free_cancellation_hours: number;
    late_cancellation_fee_percent: number;
    no_show_fee: string;
    refund_processing_time: string;
  };
  pricing: {
    service_fee_percent: number;
    tax_rate_percent: number;
    weekly_discount_percent: number;
    monthly_discount_percent: number;
  };
  notifications: {
    email_new_bookings: boolean;
    sms_urgent_alerts: boolean;
    daily_summary_report: boolean;
  };
  updated_at: string;
};

export async function getAdminSettings() {
  const settings = await apiRequest<ApiAdminSettings>("/api/admin/settings");
  return mapApiSettings(settings);
}

export async function updateAdminSettings(settings: AdminSettings) {
  const updated = await apiRequest<ApiAdminSettings>("/api/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(mapSettingsToApi(settings)),
  });
  return mapApiSettings(updated);
}

function mapApiSettings(settings: ApiAdminSettings): AdminSettings {
  return {
    business: {
      companyName: settings.business.company_name,
      supportEmail: settings.business.support_email,
      supportPhone: settings.business.support_phone,
      businessHours: settings.business.business_hours,
      hqAddress: settings.business.hq_address,
      about: settings.business.about,
    },
    bookingPolicy: {
      autoApproveVerifiedCustomers: settings.booking_policy.auto_approve_verified_customers,
      requireDeposit: settings.booking_policy.require_deposit,
      allowSameDayBookings: settings.booking_policy.allow_same_day_bookings,
      enforceMinimumRentalPeriod: settings.booking_policy.enforce_minimum_rental_period,
    },
    cancellation: {
      freeCancellationHours: settings.cancellation.free_cancellation_hours,
      lateCancellationFeePercent: settings.cancellation.late_cancellation_fee_percent,
      noShowFee: settings.cancellation.no_show_fee,
      refundProcessingTime: settings.cancellation.refund_processing_time,
    },
    pricing: {
      serviceFeePercent: settings.pricing.service_fee_percent,
      taxRatePercent: settings.pricing.tax_rate_percent,
      weeklyDiscountPercent: settings.pricing.weekly_discount_percent,
      monthlyDiscountPercent: settings.pricing.monthly_discount_percent,
    },
    notifications: {
      emailNewBookings: settings.notifications.email_new_bookings,
      smsUrgentAlerts: settings.notifications.sms_urgent_alerts,
      dailySummaryReport: settings.notifications.daily_summary_report,
    },
    updatedAt: settings.updated_at,
  };
}

function mapSettingsToApi(settings: AdminSettings) {
  return {
    business: {
      company_name: settings.business.companyName,
      support_email: settings.business.supportEmail,
      support_phone: settings.business.supportPhone,
      business_hours: settings.business.businessHours,
      hq_address: settings.business.hqAddress,
      about: settings.business.about,
    },
    booking_policy: {
      auto_approve_verified_customers: settings.bookingPolicy.autoApproveVerifiedCustomers,
      require_deposit: settings.bookingPolicy.requireDeposit,
      allow_same_day_bookings: settings.bookingPolicy.allowSameDayBookings,
      enforce_minimum_rental_period: settings.bookingPolicy.enforceMinimumRentalPeriod,
    },
    cancellation: {
      free_cancellation_hours: settings.cancellation.freeCancellationHours,
      late_cancellation_fee_percent: settings.cancellation.lateCancellationFeePercent,
      no_show_fee: settings.cancellation.noShowFee,
      refund_processing_time: settings.cancellation.refundProcessingTime,
    },
    pricing: {
      service_fee_percent: settings.pricing.serviceFeePercent,
      tax_rate_percent: settings.pricing.taxRatePercent,
      weekly_discount_percent: settings.pricing.weeklyDiscountPercent,
      monthly_discount_percent: settings.pricing.monthlyDiscountPercent,
    },
    notifications: {
      email_new_bookings: settings.notifications.emailNewBookings,
      sms_urgent_alerts: settings.notifications.smsUrgentAlerts,
      daily_summary_report: settings.notifications.dailySummaryReport,
    },
  };
}
