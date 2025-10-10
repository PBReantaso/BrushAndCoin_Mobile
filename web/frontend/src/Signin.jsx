import { useNavigate } from 'react-router-dom';

function Signin() {
const navigate = useNavigate();
   
    function goToHome(event) {
      event.preventDefault();
        navigate("/home");
    }
    function goToSignup(event) {
      event.preventDefault();
        navigate("/signup");
    }


  return (
    <div className="container">
      <div className="signup-section">
        <h1>Sign In</h1>
        <form onSubmit={goToHome}>
            <input type="email" id="email" name="email" placeholder="Enter your email" />
            <br></br>
            <input type="password" id="password" name="password" placeholder="Enter your password" />
            <br></br>
          <button type="submit">Sign In</button>
            <br></br>
            
        </form>
        <form onSubmit={goToSignup}>
        <a>Don't have an account?</a> <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}
export default Signin;