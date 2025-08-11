import Header from "./components/Header";
import Footer from "./components/Footer";
import Calculator from "./components/Calculator";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <Calculator />

      <Footer />
    </div>
  );
}

export default App;
