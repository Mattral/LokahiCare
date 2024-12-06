"use client";
import { useState } from "react";

const DocumentTable = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Table for User Personal and Professional Identity */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-300">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-lg">
            <tr>
              <th className="px-8 py-4 text-left font-semibold">User Personal Identity</th>
              <th className="px-8 py-4 text-left font-semibold">Professional Identity</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-100">
              <td className="px-8 py-4 text-sm text-gray-700">Passport</td>
              <td className="px-8 py-4 text-sm text-gray-700">Medical Degree</td>
            </tr>
            <tr className="border-t hover:bg-gray-100">
              <td className="px-8 py-4 text-sm text-gray-700">National ID</td>
              <td className="px-8 py-4 text-sm text-gray-700">Medical License</td>
            </tr>
            <tr className="border-t hover:bg-gray-100">
              <td className="px-8 py-4 text-sm text-gray-700">Driving License</td>
              <td className="px-8 py-4 text-sm text-gray-700">Medical Registration</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
