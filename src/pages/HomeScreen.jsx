import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      <h1 className="text-4xl font-bold text-white">
        Welcome to the Skill Quiz App
      </h1>
      <button
        className="mt-10 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-200"
        onClick={() => navigate("/skills")}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default HomeScreen;
