import Navbar from "./navbar/Navbar";
import MobileBottomNav from "./navbar/MobileBottomNav";
import HeroSection from "./herosection/HeroSection";
import TrendingListings from "./TrendingListings/TrendingListings";
import PopularLocations from "./PopularLocations/PopularLocations";
import HowItWorks from "./HowItWorks/HowItWorks";
import Testimonials from "./Testimonials/Testimonials";
import OwnAMess from "./OwnAMess/OwnAMess";
import Footer from "./Footer/Footer";
import ViewAllListings from "./VIewAllListings/ViewAllListings";
import { Route, Routes } from "react-router-dom";
import ViewMessDetails from "./VIewMessDetails/ViewMessDetails";
import Login from "./Login/Login";
import BookPlan from "./BookPlan/BookPlan";
import Profile from "./Profile/Profile";


function App() {
  return (
    <>
    <Navbar />

    <Routes>
      <Route
        path="/"
        element={
          <>
           <HeroSection />
           <TrendingListings />
           <HowItWorks />
           <Testimonials />
           <OwnAMess />
           <PopularLocations/>
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
    </Routes>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default App;
