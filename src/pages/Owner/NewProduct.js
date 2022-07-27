import React from "react";
import { render } from "react-dom";
import { Formik } from "formik";

const Addnew = () => (
    <Formik
      initialValues={{ name: "", price: 0 }}
      onSubmit={async (products) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(JSON.stringify(products));
      }}
    >
      {(props) => {
        const {
          values,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" style={{ display: "block" }}>
              Name
            </label>
            <input
              id="name"
              placeholder="Enter product name"
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-input"
            />
            <label htmlFor="price" style={{ display: "block" }}>
              Price
            </label>
            <input
              id="price"
              type="number"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-input"
            />

            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

            <DisplayFormikState {...props} />
          </form>
        );
      }}
    </Formik>