import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": `${localStorage.getItem("auth-token")}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user information");
          }

          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user information:", error);
          localStorage.removeItem("auth-token");
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;
