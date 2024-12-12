/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import QuestionList from "./components/QuestionList";
import QuestionDetails from "./components/QuestionDetails";
import QuestionForm from "./components/QuestionForm";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("userId");
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={<PrivateRoute element={<QuestionList />} />}
      />
      <Route
        path="/questions"
        element={<PrivateRoute element={<QuestionList />} />}
      />
      <Route
        path="/questions/new"
        element={<PrivateRoute element={<QuestionForm />} />}
      />
      <Route
        path="/questions/:id"
        element={<PrivateRoute element={<QuestionDetails />} />}
      />
    </Routes>
  </Router>
);

export default App;
