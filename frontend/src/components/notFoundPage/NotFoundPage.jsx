import React from "react";
import notfound from "../../assets/404.webp";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";


export default function NotFoundPage() {
  return (
    <div>
      <div className="flex items-center justify-center left-72 top-72 right-72">
        <img src={notfound} alt="not found" className="w-80 h-80" />
      </div>

      <div className="flex items-center justify-center">
        <h1 className="text-5xl font-bold">Oops! Page is Not Found !!</h1>
      </div>

      <div className="static flex items-center justify-center top-8 right-8">
        <Link to="/">
          <Button variant="contained" size="medium" className="absolute top-6">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}