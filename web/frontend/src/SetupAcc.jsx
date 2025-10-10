import { useNavigate } from 'react-router-dom';

function SetupAcc() {
const navigate = useNavigate();

function goToSignup(event) {
  event.preventDefault();
    navigate("/signup");
}

function goToHome(event) {
  event.preventDefault();
    navigate("/home");
}

  return (
    <div className="container">
      <div className="signup-section">
        <h1>Sign Up</h1>
        <form onSubmit={goToHome}>
            <input type="text" id="username" name="username" placeholder="Enter your username" required/>
            <br></br>
          <button type="submit">Sign Up</button>
          <br></br>
        </form>
        <form onSubmit={goToSignup}>
            <button type="submit">Return</button>
        </form>
      </div>
    </div>
  );
}
export default SetupAcc;