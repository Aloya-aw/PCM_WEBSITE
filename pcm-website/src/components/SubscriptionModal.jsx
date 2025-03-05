import React, { useEffect, useState } from "react";
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
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbx_Oqun8tN4_Lb8L77q7gD68R7Uecg1qqwcyEscIyITnnQqiv6oi2VpyEBhpqRWyLm_uw/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert("Subscription successful!");
        reset(); //Reset form fields
        onClose(); // Close modal after submission
    } else {
        alert("Subscription failed. Please try again.");
    }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occured. Please try again.");
    }
    
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            {...register("name")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>

          <input
            type="email"
            placeholder="Your Email"
            {...register("email")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Subscribe
          </button>
        </form>

        <button onClick={onClose} className="mt-3 text-gray-600">Close</button>
      </motion.div>
    </Modal>
  );
};

export default SubscriptionModal;
