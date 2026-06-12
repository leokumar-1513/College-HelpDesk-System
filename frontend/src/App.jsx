import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tickets, setTickets] = useState([]);
  const [heading, setHeading] = useState("");

  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    resolved: 0,
  });

  const API = " https://thin-rules-invent.loca.lt";

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API}/accounts/login/`, {
        username,
        password,
      });

      const userRole = response.data.role;

      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("role", response.data.role);

      if (userRole === "admin") {
        setPage("admin");
      } else if (userRole === "employee") {
        setPage("employee");
      } else {
        setPage("student");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid Username or Password");
    }
  };

  const registerStudent = async () => {
  const regUsername = document.getElementById("regUsername").value;
  const regEmail = document.getElementById("regEmail").value;
  const regMobile = document.getElementById("regMobile").value;
  const regPassword = document.getElementById("regPassword").value;

  if (!regUsername || !regEmail || !regMobile || !regPassword) {
    alert("All fields required");
    return;
  }

  try {
    await axios.post(`${API}/accounts/register/`, {
      username: regUsername,
      email: regEmail,
      mobile: regMobile,
      password: regPassword,
      role: "student",
    });

    alert("Student account created successfully");
    setPage("login");
  } catch (error) {
    console.log(error.response?.data || error);
    alert(JSON.stringify(error.response?.data || "Account create nahi hua"));
  }
};

  const resetPassword = async () => {
    const resetUsername = document.getElementById("resetUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!resetUsername || !newPassword) {
      alert("Username aur new password required hai");
      return;
    }

    alert("Demo reset successful. Backend OTP reset next banega.");
    setPage("login");
  };

  const updateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter((t) => t.status === "pending").length,
      assigned: data.filter((t) => t.status === "assigned").length,
      resolved: data.filter((t) => t.status === "resolved").length,
    });
  };

  const getAllTickets = async () => {
    try {
      const response = await axios.get(`${API}/tickets/`);
      const data = response.data;

      setTickets(data);
      setHeading("All Tickets");
      updateStats(data);
    } catch (error) {
      console.log(error);
      alert("Tickets load nahi ho rahe");
    }
  };

  const getMyTickets = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${API}/tickets/`);

      const myTickets = response.data.filter(
        (ticket) => Number(ticket.student) === Number(userId)
      );

      setTickets(myTickets);
      setHeading("My Tickets");
    } catch (error) {
      console.log(error);
      alert("Tickets load nahi ho rahe");
    }
  };

  const getPendingTickets = async () => {
    try {
      const response = await axios.get(`${API}/tickets/`);
      const data = response.data;
      const pending = data.filter((ticket) => ticket.status === "pending");

      setTickets(pending);
      setHeading("Pending Tickets");
      updateStats(data);
    } catch (error) {
      console.log(error);
      alert("Pending tickets load nahi ho rahe");
    }
  };

  const getAssignedTickets = async () => {
    try {
      const employeeId = localStorage.getItem("userId");
      const response = await axios.get(`${API}/tickets/`);

      const assigned = response.data.filter(
        (ticket) => Number(ticket.assigned_employee) === Number(employeeId)
      );

      setTickets(assigned);
      setHeading("My Assigned Tickets");
    } catch (error) {
      console.log(error);
      alert("Assigned tickets load nahi ho rahe");
    }
  };

  const getResolvedTickets = async () => {
    try {
      const response = await axios.get(`${API}/tickets/`);
      const data = response.data;
      const resolved = data.filter((ticket) => ticket.status === "resolved");

      setTickets(resolved);
      setHeading("Resolved Tickets");
      updateStats(data);
    } catch (error) {
      console.log(error);
      alert("Resolved tickets load nahi ho rahe");
    }
  };

  const createTicket = async () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const userId = localStorage.getItem("userId");

    if (!title || !description) {
      alert("Title aur description bharna zaroori hai");
      return;
    }

    try {
      await axios.post(`${API}/tickets/`, {
        title,
        description,
        priority,
        status: "pending",
        student: userId,
        department: 1,
      });

      alert("Ticket Created Successfully");
      setPage("student");
      getMyTickets();
    } catch (error) {
      console.log(error);
      alert("Ticket create nahi hua");
    }
  };

  const assignEmployee = async () => {
    const ticketId = prompt("Database Ticket ID enter karo:");
    const employeeId = prompt("Employee User ID enter karo:");

    if (!ticketId || !employeeId) {
      alert("Ticket ID aur Employee ID required hai");
      return;
    }

    try {
      await axios.patch(`${API}/tickets/${ticketId}/`, {
        assigned_employee: employeeId,
        status: "assigned",
      });

      alert("Employee Assigned Successfully");
      getAllTickets();
    } catch (error) {
      console.log(error);
      alert("Employee assign nahi hua");
    }
  };

  const resolveTicket = async () => {
    const ticketId = prompt("Database Ticket ID enter karo:");

    if (!ticketId) {
      alert("Ticket ID required hai");
      return;
    }

    try {
      await axios.patch(`${API}/tickets/${ticketId}/`, {
        status: "resolved",
      });

      alert("Ticket Resolved Successfully");
      getAssignedTickets();
    } catch (error) {
      console.log(error);
      alert("Ticket resolve nahi hua");
    }
  };

  const replyToStudent = async () => {
    const ticketId = prompt("Database Ticket ID enter karo:");
    const senderId = localStorage.getItem("userId");
    const message = prompt("Reply message likho:");

    if (!ticketId || !senderId || !message) {
      alert("Ticket ID, Employee ID aur message required hai");
      return;
    }

    try {
      await axios.post(`${API}/replies/`, {
        ticket: ticketId,
        sender: senderId,
        message,
      });

      alert("Reply Sent Successfully");
    } catch (error) {
      console.log(error);
      alert("Reply send nahi hua");
    }
  };

  const getReplies = async () => {
    const ticketId = prompt("Database Ticket ID enter karo:");

    if (!ticketId) {
      alert("Ticket ID required hai");
      return;
    }

    try {
      const response = await axios.get(`${API}/replies/`);

      const ticketReplies = response.data.filter(
        (reply) => Number(reply.ticket) === Number(ticketId)
      );

      if (ticketReplies.length === 0) {
        alert("Is ticket par koi reply nahi hai");
        return;
      }

      const messages = ticketReplies
        .map((reply) => `Reply: ${reply.message}`)
        .join("\n\n");

      alert(messages);
    } catch (error) {
      console.log(error);
      alert("Replies load nahi ho rahe");
    }
  };

  const askChatbot = async () => {
    if (!chatQuestion) {
      alert("Question likho");
      return;
    }

    try {
      const response = await axios.post(`${API}/chatbot/ask/`, {
        question: chatQuestion,
      });

      setChatAnswer(response.data.answer);
    } catch (error) {
      console.log(error);
      alert("AI Chatbot answer nahi de pa raha");
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setPage("login");
    setUsername("");
    setPassword("");
    setTickets([]);
    setHeading("");
    setChatQuestion("");
    setChatAnswer("");
  };

  const renderTickets = () => {
    return (
      <>
        {heading && <h2>{heading}</h2>}

        {tickets.length === 0 && heading && <p>No tickets found.</p>}

        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card">
            <h3>{ticket.title}</h3>

            <p>
              <b>Ticket ID:</b> CHD-{100000 + ticket.id * 847}
            </p>

            <p>
              <b>Database ID:</b> {ticket.id}
            </p>

            <p>
              <b>Description:</b> {ticket.description}
            </p>

            <p>
              <b>Status:</b> {ticket.status}
            </p>

            <p>
              <b>Priority:</b> {ticket.priority}
            </p>

            <p>
              <b>Created:</b>{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </p>

            <p>
              <b>Assigned Employee:</b>{" "}
              {ticket.assigned_employee || "Not Assigned"}
            </p>
          </div>
        ))}
      </>
    );
  };

  if (page === "register") {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Student Register</h1>

          <input type="text" placeholder="Username" id="regUsername" />
          <input type="email" placeholder="Email" id="regEmail" />
          <input type="text" placeholder="Mobile Number" id="regMobile" />
          <input type="password" placeholder="Password" id="regPassword" />

          <button onClick={registerStudent}>Register</button>
          <button onClick={() => setPage("login")}>Back to Login</button>
        </div>
      </div>
    );
  }

  if (page === "forgotPassword") {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Reset Password</h1>

          <input type="text" placeholder="Enter Username" id="resetUsername" />

          <input
            type="password"
            placeholder="Enter New Password"
            id="newPassword"
          />

          <button onClick={resetPassword}>Reset Password</button>

          <button onClick={() => setPage("login")}>Back to Login</button>
        </div>
      </div>
    );
  }

  if (page === "chatbot") {
    return (
      <div className="dashboard">
        <h1>AI Chatbot</h1>

        <textarea
          placeholder="Ask admission, fees, hostel, exam, scholarship related question..."
          value={chatQuestion}
          onChange={(e) => setChatQuestion(e.target.value)}
        ></textarea>

        <button onClick={askChatbot}>Ask</button>

        {chatAnswer && (
          <div className="ticket-card">
            <h3>Answer</h3>
            <p>{chatAnswer}</p>
          </div>
        )}

        <button onClick={() => setPage("student")}>Back</button>
      </div>
    );
  }

  if (page === "createTicket") {
    return (
      <div className="dashboard">
        <h1>Create Ticket</h1>

        <input type="text" placeholder="Ticket Title" id="title" />

        <textarea
          placeholder="Describe your problem"
          id="description"
        ></textarea>

        <select id="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <button onClick={createTicket}>Submit Ticket</button>
        <button onClick={() => setPage("student")}>Back</button>
      </div>
    );
  }

  if (page === "student") {
    return (
      <div className="dashboard">
        <h1>Student Dashboard</h1>

        <button onClick={() => setPage("createTicket")}>Create Ticket</button>
        <button onClick={getMyTickets}>My Tickets</button>
        <button onClick={getReplies}>View Replies</button>
        <button onClick={() => setPage("chatbot")}>AI Chatbot</button>
        <button onClick={logout}>Logout</button>

        {renderTickets()}
      </div>
    );
  }

  if (page === "employee") {
    return (
      <div className="dashboard">
        <h1>Employee Dashboard</h1>

        <button onClick={getAssignedTickets}>Assigned Tickets</button>
        <button onClick={replyToStudent}>Reply To Student</button>
        <button onClick={resolveTicket}>Resolve Ticket</button>
        <button onClick={logout}>Logout</button>

        {renderTickets()}
      </div>
    );
  }

  if (page === "admin") {
    return (
      <div className="dashboard">
        <h1>Admin Dashboard</h1>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total</h3>
            <p>{stats.total}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>

          <div className="stat-card">
            <h3>Assigned</h3>
            <p>{stats.assigned}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{stats.resolved}</p>
          </div>
        </div>

        <button onClick={getAllTickets}>All Tickets</button>
        <button onClick={getPendingTickets}>Pending Tickets</button>
        <button onClick={getResolvedTickets}>Resolved Tickets</button>
        <button onClick={assignEmployee}>Assign Employee</button>
        <button onClick={logout}>Logout</button>

        {renderTickets()}
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>College Help Desk</h1>
        <p>Login to continue</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <button onClick={() => setPage("register")}>
          Create Student Account
        </button>

        <a href="#" onClick={() => setPage("forgotPassword")}>
          Forgot Password?
        </a>

        <button
          className="google-btn"
          onClick={() => alert("Google Login feature next banega")}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default App;