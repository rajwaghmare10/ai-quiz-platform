import { useState, useEffect, useCallback } from "react";
import classService from "../api/classService";

const useJoinedClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJoinedClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getJoinedClasses();
      setClasses(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoinedClasses();
  }, [fetchJoinedClasses]);

  return { classes, loading, error, refetch: fetchJoinedClasses };
};

export default useJoinedClasses;