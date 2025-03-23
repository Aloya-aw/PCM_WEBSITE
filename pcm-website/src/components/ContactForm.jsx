import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters")
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const [status, setStatus] = useState({
    type: null,
    message: ""
  });

  // Your Apps Script URL - replace with your actual deployed script URL
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwT20N2qQqvU0d5CspRSKIdW41oX8TMu0oSIDApcw4G9KsoyVa76eAJxxeyqqqcpz_/exec";

  // Method using hidden iframe to avoid CORS issues
  const submitForm = (formData) => {
    // Set loading state
    setStatus({ type: "loading", message: "Sending your message..." });
    
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
            message: "Thank you! Your message has been sent successfully."
          });
          
          // Reset form
          reset();
          
          // Clear success message after some time
          setTimeout(() => {
            setStatus({ type: null, message: "" });
          }, 5000);
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
    submitForm(data);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
      
      {status.type === "success" && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {status.message}
        </div>
      )}
      
      {status.type === "error" && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            {...register("name")}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={status.type === "loading"}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email address"
            {...register("email")}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={status.type === "loading"}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Type your message here"
            rows="4"
            {...register("message")}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            disabled={status.type === "loading"}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className={`w-full p-3 text-white rounded transition-colors ${
            status.type === "loading" 
              ? "bg-blue-300 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;