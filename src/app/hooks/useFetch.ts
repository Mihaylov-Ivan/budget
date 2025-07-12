"use client";

import { useEffect, useState } from "react";

// Generic fetch hook - can be used for budgets, products, etc.
const useFetch = <T = any>(url: string, id?: string) => {
  const [item, setItem] = useState<T | null>(null);

  const fetchData = async () => {
    let urlExt = "";
    if (id) urlExt = `/${id}`;
    const res = await fetch(`${url}${urlExt}`);
    if (res.ok) {
      return (await res.json()) as T;
    } else {
      throw new Error("Error fetching the data.");
    }
  };

  useEffect(() => {
    fetchData()
      .then((data) => setItem(data))
      .catch((error) => {
        console.error(error);
      });
    // Re-run if url or id changes
  }, [url, id]);

  return item;
};

export default useFetch;
