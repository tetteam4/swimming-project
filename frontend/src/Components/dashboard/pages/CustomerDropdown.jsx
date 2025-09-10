import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

const CustomerDropdown = ({ customers, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cabinet_number.toString().includes(search)
  );

  const selectedCustomer = customers.find((c) => c.id === value);

  return (
    <div className="relative w-full">
      {/* Button like select */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="border p-2 rounded w-full flex justify-between items-center bg-gray-200"
      >
        <span>
          {selectedCustomer
            ? `${selectedCustomer.name} - ${selectedCustomer.cabinet_number}`
            : "انتخاب مشتری"}
        </span>
        <IoChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50  w-full bg-white border mt-1 rounded shadow">
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی مشتری..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Customer list */}
          <ul className="max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    onChange(c.id);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {c.name} - {c.cabinet_number}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">یافت نشد</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;
