import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// sample private page checking if user is logged in
import React from "react";

const PrivatePage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  console.log("Data:", data);

  return <p>Hello {data.user.email}</p>;
};

export default PrivatePage;
