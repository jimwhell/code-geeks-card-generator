import "./App.css";
import Navbar from "./ui/navbar";

function App() {
  return (
    <>
      <div className="flex">
        <nav className="bg-red-200 w-1/6 h-screen">
          <Navbar />
        </nav>
        <main className="bg-blue-200 w-full h-screen p-14">
          <div className="bg-green-300 w-full h-full">d</div>
        </main>
      </div>
    </>
  );
}

export default App;
