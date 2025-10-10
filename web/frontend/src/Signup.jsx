import React from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');   


    const goToSetup = (event) => {
        event.preventDefault();
        // Perform signup logic here
        navigate("/setupacc");
    }; 

    const goToSignin = (event) => {
        event.preventDefault();
        navigate("/signin");
    };

  return (
    <div className="container">
      <div className="signup-section">
        <h1>Sign Up</h1>
        <form onSubmit={goToSetup}>
            <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your email" 
            required
            onChange={(e) => setEmail(e.target.value)}
            />
            <br></br>
            <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter your password" 
            required
            onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
            <input 
            type="password" 
            id="confirm-password" 
            name="confirm-password" 
            placeholder="Confirm your password" 
            onChange={(e) => setConfirmPassword(e.target.value)}
            required/>
            <br></br>
            <input 
            type="checkbox" 
            id="terms" 
            name="terms" 
            required />
            <label htmlFor="terms"> I agree to the <a href="/terms">terms and conditions</a></label>
            <br></br>
            <button type="submit">Sign Up</button>
            <br></br>
        </form>
        <form onSubmit={goToSignin}>
        <a>Already have an account?</a> <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
export default Signup;