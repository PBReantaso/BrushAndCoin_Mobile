function EventCalendar() {
  return (
    <div className="container">
      <h1>Events and Calendar</h1>
      <form action="/Settings">
      <button type="submit">Settings</button>
      </form>
      <form action="/Home">
      <button type="submit">Home</button>
      </form>
    </div>
  );
}
export default EventCalendar;