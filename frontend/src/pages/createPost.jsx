import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompts } from "../utils/index";
import { FormField, Loader } from "../components";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...form}),
        });

        const data= await response.json();
        console.log(data)
        // alert('success')
        navigate("/"); 
      } catch (error) {
        console.log(error);
        alert(error);
      } finally {
        setLoading(false);
      }
    } 
    // else {
    //   alert("Please enter a prompt and generate an image");
    // }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurprise = () => {
    const randomPrompt = getRandomPrompts();
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("http://localhost:8080/api/v1/pixelai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = await response.json();
        console.log(data);

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create Post
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Create imaginative and visually stunning images generated through
          PixelAI and share them with the community
        </p>
      </div>
      <form className="mt-16 max-w-3xl " onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Dexter Morgan"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A boy eating burger"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurprise={handleSurprise}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              ></img>
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-p/12 h-9/12 object-contain opacity-40"
              ></img>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating.." : "Generate Image"}
          </button>
        </div>
        <div className="mt-5">
          <p className="mt-2 text-[#666e75] text-[14px] ">
            {" "}
            Once you have created the image you want, you can share it with
            others in the community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2 text-center"
          >
            {loading ? "Loading..." : "Share Image"}
          </button>
        </div>
      </form>
    </section>
  );
}
