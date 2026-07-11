const QuestionPalette = ({ questions, answers, currentIndex, onJumpTo }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Questions</h3>

      <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
        {questions.map((question, index) => {
          const isAnswered = answers[question.question_id] !== undefined;
          const isCurrent = index === currentIndex;

          let classes =
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ";

          if (isCurrent) {
            classes += "bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-1";
          } else if (isAnswered) {
            classes += "bg-primary-100 text-primary-700 hover:bg-primary-200";
          } else {
            classes += "bg-gray-100 text-gray-500 hover:bg-gray-200";
          }

          return (
            <button key={question.question_id} onClick={() => onJumpTo(index)} className={classes}>
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-primary-100" /> Answered
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-gray-100" /> Not answered
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-primary-600" /> Current
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;