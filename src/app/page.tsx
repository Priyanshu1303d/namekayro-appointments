"use client";

import { Navbar } from "@/components/client/Navbar";
import { HomeSection } from "@/components/client/HomeSection";
import { BookSection } from "@/components/client/BookSection";
import { MyBookingsSection } from "@/components/client/MyBookingsSection";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CircularTextWrapper } from "@/components/reactbits/CircularTextWrapper";
import { useClientBookings } from "@/hooks/useClientBookings";

// Client single-page experience: Hero is left-aligned, rest is center-aligned.
export default function Page() {
  const { client, setClient, upcoming, past, loading, loadBookings, confirmAppointment, findClient, clear } = useClientBookings();
  const nextAppt = upcoming.find((a) => a.status === "Booked") || upcoming[0] || null;

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-black text-text selection:bg-pink selection:text-white pb-28 md:pb-16">
        <Navbar />

        <main className="w-full">
          <HomeSection clientName={client?.name} nextAppointment={nextAppt} onConfirmAppointment={confirmAppointment} />

          {/* Rest of website remains center aligned with text and boxes */}
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <BookSection
              defaultName={client?.name}
              defaultPhone={client?.phone}
              onBookingSuccess={(appt) => {
                if (appt.phone) {
                  setClient({ name: appt.clientName, phone: appt.phone });
                  loadBookings(appt.phone);
                }
              }}
            />

            <MyBookingsSection
              client={client}
              upcoming={upcoming}
              past={past}
              loading={loading}
              onFindClient={findClient}
              onClearClient={clear}
              onConfirmAppointment={confirmAppointment}
              onAppointmentUpdated={() => client && loadBookings(client.phone)}
            />
          </div>
        </main>

        <aside className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-30 pointer-events-none select-none">
          <div className="pointer-events-auto scale-75 sm:scale-100 origin-bottom-right hover:scale-105 transition-transform duration-300">
            <CircularTextWrapper size={115} text="BOOK*SHOW UP*FEEL GOOD*" />
          </div>
        </aside>
      </div>
    </SmoothScroll>
  );
}
