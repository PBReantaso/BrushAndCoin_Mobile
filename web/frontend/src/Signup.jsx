function Signup() {
  return (
    <div className="container">
      <div className="signup-section">
        <h1>Sign Up</h1>
        <form>
          <input type="text" id="username" name="username" placeholder="Enter your username" />
            <br></br>
          <input type="email" id="email" name="email" placeholder="Enter your email" />
            <br></br>
          <input type="password" id="password" name="password" placeholder="Enter your password" />
            <br></br>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
export default Signup;