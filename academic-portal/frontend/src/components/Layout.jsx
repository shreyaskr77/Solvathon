import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout(){
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 w-full bg-gray-50 dark:bg-gray-900 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
