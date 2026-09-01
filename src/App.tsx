import Navbar from "./components/shared/Navbar/Navbar";
import MobileBottomNav from "./components/shared/Navbar/MobileBottomNav";
import SEO from "./components/shared/SEO/SEO";
import HeroSection from "./sections/HeroSection/HeroSection";
import FeaturedMesses from "./sections/FeaturedMesses/FeaturedMesses";
import VerifiedMesses from "./sections/VerifiedMesses/VerifiedMesses";
import Testimonials from "./sections/Testimonials/Testimonials";
import OwnAMess from "./sections/OwnAMess/OwnAMess";
import Footer from "./components/shared/Footer/Footer";
import ViewAllListings from "./pages/ViewAllListings/ViewAllListings";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewMessDetails from "./pages/ViewMessDetails/ViewMessDetails";
import Login from "./pages/Login/Login";
import BookPlan from "./pages/BookPlan/BookPlan";
import Profile from "./pages/Profile/Profile";
import BookingSuccess from "./pages/BookingSuccess/BookingSuccess";
import BookingCancel from "./pages/BookingCancel/BookingCancel";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";


function App() {
  const location = useLocation();

  // Pages that render full-screen without navbar/footer
  const fullPagePaths = ["/login", "/booking/success", "/booking/cancel"];
  const isFullPage = fullPagePaths.some((p) => location.pathname.startsWith(p));

  // Pages that hide the footer (but keep navbar + bottom nav)
  const noFooterPaths = ["/profile"];
  const hideFooter = noFooterPaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
    {!isFullPage && <Navbar />}

    <Routes>
      <Route
        path="/"
        element={
          <>
           <SEO 
             title="MessMeals – Find the Best Mess & Homely Food Near You"
             description="Discover the best verified messes and homely food near you. Explore daily and monthly meal plans, reviews, and menus on MessMeals."
             image="/seo/og-home.png"
             url="/"
           />
           <HeroSection />
           <FeaturedMesses />
           <VerifiedMesses />
           <Testimonials />
           <OwnAMess />
          </>
        }
      />
      <Route
       path="/view-all-listings"
       element={<ViewAllListings/>}
      />
      <Route
       path="/mess/:slug"
       element={<ViewMessDetails/>}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/mess/:slug/book" element={<BookPlan />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
      <Route path="/booking/cancel" element={<BookingCancel />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
      {!isFullPage && !hideFooter && <Footer />}
      {!isFullPage && <MobileBottomNav />}
    </>
  );
}

export default App;
