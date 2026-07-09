import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const CARD_COLORS = [
  "bg-primary-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-teal-600",
];

const getCardColor = (id) => {
  if (!id) return CARD_COLORS[0];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CARD_COLORS[hash % CARD_COLORS.length];
};

const ClassCard = ({ classItem, linkTo }) => {
  const color = getCardColor(classItem.class_id);

  const content = (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`${color} px-4 py-5`}>
        <h3 className="truncate text-lg font-semibold text-white">
          {classItem.class_name}
        </h3>
        {classItem.teacher_name && (
          <p className="mt-1 truncate text-sm text-white/85">
            {classItem.teacher_name}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {classItem.class_code}
        </span>
        {typeof classItem.total_students === "number" && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={14} />
            {classItem.total_students}
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};

export default ClassCard;