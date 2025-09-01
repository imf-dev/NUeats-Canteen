export const storeDemoData = {
  canteenInfo: {
    name: "NU EATS",
    description:
      "A modern canteen serving fresh, healthy meals with convenient mobile ordering and pickup service.",
    phoneNumber: "(+63)912 345 6789",
    emailAddress: "EmailAddress@gmail.com",
    streetAddress: "Sampaloc 1 Bridge, SM Dasmarinas, Governor's Dr",
    city: "Dasmarinas",
    province: "Cavite",
    zipCode: "4114",
  },
  operatingHours: {
    monday: { open: true, openTime: "08:00", closeTime: "17:00" },
    tuesday: { open: false, openTime: "08:00", closeTime: "17:00" },
    wednesday: { open: true, openTime: "08:00", closeTime: "17:00" },
    thursday: { open: true, openTime: "08:00", closeTime: "17:00" },
    friday: { open: true, openTime: "08:00", closeTime: "17:00" },
    saturday: { open: true, openTime: "08:00", closeTime: "17:00" },
    sunday: { open: false, openTime: "08:00", closeTime: "17:00" },
  },
  paymentMethods: {
    cashPayment: true,
    payMongo: true,
    creditDebitCard: true,
  },
};
