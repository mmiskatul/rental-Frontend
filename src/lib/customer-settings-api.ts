import { apiRequest } from "@/lib/api";

export type CustomerSettings = {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  preferences: {
    bookingConfirmations: boolean;
    promotionalEmails: boolean;
    smsReminders: boolean;
  };
  stats: {
    totalBookings: number;
    totalSpend: number;
    averageRating: number;
  };
  updatedAt: string;
};

type ApiCustomerSettings = {
  profile: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  preferences: {
    booking_confirmations: boolean;
    promotional_emails: boolean;
    sms_reminders: boolean;
  };
  stats: {
    total_bookings: number;
    total_spend: number;
    average_rating: number;
  };
  updated_at: string;
};

export async function getCustomerSettings() {
  const settings = await apiRequest<ApiCustomerSettings>("/api/customer/settings");
  return mapApiSettings(settings);
}

export async function updateCustomerSettings(settings: CustomerSettings) {
  const updated = await apiRequest<ApiCustomerSettings>("/api/customer/settings", {
    method: "PATCH",
    body: JSON.stringify({
      profile: {
        name: settings.profile.name,
        email: settings.profile.email,
        phone: settings.profile.phone,
        address: settings.profile.address,
      },
      preferences: {
        booking_confirmations: settings.preferences.bookingConfirmations,
        promotional_emails: settings.preferences.promotionalEmails,
        sms_reminders: settings.preferences.smsReminders,
      },
    }),
  });
  return mapApiSettings(updated);
}

function mapApiSettings(settings: ApiCustomerSettings): CustomerSettings {
  return {
    profile: {
      name: settings.profile.name,
      email: settings.profile.email,
      phone: settings.profile.phone ?? "",
      address: settings.profile.address ?? "",
    },
    preferences: {
      bookingConfirmations: settings.preferences.booking_confirmations,
      promotionalEmails: settings.preferences.promotional_emails,
      smsReminders: settings.preferences.sms_reminders,
    },
    stats: {
      totalBookings: settings.stats.total_bookings,
      totalSpend: settings.stats.total_spend,
      averageRating: settings.stats.average_rating,
    },
    updatedAt: settings.updated_at,
  };
}
