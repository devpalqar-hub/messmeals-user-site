import Navbar from "./navbar/Navbar";
import MobileBottomNav from "./navbar/MobileBottomNav";
import HeroSection from "./herosection/HeroSection";
import AffordableMeals from "./AffordableMeals/AffordableMeals";
import PopularAroundYou from "./PopularAroundYou/PopularAroundYou";
import NewOnMessMeals from "./NewOnMessMeals/NewOnMessMeals";
import HowItWorks from "./HowItWorks/HowItWorks";
import Testimonials from "./Testimonials/Testimonials";
import OwnAMess from "./OwnAMess/OwnAMess";
import Footer from "./Footer/Footer";
import ViewAllListings from "./VIewAllListings/ViewAllListings";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewMessDetails from "./VIewMessDetails/ViewMessDetails";
import Login from "./Login/Login";
import BookPlan from "./BookPlan/BookPlan";
import Profile from "./Profile/Profile";
import TopRated from "./TopRated/TopRated";


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
    {!isLoginPage && <Navbar />}

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
    </Routes>
      {!isLoginPage && <Footer />}
      {!isLoginPage && <MobileBottomNav />}
    </>
  );
}

export default App;
