import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function QuizPage() {
  const { skill } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

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

    // Timer for each question
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [skill]);

  // Handle option selection
  const handleOptionChange = (index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = index; // Set selected option for current question
    setSelectedOptions(newSelectedOptions);
    setError(""); // Clear error when an option is selected
  };

  // Handle next question
  const handleNextQuestion = () => {
    const currentSelectedOption = selectedOptions[currentQuestion];

    if (currentSelectedOption === null) {
      setError("Please select an option before proceeding.");
      return;
    }

    // Check if the selected answer is correct
    const currentQ = questions[currentQuestion];
    const correctKey = `answer_${String.fromCharCode(
      96 + currentSelectedOption
    )}_correct`; // 'a' = 97, 'b' = 98, ...

    if (currentQ.correct_answers[correctKey] === "true") {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(30);
      setError(""); // Clear error when moving to the next question
    } else {
      setShowResults(true);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimer(30);
      setError(""); // Clear error when moving to the previous question
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!questions.length) return <div>No questions available.</div>;

  const currentQ = questions[currentQuestion];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Quiz: {skill.toUpperCase()}</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <div className="mb-4">
          <p className="text-lg font-semibold">
            Question {currentQuestion + 1}: {currentQ.question}
          </p>
          <div className="mt-4">
            {Object.entries(currentQ.answers)
              .filter(([key, value]) => value !== null)
              .map(([key, value], index) => (
                <div key={index} className="mb-2">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="option"
                    className="mr-2"
                    onChange={() => handleOptionChange(index + 1)}
                    checked={selectedOptions[currentQuestion] === index + 1}
                  />
                  <label htmlFor={`option-${index}`} className="text-lg">
                    {value}
                  </label>
                </div>
              ))}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="mt-4">
          <p>Time Remaining: {timer}s</p>
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            className="mt-6 ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleNextQuestion}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Show Results"}
          </button>
        </div>
      </div>

      {showResults && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-lg">
            <h3 className="text-xl font-semibold">Results</h3>
            <p>
              You got {correctAnswers} out of {questions.length} questions
              right!
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => setShowResults(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
