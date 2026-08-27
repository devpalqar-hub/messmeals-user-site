import Navbar from "./components/shared/Navbar/Navbar";
import MobileBottomNav from "./components/shared/Navbar/MobileBottomNav";
import HeroSection from "./sections/HeroSection/HeroSection";
import AffordableMeals from "./sections/AffordableMeals/AffordableMeals";
import PopularAroundYou from "./sections/PopularAroundYou/PopularAroundYou";
import NewOnMessMeals from "./sections/NewOnMessMeals/NewOnMessMeals";
import HowItWorks from "./sections/HowItWorks/HowItWorks";
import Testimonials from "./sections/Testimonials/Testimonials";
import OwnAMess from "./sections/OwnAMess/OwnAMess";
import Footer from "./components/shared/Footer/Footer";
import ViewAllListings from "./pages/ViewAllListings/ViewAllListings";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewMessDetails from "./pages/ViewMessDetails/ViewMessDetails";
import Login from "./pages/Login/Login";
import BookPlan from "./pages/BookPlan/BookPlan";
import Profile from "./pages/Profile/Profile";
import TopRated from "./sections/TopRated/TopRated";
import BookingSuccess from "./pages/BookingSuccess/BookingSuccess";
import BookingCancel from "./pages/BookingCancel/BookingCancel";


function App() {
  const location = useLocation();

  // Pages that render full-screen without navbar/footer
  const fullPagePaths = ["/login", "/booking/success", "/booking/cancel"];
  const isFullPage = fullPagePaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
    {!isFullPage && <Navbar />}

    <Routes>
      <Route
        path="/"
        element={
          <>
           <HeroSection />
           <TopRated/>
           <HowItWorks />
           <PopularAroundYou />
           <Testimonials />
           <AffordableMeals />
           <OwnAMess />
           <NewOnMessMeals />
          </>
        }
      />
      <Route
       path="/view-all-listings"
       element={<ViewAllListings/>}
      />
      <Route
       path="/mess/:messId"
       element={<ViewMessDetails/>}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/mess/:messId/book" element={<BookPlan />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
      <Route path="/booking/cancel" element={<BookingCancel />} />
    </Routes>
      {!isFullPage && <Footer />}
      {!isFullPage && <MobileBottomNav />}
    </>
  );
}

export default App;
