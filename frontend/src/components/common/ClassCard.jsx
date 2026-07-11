import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical, Users } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import classService from "../../api/classService";
import ClassMembersModal from "./ClassMembersModal";
import ConfirmDialog from "../layout/ConfirmDialog";
import { getClassTheme } from "../../utils/classTheme";

const ClassCard = ({ classItem, linkTo, onDeleted, onLeft }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const menuRef = useRef(null);

  const theme = getClassTheme(classItem.class_id);
  const teacherName = classItem.teacher_name || (user?.role === "teacher" ? user?.name : null);
  const initial = teacherName?.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleManage = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(linkTo);
  };

  const handleMembersClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMembersOpen(true);
  };

  const handleLeaveClass = async () => {
    setLeaving(true);
    try {
      await classService.leaveClass(classItem.class_id);
      toast.success("Left class");
      onLeft?.(classItem.class_id);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to leave class";
      toast.error(message);
    } finally {
      setLeaving(false);
      setLeaveConfirmOpen(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Clipped zone: banner only */}
      <div className="overflow-hidden rounded-t-xl">
        <Link to={linkTo}>
          <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} px-4 pb-8 pt-4`}>
            <h3 className="pr-8 text-lg font-semibold leading-snug text-white">
              {classItem.class_name}
            </h3>
            {classItem.description && (
              <p className="mt-0.5 truncate text-sm font-medium text-white/85">
                {classItem.description}
              </p>
            )}
            {teacherName && (
              <p className="mt-0.5 truncate text-sm text-white/75">{teacherName}</p>
            )}

            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -right-2 bottom-2 h-12 w-12 rounded-full bg-white/10" />
          </div>
        </Link>
      </div>

      {/* Avatar overlap zone, not clipped */}
      <div className="relative">
        <Link to={linkTo}>
          <div className="absolute -top-6 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-white ring-4 ring-white">
            <div
              className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-xl font-semibold text-white`}
            >
              {initial}
            </div>
          </div>
        </Link>
        <div className="h-8" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between rounded-b-xl border-t border-gray-100 px-3 py-2">
        <button
          onClick={handleMembersClick}
          className="flex items-center gap-1 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="View members"
        >
          <Users size={17} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical size={17} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
              <button
                onClick={handleManage}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {user?.role === "teacher" ? "Manage Class" : "View Class"}
              </button>
              {user?.role === "teacher" ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    onDeleted?.(classItem.class_id);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Class
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setLeaveConfirmOpen(true);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Unenroll
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ClassMembersModal
        isOpen={membersOpen}
        onClose={() => setMembersOpen(false)}
        classId={classItem.class_id}
        teacherName={teacherName}
      />

      <ConfirmDialog
        isOpen={leaveConfirmOpen}
        onClose={() => setLeaveConfirmOpen(false)}
        onConfirm={handleLeaveClass}
        title="Unenroll from Class"
        message={`Are you sure you want to unenroll from "${classItem.class_name}"? You'll need the class code to rejoin.`}
        confirmLabel={leaving ? "Leaving..." : "Unenroll"}
        danger
      />
    </div>
  );
};

export default ClassCard;