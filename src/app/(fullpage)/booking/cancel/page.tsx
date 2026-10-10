import type { Metadata } from "next";
import BookingCancelClient from "./BookingCancelClient";

export const metadata: Metadata = {
  title: "Booking Cancelled | MessMeals",
  robots: { index: false },
};

export default function BookingCancelPage() {
  return <BookingCancelClient />;
}
