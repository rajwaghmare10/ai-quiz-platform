import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onCreateClick={() => setModalOpen(true)}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet context={{ search, modalOpen, setModalOpen }} />
      </main>
    </div>
  );
};

export default AppLayout;