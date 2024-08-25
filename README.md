<h1>The Wild Oasis</h1>
<p>“The Wild Oasis” is a small hotel with 8 wooden cabins. This is the internal application used inside the hotel to check in guests as they arrive.</p>

<h2>Project requirements</h2>
<ul>
  <li>- [x] Users of the app are hotel employees. They need to be logged into the application to perform tasks</li>
  <li>- [x] New users can only be signed up inside the applications (to guarantee that only actual hotel employees can get accounts)</li>
  <li>- [x] Users should be able to upload an avatar, and change their name and password</li>
  <li>- [x] App needs a table view with all cabins, showing the cabin photo, name, capacity, price, and current discount</li>
  <li>- [x] Users should be able to update or delete a cabin, and to create new cabins (including uploading a photo)</li>
  <li>- [x] App needs a table view with all bookings, showing arrival and departure dates, status, and paid amount, as well as cabin and guest data</li>
  <li>- [x] The booking status can be “unconfirmed” (booked but not yet checked in), “checked in”, or “checked out”. The table should be filterable 
by this important status</li>
  <li>- [x] Other booking data includes: number of guests, number of nights, guest observations, whether they booked breakfast, breakfast price</li>
  <li>- [x] Users should be able to delete, check-in, or check out a booking as the guest arrives (no editing necessary for now)</li>
  <li>- [x] Bookings may not have been paid yet on guest arrival. Therefore, on check-in, users need to accept payment (outside the app), and 
then confirm that payment has been received (inside the app)</li>
  <li>- [x] On check-in, the guest should have the ability to add breakfast for the entire stay, if they hadn’t already</li>
  <li>- [x] Guest data should contain: full name, email, national ID, nationality, and a country flag for easy identification</li>
  <li>- [x] The initial app screen should be a dashboard, to display important information for the last 7, 30, or 90 days:
    <ul>  
      <li>- [x] A list of guests checking in and out on the current day. Users should be able to perform these tasks from here</li>
      <li>- [x] Statistics on recent bookings, sales, check-ins, and occupancy rate</li>
      <li>- [x] A chart showing all daily hotel sales, showing both “total” sales and “extras” sales (only breakfast at the moment)</li>
      <li>- [x] A chart showing statistics on stay durations, as this is an important metric for the hotel</li>
    </ul>
  </li>
  <li>- [x] Users should be able to define a few application-wide settings: breakfast price, min and max nights/booking, max guests/booking</li>
  <li>- [x] App needs a dark mode</li>
</ul>

<h3>Additional goals outside of the course</h3>
<ul>
  <li>- [ ] Users should be able to create new bookings</li>
  <li>- [ ] Users should be able to edit bookings</li>
  <li>- [ ] Users should be able to set check-in and check-out times for bookings</li>
  <li>- [ ] Users should be able to get a pdf invoice on check out</li>
  <li>- [ ] Guest should be able to receive a pdf invoice by email</li>
  <li>- [ ] Users should be able to change cabin price based on the day of week, month or custom price for any day</li>
</ul>

<h2>Running this project</h2>
<p>To run this project you need to download the repository and open it in Visual Studio Code or a similar app. Then you have to open a terminal and run the command <code>npm run dev</code>. By default, it won't open any new tab, so you have to go to <a href="http://localhost:5173/" target="_blank">http://localhost:5173/</a>.</p>

<h2>Working with the app</h2>
<p>The app requires you to be logged in to be able to use any features. When you open the login page enter email <code>preview@example.com</code> and password <code>12345678</code>. From here you can register a new user or use it as an admin.</p>

<h2>Technologies used</h2>
<ul>
  <li><b>React Router</b> - navigation in the SPA</li>
  <li><b>Styled Components</b> - component-scoped CSS</li>
  <li><b>React Query</b> - managing remote state</li>
  <li><b>Context API</b> - managing UI state</li>
  <li><b>React Hook Form</b> - handling big forms</li>
  <li><b>React icons</b> - providing icons</li>
  <li><b>React hot toast</b> - showing notifications</li>
  <li><b>Recharts</b> - displaying charts</li>
  <li><b>date-fns</b> - manipulating JavaScript dates</li>
  <li><b>Supabase</b> - providing back-end (database, Authentication, instant APIs)</li>
</ul>

