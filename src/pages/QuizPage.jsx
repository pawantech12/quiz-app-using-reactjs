import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { LuAlarmClock } from "react-icons/lu";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function QuizPage() {
  const { skill } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();

  // Fetch quiz questions from QuizAPI
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://quizapi.io/api/v1/questions",
          {
            headers: {
              "x-api-key": `NzkjVWYwkM2sjg0IXxa8gSD7xpgIZZreoFaImAnM`,
              "Content-Type": "application/json",
            },
            params: {
              limit: 10,
              category: skill,
            },
          }
        );
        console.log(response.data);

        setQuestions(response.data);
        setSelectedOptions(Array(response.data.length).fill(null)); // Initialize selected options
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [skill]);

  // Timer logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          handleNextQuestion(); // Call next question when time is up
          return 30; // Reset timer for the next question
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentQuestion]);

  // Handle option selection
  const handleOptionChange = (index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = index; // Set selected option for current question
    setSelectedOptions(newSelectedOptions);
  };

  // Handle next question
  const handleNextQuestion = () => {
    const currentSelectedOption = selectedOptions[currentQuestion];

    // Check if the selected answer is correct only if an option was chosen
    if (currentSelectedOption !== null) {
      const currentQ = questions[currentQuestion];
      const correctKey = `answer_${String.fromCharCode(
        96 + currentSelectedOption
      )}_correct`; // 'a' = 97, 'b' = 98, ...

      if (currentQ.correct_answers[correctKey] === "true") {
        setCorrectAnswers(correctAnswers + 1);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(30); // Reset timer for the next question
    } else {
      setShowResults(true);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimer(30);
    }
  };

  // Reset correct answers when closing modal
  const handleCloseResults = () => {
    setShowResults(false);
    setCorrectAnswers(0); // Reset correct answers when closing modal
  };
  const handleMenu = () => {
    navigate("/skills");
  };

  if (loading) return <Loader />;

  if (!questions.length) return <div>No questions available.</div>;

  const currentQ = questions[currentQuestion];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex w-full flex-col items-center">
      <div className="text-3xl px-3 py-2 border-2 rounded-md border-orange-400 font-bold mb-6 text-gray-800  text-center relative">
        <span className="relative inline-block bg-gradient-to-r from-orange-400 capitalize to-orange-600 bg-clip-text text-transparent">
          Quiz: {skill}
        </span>
      </div>

      <div className="bg-white py-6 px-8 rounded-lg shadow-md w-full max-w-xl">
        <div className="flex justify-between items-center">
          <span className="font-medium text-base">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="flex items-center gap-1 bg-orange-50 border border-orange-400 rounded-md py-1 px-2">
            <LuAlarmClock />
            {timer}s
          </span>
        </div>
        <hr className="mt-4" />
        <div
          className={`mb-4 mt-4 transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          <h4 className="text-xl font-semibold text-neutral-900/90 text-center">
            {currentQ.question}
          </h4>
          <div className="mt-5">
            {Object.entries(currentQ.answers)
              .filter(([key, value]) => value !== null)
              .map(([key, value], index) => (
                <div
                  key={index}
                  className={`mb-2 py-3 px-4 flex gap-3 items-center border rounded-lg cursor-pointer ${
                    selectedOptions[currentQuestion] === index + 1
                      ? "bg-orange-100 border-orange-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleOptionChange(index + 1)}
                >
                  <span className="uppercase font-medium">
                    {String.fromCharCode(97 + index)}
                  </span>{" "}
                  <label className="text-base font-medium">{value}</label>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            className={`mt-6 px-4 py-2  text-white rounded-lg flex items-center gap-1 ${
              currentQuestion === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500"
            }`}
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <FaChevronLeft />
            Previous
          </button>
          <button
            className="mt-6 ml-4 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg"
            onClick={handleNextQuestion}
          >
            {currentQuestion < questions.length - 1 ? (
              <span className="flex items-center gap-1">
                Next <FaChevronRight />
              </span>
            ) : (
              "Show Results"
            )}
          </button>
        </div>
      </div>

      {showResults && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-11/12 max-w-lg transition-transform transform scale-100 hover:scale-105">
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Results
            </h3>
            <p className="text-lg text-center text-gray-600">
              You got{" "}
              <span className="font-bold text-orange-500">
                {correctAnswers}
              </span>{" "}
              out of {questions.length} questions right!
            </p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                className=" px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow"
                onClick={handleCloseResults}
              >
                Close
              </button>
              <button
                className=" px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow"
                onClick={handleMenu}
              >
                Go to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
