import Navbar from "./navbar/Navbar";
import HeroSection from "./herosection/HeroSection";
import TrendingListings from "./TrendingListings/TrendingListings";
import PopularLocations from "./PopularLocations/PopularLocations";
import Footer from "./Footer/Footer";
import ViewAllListings from "./VIewAllListings/ViewAllListings";
import { Route, Routes } from "react-router-dom";
import ViewMessDetails from "./VIewMessDetails/ViewMessDetails";


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
    </Routes>
      <Footer />
    </>
  );
}

export default App;
