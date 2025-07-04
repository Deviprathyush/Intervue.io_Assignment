import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import StudentLogin from './StudentLogin';
import StudentApp from './StudentApp'; // Your poll logic
import TeacherDashboard from './TeacherDashboard';
import StudentPollWaiting from './StudentPollWaiting';
import StudentPollActive from './StudentPollActive';
import TeacherResultPage from './TeacherResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<StudentLogin />} />
        <Route path="/student/poll" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student/waiting" element={<StudentPollWaiting />} />
        <Route path="/student/active" element={<StudentPollActive />} />
        <Route path="/teacher/result" element={<TeacherResultPage />} />
      </Routes>
    </Router>
  );
}
export default App;