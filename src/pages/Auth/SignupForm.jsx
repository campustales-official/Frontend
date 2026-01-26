import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../api/auth.api";
import { useCollegeSearch } from "../../hooks/useCollegeSearch";
import { Eye, EyeOff, Search, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { queryClient } from "../../lib/queryClient.js";

export default function SignupForm() {
  const [query, setQuery] = useState("");
  const [college, setCollege] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const checkStrength = (pass) => {
    setPasswordCriteria({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass)
    });
  };
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { data: colleges } = useCollegeSearch(query);
  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Account created successfully! Please check your email to verify.");
      queryClient.invalidateQueries(["me"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create account. Please try again.");
    },
  });

  // Get the identifier type based on role and college config
  const getIdentifierType = () => {
    if (!college?.identifierConfig) return "enrollment_no";

    let config = college.identifierConfig[role];
    if (!config) config = college.identifierConfig["student"];

    return config?.primaryType || config?.allowedTypes?.[0] || "enrollment_no";
  };

  const submit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (!college) {
      toast.error("Please select your college/university.");
      return;
    }

    const formData = Object.fromEntries(new FormData(e.target));
    const identifierValue = formData.identifier;
    delete formData.identifier;

    mutate({
      ...formData,
      collegeId: college?.id,
      roleInCollege: role,
      year: formData.year ? parseInt(formData.year) : undefined,
      yearOfAdmission: formData.yearOfAdmission ? parseInt(formData.yearOfAdmission) : undefined,
      passingYear: formData.passingYear ? parseInt(formData.passingYear) : undefined,
      identifier: {
        type: getIdentifierType(),
        value: identifierValue,
      },
    });
  };

  // Helper to format identifier type to readable label
  const formatIdentifierType = (type) => {
    const labels = {
      roll_no: "Roll No.",
      scholar_no: "Scholar No.",
      enrollment_no: "Enrollment No.",
      employee_id: "Employee ID",
      faculty_code: "Faculty Code",
      custom: college?.identifierConfig?.[role]?.customLabel || "ID",
    };
    return labels[type] || "ID";
  };

  // Get identifier label based on college config and role
  const getIdentifierLabel = () => {
    if (!college?.identifierConfig) return "Enrollment No.";

    let config = college.identifierConfig[role];
    if (!config) config = college.identifierConfig["student"];

    if (config?.primaryType) {
      return formatIdentifierType(config.primaryType);
    }

    if (config?.allowedTypes?.length > 0) {
      return formatIdentifierType(config.allowedTypes[0]);
    }

    return "ID";
  };

  // Get placeholder based on identifier type
  const getIdentifierPlaceholder = () => {
    if (!college?.identifierConfig) return "e.g. 2023CS001";

    let config = college.identifierConfig[role];
    if (!config) config = college.identifierConfig["student"];

    const type = config.primaryType || config.allowedTypes?.[0];
    const placeholders = {
      roll_no: "e.g. 21",
      scholar_no: "e.g. SC2023001",
      enrollment_no: "e.g. 2023CS001",
      employee_id: "e.g. EMP001",
      faculty_code: "e.g. FC001",
      custom: "Enter your ID",
    };
    return placeholders[type] || "Enter your ID";
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400";

  return (
    <form onSubmit={submit} className="space-y-5" autoComplete="off">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
        <p className="mt-2 text-sm text-gray-500">Join the community and start connecting with peers.</p>
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input name="name" required placeholder="John Doe" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Email</label>
          <input name="email" type="email" required placeholder="alex@university.edu" className={inputClass} />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Create a strong password"
            className={inputClass + " pr-12"}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              checkStrength(val);
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {/* Password Strength Indicators */}
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500 font-medium mb-1">Password must contain:</p>
          <div className={`text-xs flex items-center gap-1 ${passwordCriteria.length ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.length ? "bg-green-600" : "bg-gray-300"}`}></div>
            At least 8 characters
          </div>
          <div className={`text-xs flex items-center gap-1 ${passwordCriteria.uppercase ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.uppercase ? "bg-green-600" : "bg-gray-300"}`}></div>
            One uppercase letter
          </div>
          <div className={`text-xs flex items-center gap-1 ${passwordCriteria.lowercase ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.lowercase ? "bg-green-600" : "bg-gray-300"}`}></div>
            One lowercase letter
          </div>
          <div className={`text-xs flex items-center gap-1 ${passwordCriteria.number ? "text-green-600" : "text-gray-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.number ? "bg-green-600" : "bg-gray-300"}`}></div>
            One number
          </div>
        </div>
      </div>

      {/* College Search */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">College / University</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
              setCollege(null);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for your college..."
            className={inputClass + " pl-10"}
          />
        </div>
        {showDropdown && colleges && colleges.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
            {colleges.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setCollege(c);
                  setQuery(c.name);
                  setShowDropdown(false);
                }}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-gray-400 ml-2">— {c.city}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 2: Identifier + Role */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {getIdentifierLabel()}
          </label>
          <input
            name="identifier"
            placeholder={getIdentifierPlaceholder()}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass + " appearance-none pr-10"}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="alumni">Alumni</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Conditional Fields */}
      {role === "student" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree</label>
              <input name="degree" placeholder="e.g. B.Tech, B.Sc" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch/Major</label>
              <input name="branch" placeholder="e.g. Computer Science" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission Year</label>
              <input name="yearOfAdmission" type="number" placeholder="2023" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
              <div className="relative">
                <select name="year" className={inputClass + " appearance-none pr-10"}>
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      {s}
                      {s === 1 ? "st" : s === 2 ? "nd" : s === 3 ? "rd" : "th"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </>
      )}

      {role === "alumni" || role === "student" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing Year</label>
          <input name="passingYear" type="number" placeholder="2027" className={inputClass} />
        </div>
      )}

      {/* Terms Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !agreeTerms || !Object.values(passwordCriteria).every(Boolean)}
        className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
