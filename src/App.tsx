import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1>Hello World</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;
