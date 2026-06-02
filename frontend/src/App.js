import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
      <h1>My First Full-Stack Auth App</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "50px", flexWrap: "wrap", marginTop: "30px" }}>
        <Signup />
        <Login />
      </div>
    </div>
  );
}

export default App;