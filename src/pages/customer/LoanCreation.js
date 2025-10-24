import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Alert, Form } from "react-bootstrap";
import { TextInputForm, Calender } from "../../components/Forms";
import {
  ClickButton,
  ChooseButton,
  Delete,
} from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import { MdDeleteForever } from "react-icons/md";

const LoanCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const fileInputRef = useRef(null);
  const aadharFileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchCutomernu, setSearchcutomernumber] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [productList, setProductList] = useState([]);

  console.log("productList:", productList);

  const today = new Date();
  const defaultDate = today.toISOString().substr(0, 10);

  const initialState =
    type === "edit"
      ? {
          ...rowData,
          pawnjewelry_date: rowData.pawnjewelry_date || defaultDate,
          dateofbirth: rowData.dateofbirth || "",
          proof_number: rowData.proof_number || "",
          upload_type: rowData.upload_type || "",
          proof: rowData.proof.map((url, index) => {
            const extension = url.split(".").pop()?.toLowerCase();
            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
            return {
              name: `file_${index + 1}.${extension}`,
              data: url,
              type: isImage ? "image" : "file",
            };
          }),
          aadharproof: rowData.aadharproof.map((url, index) => {
            const extension = url.split(".").pop()?.toLowerCase();
            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
            return {
              name: `file_${index + 1}.${extension}`,
              data: url,
              type: isImage ? "image" : "file",
            };
          }),
          jewel_product: rowData.jewel_product || [
            {
              JewelName: "",
              count: "",
              weight: "",
              deduction_weight: "",
              net: "",
              remark: "",
              carrat: "",
            },
          ],
          // New bank pledge fields
          bank_pledge_date: rowData.bank_pledge_date || defaultDate,
          bank_assessor_name: rowData.bank_assessor_name || "",
          bank_name: rowData.bank_name || "",
          bank_pawn_value: rowData.bank_pawn_value || "",
          bank_interest: rowData.bank_interest || "",
          bank_duration: rowData.bank_duration || "",
          bank_additional_charges: rowData.bank_additional_charges || "",
          location: rowData.location || "",
        }
      : type === "repledge"
      ? {
          ...rowData,
          receipt_no: "",
          pawnjewelry_date: defaultDate,
          dateofbirth: rowData.dateofbirth || "",
          proof_number: rowData.proof_number || "",
          upload_type: rowData.upload_type || "",
          proof:
            rowData.proof?.map((url, index) => {
              const extension = url.split(".").pop()?.toLowerCase();
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
              return {
                name: `file_${index + 1}.${extension}`,
                data: url,
                type: isImage ? "image" : "file",
              };
            }) || [],
          aadharproof:
            rowData.aadharproof?.map((url, index) => {
              const extension = url.split(".").pop()?.toLowerCase();
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
              return {
                name: `file_${index + 1}.${extension}`,
                data: url,
                type: isImage ? "image" : "file",
              };
            }) || [],
          jewel_product: rowData.jewel_product || [
            {
              JewelName: "",
              count: "",
              weight: "",
              deduction_weight: "",
              net: "",
              remark: "",
              carrat: "",
            },
          ],
          // New bank pledge fields (if needed, set to empty or previous)
          bank_pledge_date: defaultDate,
          bank_assessor_name: "",
          bank_name: "",
          bank_pawn_value: "",
          bank_interest: "",
          bank_duration: "",
          bank_additional_charges: "",
          location: "",
        }
      : {
          customer_no: rowData?.customer_no || "",
          receipt_no: "",
          pawnjewelry_date: defaultDate,
          name: rowData?.name || "",
          customer_details: rowData?.customer_details || "",
          place: rowData?.place || "",
          mobile_number: rowData?.mobile_number || "",
          dateofbirth: rowData?.dateofbirth || "",
          proof_number: rowData?.proof_number || "",
          upload_type: rowData?.upload_type || "",
          original_amount: "",
          interest_rate: "",
          Jewelry_recovery_agreed_period: "",
          proof:
            rowData?.proof?.map((url, index) => {
              const extension = url.split(".").pop()?.toLowerCase();
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
              return {
                name: `file_${index + 1}.${extension}`,
                data: url,
                type: isImage ? "image" : "file",
              };
            }) || [],
          aadharproof:
            rowData?.aadharproof?.map((url, index) => {
              const extension = url.split(".").pop()?.toLowerCase();
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
              return {
                name: `file_${index + 1}.${extension}`,
                data: url,
                type: isImage ? "image" : "file",
              };
            }) || [],
          group_type: "Gold",
          jewel_product: [
            {
              JewelName: "",
              count: "",
              weight: "",
              deduction_weight: "",
              net: "",
              remark: "",
              carrat: "",
            },
          ],
          // New bank pledge fields
          bank_pledge_date: defaultDate,
          bank_assessor_name: "",
          bank_name: "",
          bank_pawn_value: "",
          bank_interest: "",
          bank_duration: "",
          bank_additional_charges: "",
          location: "",
        };

  const [formData, setFormData] = useState(initialState);
  console.log(formData);
  const [error, setError] = useState("");
  const [grupData, setGrupData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCapturePage, setShowCapturePage] = useState(false);
  const [stream, setStream] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  console.log(formData);
  const handleChange = (e, field, rowIndex) => {
    const { value } = e.target;
    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      updatedFormData.jewel_product = formData.jewel_product.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row
      );
    } else {
      updatedFormData[field] = value;

      if (["customer_no", "name", "mobile_number"].includes(field)) {
        if (field === "name") setSearchName(value);
        if (field === "mobile_number") setSearchMobile(value);
        if (field === "customer_no") setSearchcutomernumber(value);

        if (value.length >= 2) {
          fetchDatajewelpawncustomer({ text: value, field }).then(
            (customers) => {
              setCustomerSuggestions(customers);
            }
          );
        } else {
          setCustomerSuggestions([]);
        }
      }

      if (field === "group_type") {
        fetchPawnJewelry();
      }

      if (field === "customer_no" && rowIndex === undefined) {
        const customer = customerData.find(
          (cust) => cust.customer_no === value
        );
        if (customer) {
          updatedFormData = {
            ...updatedFormData,
            name: customer.name || "",
            customer_details: customer.customer_details || "",
            place: customer.place || "",
            mobile_number: customer.mobile_number || "",
            dateofbirth: customer.dateofbirth || "",
            proof_number: customer.proof_number || "",
            upload_type: customer.upload_type || "",
            proof: customer.proof.map((url, index) => {
              const extension = url.split(".").pop()?.toLowerCase();
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
              return {
                name: `file_${index + 1}.${extension}`,
                data: url,
                type: isImage ? "image" : "file",
              };
            }),
            aadharproof: customer.aadharproof.map((url, index) => {
              const extension = url.split(".").pop()?.toLowerCase();
              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
              return {
                name: `file_${index + 1}.${extension}`,
                data: url,
                type: isImage ? "image" : "file",
              };
            }),
          };
        } else {
          updatedFormData = {
            ...updatedFormData,
            name: "",
            customer_details: "",
            place: "",
            mobile_number: "",
            dateofbirth: "",
            proof_number: "",
            upload_type: "",
            proof: [],
            aadharproof: [],
          };
        }
      }
    }

    setFormData(updatedFormData);
  };

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      customer_no: customer.customer_no || "",
      name: customer.name || "",
      customer_details: customer.customer_details || "",
      place: customer.place || "",
      mobile_number: customer.mobile_number || "",
      dateofbirth: customer.dateofbirth || "",
      proof_number: customer.proof_number || "",
      upload_type: customer.upload_type || "",
      proof: customer.proof.map((url, index) => {
        const extension = url.split(".").pop()?.toLowerCase();
        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
        return {
          name: `file_${index + 1}.${extension}`,
          data: url,
          type: isImage ? "image" : "file",
        };
      }),
      aadharproof: customer.aadharproof.map((url, index) => {
        const extension = url.split(".").pop()?.toLowerCase();
        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
        return {
          name: `file_${index + 1}.${extension}`,
          data: url,
          type: isImage ? "image" : "file",
        };
      }),
    });
    setSearchName("");
    setSearchMobile("");
    setSearchcutomernumber("");
    setCustomerSuggestions([]);
  };

  const handleGroupTypeChange = (e) => {
    if (type === "edit") return;
    const selectedGroupType = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      group_type: selectedGroupType,
    }));
    // Immediately fetch new receipt_no based on the selected group_type
    fetchPawnJewelry(selectedGroupType);
  };

  const handleFileChange = (files, field) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const maxSize = 5 * 1024 * 1024;

      fileArray.forEach((file) => {
        if (file.size > maxSize) {
          toast.error(`${file.name} exceeds 5MB limit.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          if (file.type.startsWith("image/")) {
            setFormData((prevData) => ({
              ...prevData,
              [field]: [
                ...prevData[field],
                { type: "image", data: reader.result, name: file.name },
              ],
            }));
          } else if (file.type === "application/pdf") {
            setFormData((prevData) => ({
              ...prevData,
              [field]: [
                ...prevData[field],
                { type: "pdf", data: reader.result, name: file.name },
              ],
            }));
          } else {
            toast.error(`${file.name}: Only images and PDFs are allowed.`, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          }
        };

        reader.onerror = () => {
          toast.error(`Failed to read ${file.name}.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
        };

        reader.readAsDataURL(file);
      });

      toast.success("File(s) uploaded successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } else {
      toast.error("Please select valid files.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleImageDelete = (index, field) => {
    const newFiles = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newFiles });

    if (newFiles.length === 0) {
      if (field === "proof" && fileInputRef.current) {
        fileInputRef.current.value = "";
      } else if (field === "aadharproof" && aadharFileInputRef.current) {
        aadharFileInputRef.current.value = "";
      }
    }

    toast.info("File removed successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const setLabel = (date, label) => {
    let dateString =
      date instanceof Date ? date.toISOString().substr(0, 10) : date;
    if (!dateString || isNaN(new Date(dateString))) {
      console.error("Invalid date:", date);
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [label]: dateString,
    }));
  };

  const handleSubmit = async () => {
    // Utility function to convert URL files to Base64 if needed
    const convertToBase64IfUrl = async (file) => {
      const { data } = file;
      if (typeof data === "string" && data.startsWith("http")) {
        const response = await fetch(data);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ data: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      return file;
    };

    // Convert all proof files to Base64
    const proofBase64Array = await Promise.all(
      formData.proof.map(convertToBase64IfUrl)
    );
    const aadharproofBase64Array = await Promise.all(
      formData.aadharproof.map(convertToBase64IfUrl)
    );
    setLoading(true);
    try {
      // Submit Pawn Jewelry Data
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          proof: proofBase64Array,
          aadharproof: aadharproofBase64Array,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
        // Calculate first month interest
        const originalAmount = parseFloat(formData.original_amount || 0);
        const interestRate = parseFloat(formData.interest_rate || 0);
        const monthlyInterest = (originalAmount * interestRate) / 100;

        // Prepare payload for first month interest entry
        const currentDate = new Date().toISOString().split("T")[0];

        const interestPayload = {
          edit_interest_id: "",
          receipt_no: formData.receipt_no,
          interest_receive_date: currentDate,
          name: formData.name,
          customer_details: formData.customer_details,
          place: formData.place,
          mobile_number: formData.mobile_number,
          original_amount: formData.original_amount,
          interest_rate: formData.interest_rate,
          jewel_product: formData.jewel_product,
          interest_income: monthlyInterest,
          outstanding_period: "1",
          outstanding_amount: monthlyInterest,
          topup_amount: 0,
          deduction_amount: 0,
        };
        setLoading(true);
        try {
          // Call Interest API
          const interestRes = await fetch(`${API_DOMAIN}/interest.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(interestPayload),
          });

          const interestData = await interestRes.json();

          if (interestData.head.code === 200) {
            toast.success("First month interest paid successfully.", {
              position: "top-center",
              autoClose: 2000,
            });
          } else {
            toast.error("Interest entry failed: " + interestData.head.msg, {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } catch (error) {
          console.error("Interest API error:", error);
          toast.error("Failed to pay first month interest.", {
            position: "top-center",
            autoClose: 2000,
          });
        }

        setTimeout(() => {
          navigate(-1);
        }, 1000);
        setLoading(false);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);
    const convertToBase64IfUrl = async (file) => {
      const { data } = file;
      if (typeof data === "string" && data.startsWith("http")) {
        const response = await fetch(data);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ data: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      return file;
    };

    const proofBase64Array = await Promise.all(
      formData.proof.map(convertToBase64IfUrl)
    );
    const aadharproofBase64Array = await Promise.all(
      formData.aadharproof.map(convertToBase64IfUrl)
    );

    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_pawnjewelry_id: rowData.pawnjewelry_id,
          customer_no: formData.customer_no,
          receipt_no: formData.receipt_no,
          pawnjewelry_date: formData.pawnjewelry_date,
          name: formData.name,
          customer_details: formData.customer_details,
          place: formData.place,
          mobile_number: formData.mobile_number,
          dateofbirth: formData.dateofbirth,
          proof_number: formData.proof_number,
          upload_type: formData.upload_type,
          original_amount: formData.original_amount,
          interest_rate: formData.interest_rate,
          jewel_product: formData.jewel_product,
          Jewelry_recovery_agreed_period:
            formData.Jewelry_recovery_agreed_period,
          group_type: formData.group_type,
          proof: proofBase64Array,
          aadharproof: aadharproofBase64Array,
          // New bank pledge fields
          bank_pledge_date: formData.bank_pledge_date,
          bank_assessor_name: formData.bank_assessor_name,
          bank_name: formData.bank_name,
          bank_pawn_value: formData.bank_pawn_value,
          bank_interest: formData.bank_interest,
          bank_duration: formData.bank_duration,
          bank_additional_charges: formData.bank_additional_charges,
          location: formData.location,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update data. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    setLoading(false);
  };

  const fetchDatacategory = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/category.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setCategoryData(responseData.body.category);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchgroup = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setGrupData(responseData.body.group);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchDatajewelpawncustomer = async (searchQuery = {}) => {
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchQuery.text || "",
          search_field: searchQuery.field || "customer_no",
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setcustomerData(responseData.body.customer || []);
        return responseData.body.customer || [];
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
      return [];
    }
  };

  const fetchuser = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        const user = JSON.parse(localStorage.getItem("user"));
        let sortedData = responseData.body.user;
        if (user && user.role === "பணியாளர்") {
          sortedData = Array.isArray(sortedData)
            ? sortedData.filter((user) => user.RoleSelection === "பணியாளர்")
            : sortedData.RoleSelection === "பணியாளர்"
            ? [sortedData]
            : [];
        }
        setUserData(Array.isArray(sortedData) ? sortedData : [sortedData]);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchPawnJewelry = async (groupType) => {
    const groupTypeUpper = groupType ? groupType.toUpperCase() : "";
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        const pawnJewelry = responseData.body.pawnjewelry || [];

        // Determine prefix based on group_type
        let prefix = "A"; // Default fallback
        if (groupTypeUpper === "GOLD") {
          prefix = "G";
        } else if (groupTypeUpper === "SILVER") {
          prefix = "S";
        }

        // Extract and filter receipts matching the prefix
        const filteredReceipts = pawnJewelry
          .filter(
            (pawn) => pawn.receipt_no && pawn.receipt_no.startsWith(prefix)
          )
          .map((pawn) => {
            const numericPart = pawn.receipt_no.slice(1);
            return parseInt(numericPart, 10);
          })
          .filter((num) => !isNaN(num));

        // Find maximum numeric part within the filtered set
        const maxReceiptNo = filteredReceipts.length
          ? Math.max(...filteredReceipts)
          : 0;

        // Generate next receipt number
        const nextReceiptNo =
          prefix + (maxReceiptNo + 1).toString().padStart(4, "0");

        setFormData((prev) => ({
          ...prev,
          receipt_no: nextReceiptNo,
        }));
      } else {
        console.error("Failed to fetch pawn jewelry:", responseData.head.msg);
        // Set default initial receipt number based on group_type
        const defaultPrefix =
          groupTypeUpper === "GOLD"
            ? "G"
            : groupTypeUpper === "SILVER"
            ? "S"
            : "A";
        setFormData((prev) => ({
          ...prev,
          receipt_no: defaultPrefix + "0001",
        }));
      }
    } catch (error) {
      console.error("Error fetching pawn jewelry:", error);
      const defaultPrefix =
        groupTypeUpper === "GOLD"
          ? "G"
          : groupTypeUpper === "SILVER"
          ? "S"
          : "A";
      setFormData((prev) => ({
        ...prev,
        receipt_no: defaultPrefix + "0001",
      }));
    }
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      });
      setStream(mediaStream);
      setShowCapturePage(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
            toast.error("Failed to play webcam feed.", {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          });
        }
      }, 100);
    } catch (err) {
      console.warn(
        "Webcam access failed or not available. Fallback to file upload."
      );
      toast.info("No camera detected. Opening file upload instead.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      setShowCapturePage(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
      setFormData((prevData) => ({
        ...prevData,
        proof: [
          ...prevData.proof,
          {
            type: "image",
            data: dataUrl,
            name: `captured_${Date.now()}.jpeg`,
          },
        ],
      }));
      toast.success("Image captured successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      stopWebcam();
      setShowCapturePage(false);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      setLoading(false);

      if (responseData.head.code === 200) {
        setProductList(responseData.body.product); // <- Jewel names
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchgroup();
    fetchDatacategory();
    fetchuser();
    fetchData();
    fetchDatajewelpawncustomer();
    if (type !== "edit") {
      fetchPawnJewelry(formData.group_type);
    }
    return () => {
      stopWebcam();
    };
  }, [type, formData.group_type]);

  if (showCapturePage) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container fluid>
          <Row className="py-3">
            <Col>
              <h3>Capture Image</h3>
            </Col>
            <Col className="text-end">
              <ClickButton
                label="Close"
                onClick={() => {
                  stopWebcam();
                  setShowCapturePage(false);
                }}
              />
            </Col>
          </Row>
          <Row
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Col xs={12} md={8} lg={6} className="text-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  backgroundColor: "black",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="mt-3">
                <ChooseButton label="Capture" onClick={captureImage} />
                <ChooseButton
                  label="Cancel"
                  onClick={() => {
                    stopWebcam();
                    setShowCapturePage(false);
                  }}
                  style={{ marginLeft: "10px" }}
                />
                <ChooseButton
                  label="Gallery"
                  onClick={() => {
                    stopWebcam();
                    setShowCapturePage(false);
                    setTimeout(() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }, 0);
                  }}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <input
          type="file"
          id="proof"
          accept=".pdf,image/*"
          ref={fileInputRef}
          multiple
          onChange={(e) => handleFileChange(e.target.files, "proof")}
          style={{ display: "none" }}
        />
        <input
          type="file"
          id="aadharproof"
          accept=".pdf,image/*"
          ref={aadharFileInputRef}
          multiple
          onChange={(e) => handleFileChange(e.target.files, "aadharproof")}
          style={{ display: "none" }}
        />
      </div>
    );
  }

  const handleAddRow = () => {
    setFormData({
      ...formData,
      jewel_product: [
        ...formData.jewel_product,
        {
          JewelName: "",
          count: "",
          weight: "",
          deduction_weight: "",
          net: "",
          remark: "",
          carrat: "",
        },
      ],
    });
  };

  const handleDeleteRow = (index) => {
    if (formData.jewel_product.length === 1) {
      return;
    }
    const updatedRows = formData.jewel_product.filter(
      (row, rowIndex) => rowIndex !== index
    );
    setFormData({
      ...formData,
      jewel_product: updatedRows,
    });
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      if (
        formData.jewel_product[index].JewelName &&
        formData.jewel_product[index].weight &&
        formData.jewel_product[index].deduction_weight &&
        formData.jewel_product[index].count
      ) {
        handleAddRow();
      } else {
        toast.error(
          "Please fill in JewelName, weight, deduction_weight, and count before adding a new row"
        );
      }
    }
  };

  return (
    <div>
      <Container fluid>
        <Row className="regular">
          <Col lg="12" md="6" xs="12" className="py-3">
            <PageNav
              pagetitle={`Loan${
                type === "edit"
                  ? " Edit"
                  : type === "repledge"
                  ? " Re-Pledge"
                  : " Creation"
              }`}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Customer No"}
              labelname={"Customer No"}
              name="customer_no"
              value={formData.customer_no}
              onChange={(e) => handleChange(e, "customer_no")}
              disabled={type === "repledge"}
            />
            {customerSuggestions.length > 0 && searchCutomernu && (
              <ul
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer.customer_no}
                    onClick={() => handleCustomerSelect(customer)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#fff")
                    }
                  >
                    {customer.name} ({customer.customer_no},{" "}
                    {customer.mobile_number})
                  </li>
                ))}
              </ul>
            )}
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Loan No"}
              labelname={"Loan No"}
              name="receipt_no"
              value={formData.receipt_no}
              onChange={(e) => handleChange(e, "receipt_no")}
              readOnly={type === "edit"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "pawnjewelry_date")}
              initialDate={formData.pawnjewelry_date}
              calenderlabel="Date"
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Name"}
              labelname={"Name"}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
            />
            {customerSuggestions.length > 0 && searchName && (
              <ul
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer.customer_no}
                    onClick={() => handleCustomerSelect(customer)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#fff")
                    }
                  >
                    {customer.name} ({customer.customer_no},{" "}
                    {customer.mobile_number})
                  </li>
                ))}
              </ul>
            )}
          </Col>
          <Col lg="3" md="4" xs="12" className="py-4">
            <label htmlFor="customer_details" className="form-label">
              Address
            </label>
            <textarea
              className="form-cntrl-bt w-100"
              placeholder={"Address"}
              name="customer_details"
              value={formData.customer_details}
              onChange={(e) => handleChange(e, "customer_details")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Place"}
              labelname={"Place"}
              name="place"
              value={formData.place}
              onChange={(e) => handleChange(e, "place")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Mobile Number"}
              labelname={"Mobile Number"}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleChange(e, "mobile_number")}
            />
            {customerSuggestions.length > 0 && searchMobile && (
              <ul
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer.customer_no}
                    onClick={() => handleCustomerSelect(customer)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#fff")
                    }
                  >
                    {customer.name} ({customer.customer_no},{" "}
                    {customer.mobile_number})
                  </li>
                ))}
              </ul>
            )}
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "dateofbirth")}
              initialDate={formData.dateofbirth}
              calenderlabel="Date of Birth"
              disabled={true}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"principal amount"}
              labelname={"principal amount"}
              name="original_amount"
              value={formData.original_amount}
              onChange={(e) => handleChange(e, "original_amount")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <div className="form-group">
              <label className="py-1">Group Type</label>
              <select
                className="form-cntrl-bt w-100 p-1"
                name="group_type"
                value={formData.group_type}
                onChange={handleGroupTypeChange}
                disabled={type === "edit"}
              >
                <option value="">Select group</option>
                {grupData.map((group) => (
                  <option key={group.Group_id} value={group.Group_type}>
                    {group.Group_type}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Form.Group controlId="interestRate">
              <Form.Label>Interest Rate</Form.Label>
              <Form.Select
                name="interest_rate"
                value={formData.interest_rate}
                onChange={(e) => handleChange(e, "interest_rate")}
              >
                <option value="">-- Select Interest Rate --</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((percentage) => (
                  <option key={percentage} value={percentage}>
                    {percentage} பைசா
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col lg="3" md="4" xs="12" className="py-3">
            <div className="form-group">
              <label className="py-1">Jewelry Recovery Agreed Period</label>
              <select
                className="form-cntrl-bt w-100 p-1"
                name="Jewelry_recovery_agreed_period"
                value={formData.Jewelry_recovery_agreed_period}
                onChange={(e) =>
                  handleChange(e, "Jewelry_recovery_agreed_period")
                }
              >
                <option value="">-- Select Period --</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="9">9 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-5">
            <div className="file-upload">
              <label>
                {type === "edit" ? "Preview Ornament" : "Upload Ornament"}
              </label>
              <input
                type="file"
                id="proof"
                accept=".pdf,image/*"
                ref={fileInputRef}
                multiple
                onChange={(e) => handleFileChange(e.target.files, "proof")}
                style={{ display: "none" }}
              />
              <ChooseButton
                label="Choose File"
                onClick={startWebcam}
                className="choosefilebtn"
              />
              {formData.proof.map((file, index) => (
                <div
                  key={index}
                  className="file-item d-flex align-items-center mb-2"
                >
                  {file.type === "image" ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        marginRight: "10px",
                      }}
                    >
                      {isLoading && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100px",
                            height: "100px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f8f8f8",
                            borderRadius: "5px",
                          }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                      <img
                        src={file.data}
                        alt={`Preview ${file.name}`}
                        onLoad={() => setIsLoading(false)}
                        onError={(e) => {
                          e.target.src = "path/to/fallback-image.png";
                          toast.error(`Failed to load image: ${file.name}`, {
                            position: "top-center",
                            autoClose: 2000,
                            theme: "colored",
                          });
                          setIsLoading(false);
                        }}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          display: isLoading ? "none" : "block",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="file-info" style={{ marginRight: "10px" }}>
                      <p>
                        <a
                          href={file.data}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.name}
                        </a>{" "}
                        ({file.type ? file.type.toUpperCase() : "UNKNOWN"})
                      </p>
                    </div>
                  )}
                  <ChooseButton
                    label="Preview"
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handlePreview(file)}
                  />
                  <ChooseButton
                    label="Delete"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleImageDelete(index, "proof")}
                  />
                </div>
              ))}
            </div>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-5">
            <div className="file-upload">
              <label>
                {type === "edit" ? "Preview Proof Files" : "Upload Proof"}
              </label>
              {formData.aadharproof && formData.aadharproof.length > 0 && (
                <div className="file-preview mt-2">
                  {formData.aadharproof.map((file, index) => (
                    <div
                      key={index}
                      className="file-item d-flex align-items-center mb-2"
                    >
                      {file.type === "image" ? (
                        <img
                          src={file.data}
                          alt={`Preview ${file.name}`}
                          onError={(e) => {
                            e.target.src = "/assets/fallback-image.png";
                            toast.error(`Failed to load image: ${file.name}`, {
                              position: "top-center",
                              autoClose: 2000,
                              theme: "colored",
                            });
                          }}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "10px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <div
                          className="file-info"
                          style={{ marginRight: "10px" }}
                        >
                          <p>
                            <a
                              href={file.data}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.name}
                            </a>{" "}
                            ({file.type ? file.type.toUpperCase() : "UNKNOWN"})
                          </p>
                        </div>
                      )}
                      <ChooseButton
                        label="Preview"
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handlePreview(file)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col lg="12" md="6" xs="12">
            <table className="table table-bordered mx-auto">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>S.No</th>
                  <th style={{ width: "20%" }}>நகை பெயர்</th>
                  <th style={{ width: "10%" }}>தரம்</th>
                  <th style={{ width: "8%" }}>எண்ணிக்கை</th>
                  <th style={{ width: "10%" }}>மொத்த எடை(gm)</th>
                  <th style={{ width: "10%" }}>கழிவு எடை(gm)</th>
                  <th style={{ width: "10%" }}>நிகர எடை(gm)</th>
                  <th style={{ width: "20%" }}>குறிப்பு</th>
                  <th style={{ width: "5%" }}></th>
                  <th style={{ width: "7%" }}>நீக்கு</th>
                </tr>
              </thead>
              <tbody>
                {formData.jewel_product &&
                  formData.jewel_product.length > 0 &&
                  formData.jewel_product.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      {/* Jewel Name Dropdown */}
                      <td>
                        <select
                          className="form-cntrl w-100"
                          value={row.JewelName}
                          onChange={(e) => handleChange(e, "JewelName", index)}
                          autoFocus={
                            index === formData.jewel_product.length - 1
                          }
                        >
                          <option value="">தேர்வு செய்க</option>
                          {productList
                            .filter(
                              (product) =>
                                product.group_name === formData.group_type
                            )
                            .map((item, idx) => (
                              <option key={idx} value={item.product_eng}>
                                {item.product_eng}
                              </option>
                            ))}
                        </select>
                      </td>

                      {/* Carat Dropdown */}
                      <td>
                        <select
                          className="form-cntrl w-100"
                          value={row.carrat}
                          onChange={(e) => handleChange(e, "carrat", index)}
                        >
                          <option value="">தேர்வு செய்க</option>

                          <option value="20 Carat">20 Carat</option>
                          <option value="22 Carat">22 Carat</option>
                          <option value="916">916</option>
                          <option value="916 KDM">916 KDM</option>
                          <option value="BIS Hall Mark">BIS Hall Mark</option>
                        </select>
                      </td>

                      {/* Count */}
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.count}
                          onChange={(e) => handleChange(e, "count", index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                      </td>

                      {/* Gross Weight */}
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.weight}
                          onChange={(e) => handleChange(e, "weight", index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                      </td>

                      {/* Deduction Weight */}
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.deduction_weight}
                          onChange={(e) =>
                            handleChange(e, "deduction_weight", index)
                          }
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                      </td>

                      {/* Net Weight*/}
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={(
                            parseFloat(row.weight || 0) -
                            parseFloat(row.deduction_weight || 0)
                          ).toFixed(2)}
                          readOnly
                        />
                      </td>

                      {/* Remark */}
                      <td>
                        <textarea
                          rows={1}
                          className="form-cntrl w-100"
                          value={row.remark}
                          onChange={(e) => handleChange(e, "remark", index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                      </td>

                      {/* Add More (hidden) */}
                      <td>
                        <div className="d-none">
                          {index === formData.jewel_product.length - 1 && (
                            <ClickButton
                              label={<>Add More</>}
                              onClick={handleAddRow}
                            />
                          )}
                        </div>
                      </td>

                      {/* Delete */}
                      <td>
                        <Delete
                          onClick={() => handleDeleteRow(index)}
                          label={<MdDeleteForever />}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Col>

          {/* New Bank Pledge Details Section */}
          {/* <Col lg="12" className="py-3">
            <h4 className="mb-3">Bank Pledge Details</h4>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "bank_pledge_date")}
              initialDate={formData.bank_pledge_date}
              calenderlabel="Pledge Date"
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Assessor Name"}
              labelname={"Bank Assessor Name"}
              name="bank_assessor_name"
              value={formData.bank_assessor_name}
              onChange={(e) => handleChange(e, "bank_assessor_name")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Name"}
              labelname={"Bank Name"}
              name="bank_name"
              value={formData.bank_name}
              onChange={(e) => handleChange(e, "bank_name")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Loan Value"}
              labelname={"Bank Loan Value"}
              name="bank_pawn_value"
              value={formData.bank_pawn_value}
              onChange={(e) => handleChange(e, "bank_pawn_value")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Interest"}
              labelname={"Bank Interest"}
              name="bank_interest"
              value={formData.bank_interest}
              onChange={(e) => handleChange(e, "bank_interest")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "bank_duration")}
              initialDate={formData.bank_duration}
              calenderlabel="Due Date"
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Additional Charges"}
              labelname={"Additional Charges"}
              name="bank_additional_charges"
              value={formData.bank_additional_charges}
              onChange={(e) => handleChange(e, "bank_additional_charges")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Loan No"}
              labelname={"Bank Loan No"}
              name="location"
              value={formData.location}
              onChange={(e) => handleChange(e, "location")}
            />
          </Col> */}

          <Col lg="12">
            <div className="text-center mb-3">
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <span className="px-2">
                <ClickButton
                  label={
                    type === "edit" ? (
                      <>Update</>
                    ) : loading ? (
                      <>Submitting...</>
                    ) : (
                      <>Submit</>
                    )
                  }
                  onClick={type === "edit" ? handleUpdateSubmit : handleSubmit}
                  disabled={loading}
                />
              </span>
              <span className="px-2">
                <ClickButton
                  label={<>Cancel</>}
                  onClick={() => navigate(-1)}
                  disabled={loading}
                />
              </span>
            </div>
          </Col>
        </Row>
        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}
      </Container>
      {previewFile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "100%",
              maxHeight: "100%",
              overflow: "auto",
            }}
          >
            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: "1px",
                right: "1px",
                background: "black",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ×
            </button>
            {previewFile.type === "image" ? (
              <img
                src={previewFile.data}
                alt={`Preview ${previewFile.name}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
                onError={() =>
                  toast.error(`Failed to load image: ${previewFile.name}`, {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "colored",
                  })
                }
              />
            ) : (
              <iframe
                src={previewFile.data}
                title={`Preview ${previewFile.name}`}
                style={{
                  width: "100%",
                  height: "80vh",
                  border: "none",
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCreation;
