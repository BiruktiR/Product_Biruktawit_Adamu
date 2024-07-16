"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import CrudTableComponent from "./common-material-table";
import { usePopover } from "./use-popover";
import Notify from "./SnackBar";

import { useForm } from "react-hook-form";

// const axios = require("axios");

const ProductList = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const accountPopover = usePopover();
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /****************** Fetch the admin info in the company***************************/
  async function getProduct() {
    setIsLoading(true);
    setError(null);
    fetch("https://dummyjson.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Products array not found in data:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getProduct();
  }, []);

  /********************* Post the new record to the server  **********************/

  const handleCreateNewRow = async (values) => {
    try {
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          rating: values.rating,
          price: values.price,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to post product");
      }

      const data = await response.json();
      getProduct();
      setMessage("Product is added successfully.");
      setSeverity("success");
      setOpen(true);
    } catch (error) {
      console.error("Error posting product:", error);
    }
  };

  /********************* Update a record to the server  **********************/

  const handleSaveRowEdits = async ({ exitEditingMode, row,  values }) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/${values.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            rating: values.rating,
            price: values.price,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      getProduct();
      exitEditingMode();
      setMessage("Product is updated successfully.");
      setSeverity("success");
      setOpen(true);
    } catch (error) {
      console.error("Error updating product:", error);
    }

  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  /********************* Delete a record to the server  **********************/

  const handleDeleteRow = async ({ values}) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/${values.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }

      const data = await response.json();
      getProduct();
      setMessage("Product is deleted successfully.");
      setSeverity("success");
      setOpen(true);
    } catch (error) {
      console.error("Error deleting product:", error);
    }

  };
  
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      handleDeleteRow(row.original.id);
    }
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Product ID",
        type: "text",
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "text",
        }),
      },
      {
        accessorKey: "title",
        header: "Title",
        type: "text",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "text",
        }),
      },
      {
        accessorKey: "description",
        header: "Description",
        type: "text",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "text",
        }),
      },
      {
        accessorKey: "price",
        header: "Price ",
        type: "number",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        type: "number",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <CrudTableComponent
        columns={columns}
        data={products}
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        handleDeleteRow={handleDeleteRow}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onButtonClick={() => setCreateModalOpen(true)}
        initialState={{ columnVisibility: { password: false, id: false } }}
        title="Product List"
      />
      <Notify
        open={open}
        message={message}
        severity={severity}
        handleClose={handleClose}
      />
    </>
  );
};

const validateRequired = (value) => {
  return !!value?.length;
};
const validateEmail = (email) =>
  (!!email)?.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default ProductList;
