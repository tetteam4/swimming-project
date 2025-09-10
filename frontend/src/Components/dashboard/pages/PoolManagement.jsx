import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import SubmitBtn from "../../../utils/SubmitBtn";
import { FaCheck, FaRegEdit } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import CancelBtn from "../../../utils/CancelBtn";
import { formatDateTime } from "./dateformater";
import Pagination from "./comp/Pagination";
import PoolBill from "./comp/PoolBill";
import { FaXmark } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { BiSwim } from "react-icons/bi";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PoolManagement = () => {
  const token = useSelector((state) => state.user.accessToken);

  const [stocks, setStocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    num_people: "",
    cabinet_number: "",
    total_pay: "",
    rent: {}, // ✅ added
    tools: [], // ✅ added
  });

  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20; // or whatever your API page size is
  const headers = { Authorization: `Bearer ${token}` };

  // --- fetch stocks from API or fallback ---
  const fetchPool = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/pool/api/pools/?page=${page}`,
        {
          headers,
        }
      );
      setStocks(res.data.results);
      setTotalItems(res.data.count); // assuming API returns total count
    } catch (err) {
      console.warn("⚠️ API unavailable, using mock data");
    }
  };

  useEffect(() => {
    fetchPool(currentPage);
  }, [currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleCalculated = async (sale) => {
    if (!token) return;

    const newValue = !sale.is_calculated;

    try {
      await axios.patch(
        `${BASE_URL}/api/v1/pool/api/pools/${sale.id}/`,
        { is_calculated: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state immediately
      setStocks((prev) =>
        prev.map((s) =>
          s.id === sale.id ? { ...s, is_calculated: newValue } : s
        )
      );

      Swal.fire(
        "موفق!",
        `وضعیت محاسبه مشتری تغییر کرد به ${newValue ? "✅" : "❌"}`,
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire("خطا!", "تغییر وضعیت انجام نشد.", "error");
    }
  };
  // --- create or update ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEntry = {
      id: editingId || Date.now(),
      name: formData.name,
      num_people: parseInt(formData.num_people),
      cabinet_number: parseInt(formData.cabinet_number),
      total_pay: parseFloat(formData.total_pay),
      rent: formData.rent, // ✅ added
      tools: formData.tools, // ✅ added
    };

    try {
      if (editingId) {
        await axios.patch(
          `${BASE_URL}/api/v1/pool/api/pools/${editingId}/`,
          newEntry,
          { headers }
        );
        Swal.fire("به‌روزرسانی شد!", "با موفقیت تغییر کرد.", "success");
      } else {
        await axios.post(`${BASE_URL}/api/v1/pool/api/pools/`, newEntry, {
          headers,
        });
        Swal.fire("ایجاد شد!", "با موفقیت ذخیره شد.", "success");
      }
      fetchPool();
    } catch (error) {
      console.error(error.response?.data);
      Swal.fire("خطا!", "لطفاً فیلدها را درست پر کنید.", "error");
    }

    // reset form
    setFormData({
      name: "",
      num_people: "",
      cabinet_number: "",
      total_pay: "",
      rent: {}, // ✅ reset
      tools: [], // ✅ reset
    });

    setEditingId(null);
    setShowForm(false);
  };

  // --- delete ---
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عمل قابل بازگشت نمی‌باشد.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود!",
      cancelButtonText: "انصراف",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/v1/pool/api/pools/${id}/`, {
        headers,
      });
      Swal.fire("حذف شد!", "با موفقیت حذف گردید.", "success");
      fetchStocks();
    } catch {
      setStocks((prev) => prev.filter((s) => s.id !== id));
      Swal.fire("آفلاین!", "از mock data حذف شد.", "info");
    }
  };

  const handleEdit = (stock) => {
    setFormData({
      name: stock.name || "",
      num_people: stock.num_people || "",
      cabinet_number: stock.cabinet_number || "",
      total_pay: stock.total_pay || "",
      rent: stock.rent || {}, // ✅ keep rent safe
      tools: stock.tools || [], // ✅ keep tools safe
    });
    setEditingId(stock.id);
    setShowForm(true);
  };

  return (
    <div className="px-5 py-10">
      <div>
        {/* Button to open modal */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-x-2 hover:bg-blue-700"
          >
            <BiSwim size={20} />
            افزودن مشتری جدید
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-3xl min-h-[450px] max-h-[600px] overflow-y-auto px-6 py-10 rounded-lg shadow-lg relative">
              <h2 className="text-xl font-bold text-center mb-4">
                {editingId ? "ویرایش مشتری" : "افزودن مشتری"}
              </h2>

              {/* Close button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
              >
                <FaXmark size={26} />
              </button>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="نام"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />

                  <input
                    type="number"
                    placeholder="تعداد نفرات"
                    value={formData.num_people}
                    onChange={(e) =>
                      setFormData({ ...formData, num_people: e.target.value })
                    }
                    className="input-field"
                    required
                  />

                  <input
                    type="number"
                    placeholder="نمبر صندق"
                    value={formData.cabinet_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cabinet_number: e.target.value,
                      })
                    }
                    className="input-field"
                  />

                  <input
                    type="number"
                    placeholder="مجموع پرداختی"
                    value={formData.total_pay}
                    onChange={(e) =>
                      setFormData({ ...formData, total_pay: e.target.value })
                    }
                    className="input-field"
                  />

                  {/* Rent section */}
                  {Object.entries(formData.rent).map(([key, value], idx) => (
                    <div
                      key={idx}
                      className=" gap-x-4 gap-y-2 mb-2 col-span-2 grid grid-cols-2"
                    >
                      <input
                        type="text"
                        placeholder="کلید"
                        value={key}
                        onChange={(e) => {
                          const newRent = { ...formData.rent };
                          const oldValue = newRent[key];
                          delete newRent[key];
                          newRent[e.target.value] = oldValue;
                          setFormData({ ...formData, rent: newRent });
                        }}
                        className="input-field"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="مقدار"
                          value={value}
                          onChange={(e) => {
                            const newRent = {
                              ...formData.rent,
                              [key]: e.target.value,
                            };
                            setFormData({ ...formData, rent: newRent });
                          }}
                          className="input-field "
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newRent = { ...formData.rent };
                            delete newRent[key];
                            setFormData({ ...formData, rent: newRent });
                          }}
                          className="bg-red-500 text-white px-2 py-2 rounded"
                        >
                          <FaXmark size={24} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const newRent = { ...formData.rent };
                      newRent[`کلید${Object.keys(newRent).length + 1}`] = "";
                      setFormData({ ...formData, rent: newRent });
                    }}
                    className="bg-blue-500 text-white flex items-center  gap-x-2 justify-center px-3 py-2 rounded col-span-2"
                  >
                    <FaPlus />
                    <span className="text-lg">پرداخت</span>
                  </button>

                  <div className="col-span-2 space-y-2">
                    <span className="text-gray-600">امانتداری وسایل قیمتی</span>
                    <input
                      type="text"
                      placeholder="ابزار (با کاما جدا کنید)"
                      value={formData.tools.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tools: e.target.value.split(",").map((t) => t.trim()),
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  <SubmitBtn
                    type="submit"
                    title={editingId ? "ذخیره تغییرات" : "ثبت"}
                  />
                  <CancelBtn
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        name: "",
                        num_people: "",
                        cabinet_number: "",
                        total_pay: "",
                        rent: {},
                        tools: [],
                      });
                    }}
                    title="انصراف"
                    type="button"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* --- list --- */}
      <div className="">
        <table className="w-full border bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white text-center">
              <th className="px-4 py-2">نام</th>
              <th className="px-4 py-2">تعداد نفرات</th>
              <th className="px-4 py-2">نمبر صندق</th>
              <th className="px-4 py-2">مجموع پرداختی</th>
              <th className="px-4 py-2">محاسبه شده؟</th>
              <th className="px-4 py-2">عملیات</th>
              <th className="px-4 py-2">تاریخ</th>
              <th className="px-4 py-2">چاپ بل</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(stocks) &&
              stocks.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`text-center ${
                    idx % 2 === 0 ? "bg-gray-100" : ""
                  }`}
                >
                  <td>{s.name}</td>
                  <td>{s.num_people}</td>
                  <td>{s.cabinet_number}</td>
                  <td>{s.total_pay}</td>{" "}
                  <td className="px-4 py-2">
                    <button
                      className={`px-2 py-2  rounded-full ${
                        s.is_calculated
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => toggleCalculated(s)}
                    >
                      {s.is_calculated ? (
                        <FaCheck size={15} />
                      ) : (
                        <FaXmark size={15} />
                      )}
                    </button>
                  </td>
                  <td className="flex justify-center gap-x-4 py-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-500"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500"
                    >
                      <IoTrashSharp size={20} />
                    </button>
                  </td>
                  <td>{formatDateTime(s.created_at)}</td>
                  <td>
                    {" "}
                    <PoolBill customer={s} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalOrders={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PoolManagement;
