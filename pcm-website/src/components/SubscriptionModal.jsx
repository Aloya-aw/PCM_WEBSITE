import React, { useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

Modal.setAppElement("#root"); // Prevents accessibility issues

const modalStyles = {
  content: {
    width: "90%",
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
  },
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const SubscriptionModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [status, setStatus] = useState({
    type: null,
    message: "",
  });
  
  // Your Apps Script URL
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6T7vE7akGqgG_MDTVUhchM-L5Pdyt2FKw-vRFlxIExr3b5pDrG6NC3RcJQlKV8_JKDQ/exec";

  // Method 1: Submit via standard HTML form submission (reliable workaround for CORS)
  const createFormSubmitElement = (formData) => {
    // Set loading state
    setStatus({ type: "loading", message: "Submitting..." });
    
    // Create a hidden form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = SCRIPT_URL;
    form.target = "hidden-iframe";
    
    // Add form data
    for (const key in formData) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = formData[key];
      form.appendChild(input);
    }
    
    // Create hidden iframe to prevent page reload
    let iframe = document.querySelector("#hidden-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = "hidden-iframe";
      iframe.id = "hidden-iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      
      // Handle iframe load event
      iframe.addEventListener("load", () => {
        setTimeout(() => {
          setStatus({ 
            type: "success", 
            message: "Subscription successful! Thank you for subscribing."
          });
          
          // Reset form
          reset();
          
          // Close modal after delay
          setTimeout(() => {
            onClose();
          }, 2000);
        }, 1000);
      });
    }
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(form);
    }, 500);
  };

  const onSubmit = (data) => {
    // Use the HTML form submission approach
    createFormSubmitElement(data);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold">Subscribe to our Newsletter</h2>
        <p className="text-sm text-gray-500 mb-4">Stay updated with our latest news</p>

        {status.type === "success" && (
          <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">
            {status.message}
          </div>
        )}

        {status.type === "error" && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            {...register("name")}
            className="w-full p-2 border rounded"
            disabled={status.type === "loading" || status.type === "success"}
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>

          <input
            type="email"
            placeholder="Your Email"
            {...register("email")}
            className="w-full p-2 border rounded"
            disabled={status.type === "loading" || status.type === "success"}
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>

          <button
            type="submit"
            className={`w-full p-2 ${
              status.type === "loading" ? "bg-blue-300" : "bg-blue-500"
            } text-white rounded`}
            disabled={status.type === "loading" || status.type === "success"}
          >
            {status.type === "loading" ? "Submitting..." : "Subscribe"}
          </button>
        </form>

        <button 
          onClick={onClose} 
          className="mt-3 text-gray-600"
          disabled={status.type === "loading"}
        >
          Close
        </button>
      </motion.div>
    </Modal>
  );
};

export default SubscriptionModal;