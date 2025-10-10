function Home() {
  return (
    <div className="container">
      <h1>Welcome to the Home Page</h1>
      <form action="/Settings">
      <button type="submit">Settings</button>
      </form>
      <form action="/EventCalendar">
      <button type="submit">Events and Calendar</button>
      </form>
    </div>
  );
}
export default Home;