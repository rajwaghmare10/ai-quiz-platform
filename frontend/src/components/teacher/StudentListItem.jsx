const StudentListItem = ({ student }) => {
  const joinedDate = new Date(student.joined_at).toLocaleDateString();
  const initial = student.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{student.name}</p>
          <p className="text-xs text-gray-500">{student.email}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">Joined {joinedDate}</p>
    </div>
  );
};

export default StudentListItem;