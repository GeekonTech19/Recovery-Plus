import { useNavigate, Link } from "react-router-dom";
import Button from "../components/button";
import AuthLayout from "../layouts/AuthLayout";

function Welcome() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Recovery+"
      description="Your personal recovery companion."
    >
      <Button
        label="Get Started"
        onClick={() => navigate("/register")}
      />

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-900 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Welcome;