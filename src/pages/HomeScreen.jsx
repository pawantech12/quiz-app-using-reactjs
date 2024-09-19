import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-md">
        Welcome to the Skill Quiz App
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
        Test your knowledge and improve your skills with fun quizzes in various
        categories!
      </p>
      <button
        className="mt-6 px-8 py-4 bg-orange-400 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-500 transition duration-300 transform hover:scale-105"
        onClick={() => navigate("/skills")}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default HomeScreen;
