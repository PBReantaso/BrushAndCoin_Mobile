function Settings() {
  return (
    <div className="container">
      <h1>Settings</h1>
      <form action="/Home">
        <button type="submit">Return to Home</button>
      </form>
      <form action="/Signin">
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
export default Settings;