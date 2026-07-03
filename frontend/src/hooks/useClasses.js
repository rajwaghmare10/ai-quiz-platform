    import { useState, useEffect, useCallback } from "react";
    import classService from "../api/classService";

    const useClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClasses = useCallback(async () => {
        console.log("fetchClasses called");
        setLoading(true);
        setError(null);
        try {
        const data = await classService.getMyClasses();
        console.log(data);
        setClasses(data);
        } catch (err) {
        setError(err?.response?.data?.message || "Failed to load classes");
        } finally {
        setLoading(false);
        }
    }, []);

    const addClass = async (classData) => {
        console.log("useClasses hook running");
        const newClass = await classService.createClass(classData);
        setClasses((prev) => [...prev, newClass]);
        return newClass;
    };

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    return { classes, loading, error, addClass, refetch: fetchClasses };
    };

    export default useClasses;