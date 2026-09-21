const API_BASE = "/api";

export async function getTickets(search = "", status = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const res = await fetch(`${API_BASE}/tickets?${params.toString()}`);
  return res.json();
}

export async function getTicket(ticketId) {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`);
  if (!res.ok) throw new Error("Ticket not found");
  return res.json();
}

export async function createTicket(data) {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ? JSON.stringify(err.detail) : "Failed to create ticket");
  }
  return res.json();
}

export async function updateTicket(ticketId, data) {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}