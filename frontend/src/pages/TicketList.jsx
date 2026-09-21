import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api";

function statusColor(status) {
  if (status === "Open") return "bg-yellow-100 text-yellow-800";
  if (status === "In Progress") return "bg-blue-100 text-blue-800";
  if (status === "Closed") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      getTickets(search, status).then(setTickets);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Support Tickets</h1>
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + New Ticket
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, email, description..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.ticket_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link to={`/tickets/${t.ticket_id}`} className="font-mono text-sm text-blue-600 hover:underline">
                      {t.ticket_id}
                    </Link>
                  </td>
                  <td className="p-3">{t.customer_name}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}