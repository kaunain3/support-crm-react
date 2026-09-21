import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicket, updateTicket } from "../api";

function statusColor(status) {
  if (status === "Open") return "bg-yellow-100 text-yellow-800";
  if (status === "In Progress") return "bg-blue-100 text-blue-800";
  if (status === "Closed") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [noteText, setNoteText] = useState("");

  async function load() {
    try {
      const data = await getTicket(ticketId);
      setTicket(data);
      setStatusValue(data.status);
    } catch {
      setNotFound(true);
    }
  }

  useEffect(() => {
    load();
  }, [ticketId]);

  async function handleUpdate(e) {
    e.preventDefault();
    const payload = { status: statusValue };
    if (noteText) payload.notes = noteText;
    await updateTicket(ticketId, payload);
    setNoteText("");
    load();
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Link to="/" className="text-blue-600 text-sm">&larr; Back to tickets</Link>
        <p className="text-red-600 mt-4">Ticket not found.</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-blue-600 text-sm">&larr; Back to tickets</Link>

      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{ticket.subject}</h1>
            <p className="text-sm text-gray-500 font-mono">{ticket.ticket_id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${statusColor(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4 text-gray-700">
          <p><span className="font-medium">Customer:</span> {ticket.customer_name}</p>
          <p><span className="font-medium">Email:</span> {ticket.customer_email}</p>
          <p><span className="font-medium">Created:</span> {new Date(ticket.created_at).toLocaleString()}</p>
          <p><span className="font-medium">Updated:</span> {new Date(ticket.updated_at).toLocaleString()}</p>
        </div>

        <p className="text-gray-800 mb-6">{ticket.description}</p>

        <h2 className="font-semibold text-gray-700 mb-2">Notes</h2>
        <div className="space-y-2 mb-6">
          {ticket.notes.length === 0 ? (
            <p className="text-gray-400 text-sm">No notes yet.</p>
          ) : (
            ticket.notes.map((n) => (
              <div key={n.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                <p>{n.note_text}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleUpdate} className="border-t pt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Note</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Update
          </button>
        </form>
      </div>
    </div>
  );
}