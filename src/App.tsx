import Navbar from "./navbar/Navbar";
import HeroSection from "./herosection/HeroSection";
import TrendingListings from "./TrendingListings/TrendingListings";
import PopularLocations from "./PopularLocations/PopularLocations";
import Footer from "./Footer/Footer";


function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrendingListings />
      <PopularLocations/>
      <Footer />
    </>
  );
}

export default App;
