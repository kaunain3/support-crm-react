import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/tickets/:ticketId" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}