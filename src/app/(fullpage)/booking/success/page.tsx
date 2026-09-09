import type { Metadata } from "next";
import BookingSuccessClient from "./BookingSuccessClient";

export const metadata: Metadata = {
  title: "Booking Successful | MessMeals",
  robots: { index: false },
};

export default function BookingSuccessPage() {
  return <BookingSuccessClient />;
}
