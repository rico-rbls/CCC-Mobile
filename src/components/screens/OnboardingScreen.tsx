"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  User,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const roleCards = [
  {
    id: "student" as const,
    icon: GraduationCap,
    label: "Student",
    desc: "Currently enrolled",
    emoji: "🎓",
  },
  {
    id: "visitor" as const,
    icon: User,
    label: "Visitor",
    desc: "Guest access",
    emoji: "🧑‍💼",
  },
];

const programs = [
  "Computer Science",
  "Nursing",
  "Business Administration",
  "Education",
  "Engineering",
  "Arts & Sciences",
  "Psychology",
  "Mathematics",
  "Biology",
  "English",
];



// Step icons for progress indicator
const stepIcons = [Sparkles, User, GraduationCap, ShieldCheck];

// Background patterns per step
const stepBgPatterns = [
  "radial-gradient(circle at 20% 80%, rgba(101,45,144,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(155,91,191,0.04) 0%, transparent 50%)",
  "radial-gradient(circle at 80% 80%, rgba(101,45,144,0.04) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(155,91,191,0.04) 0%, transparent 50%)",
  "radial-gradient(circle at 50% 80%, rgba(101,45,144,0.04) 0%, transparent 50%), radial-gradient(circle at 50% 20%, rgba(155,91,191,0.04) 0%, transparent 50%)",
  "radial-gradient(circle at 20% 50%, rgba(101,45,144,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(155,91,191,0.04) 0%, transparent 50%)",
];

export default function OnboardingScreen() {
  const {
    onboardingStep,
    setOnboardingStep,
    onboardingData,
    setOnboardingData,
    setUser,
    setCurrentScreen,
  } = useAppStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;
  const step = onboardingStep;

  const getPasswordRequirements = () => {
    const p = onboardingData.password;
    return {
      hasNumber: /[0-9]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasUpper: /[A-Z]/.test(p),
      hasAt: /@/.test(p),
      hasSymbol: /[^A-Za-z0-9]/.test(p),
    };
  };

  const passwordReqs = getPasswordRequirements();
  const allPasswordReqsMet =
    onboardingData.password.length > 0 &&
    passwordReqs.hasNumber &&
    passwordReqs.hasLower &&
    passwordReqs.hasUpper &&
    passwordReqs.hasAt &&
    passwordReqs.hasSymbol;

  const canContinue = () => {
    switch (step) {
      case 0:
        return onboardingData.role !== "";
      case 1:
        return (
          onboardingData.fullName.trim() !== "" &&
          onboardingData.universityId.trim() !== ""
        );
      case 2:
        return onboardingData.program !== "";
      case 3:
        return (
          onboardingData.email.trim() !== "" &&
          allPasswordReqsMet &&
          confirmPassword === onboardingData.password
        );
      default:
        return false;
    }
  };

  const handleContinue = async () => {
    if (step < totalSteps - 1) {
      setOnboardingStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: onboardingData.fullName,
            email: onboardingData.email,
            password: onboardingData.password,
            universityId: onboardingData.universityId,
            role: onboardingData.role,
            program: onboardingData.program,
            department: onboardingData.department,
            yearLevel: onboardingData.yearLevel,
            notificationDueDate: onboardingData.notificationDueDate,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast({
            title: "Registration Failed",
            description: data.error || "Please try again",
            variant: "destructive",
          });
          return;
        }
        setUser({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          universityId: data.universityId,
          role: data.role,
          program: data.program || "",
          department: data.department || "",
          yearLevel: data.yearLevel || "",
          avatarInitials: data.avatarInitials,
          streakCount: data.streakCount || 0,
          isOnboarded: true,
          notificationDueDate: data.notificationDueDate,
          notificationAnnouncements: data.notificationAnnouncements,
        });
        setCurrentScreen("home");
      } catch {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setOnboardingStep(step - 1);
  };



  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0d0618] relative">

      {/* Progress bar with gradient background and step icons */}
      <div
        className="bg-lib-purple-50/50 dark:bg-lib-purple-900/20 px-6 pt-5 pb-4 relative overflow-hidden"
        style={{ backgroundImage: stepBgPatterns[step] }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < step
                  ? "bg-lib-purple"
                  : i === step
                    ? "bg-gradient-to-r from-lib-purple to-lib-purple-light dark:shadow-sm dark:shadow-lib-purple/30"
                    : "bg-lib-purple-200 dark:bg-lib-purple-800"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-lib-purple-100 dark:hover:bg-lib-purple-900/40 active:bg-lib-purple-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-lib-purple dark:text-lib-purple-300" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          {/* Step dots with icons */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const StepIcon = stepIcons[i];
              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: i === step ? 1.2 : 1,
                    backgroundColor: i <= step ? "#652D90" : "#E8D5F3",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    i === step ? "dark:shadow-sm dark:shadow-lib-purple/30" : ""
                  }`}
                >
                  {i < step ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <StepIcon
                      className={`w-3.5 h-3.5 ${i === step ? "text-white" : "text-lib-purple-400 dark:text-lib-purple-600"}`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 px-6 py-4 overflow-y-auto"
          >
            {step === 0 && (
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-3xl bg-purple-gradient flex items-center justify-center mb-5 dark:shadow-lg dark:shadow-lib-purple/25 gradient-border"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Welcome to LibLog
                </h2>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-[260px]">
                  Choose your role to get started with the digital library
                </p>
                <div className="w-full space-y-3">
                  {roleCards.map((r, idx) => {
                    const selected = onboardingData.role === r.id;
                    const Icon = r.icon;
                    return (
                      <motion.button
                        key={r.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setOnboardingData({ role: r.id })}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                          selected
                            ? "border-lib-purple bg-lib-purple-50 dark:bg-lib-purple-900/30 dark:shadow-md dark:shadow-lib-purple/10 gradient-border"
                            : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a0e2e] hover:border-lib-purple-200 dark:hover:border-lib-purple-700 dark:hover:shadow-sm"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            selected
                              ? "bg-lib-purple scale-110"
                              : "bg-lib-purple-50 dark:bg-white/10"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 transition-colors duration-200 ${selected ? "text-white" : "text-lib-purple dark:text-lib-purple-300"}`}
                          />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-foreground">
                            {r.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {r.desc}
                          </div>
                        </div>
                        <motion.div
                          animate={{
                            scale: selected ? 1 : 0,
                            opacity: selected ? 1 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div className="w-6 h-6 rounded-full bg-lib-purple flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-purple-gradient flex items-center justify-center mb-4 self-center dark:shadow-md dark:shadow-lib-purple/20"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">
                  Personal Information
                </h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Tell us about yourself
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Dela Cruz"
                      value={onboardingData.fullName}
                      onChange={(e) =>
                        setOnboardingData({ fullName: e.target.value })
                      }
                      className="h-12 rounded-xl border-gray-200 dark:border-white/10 dark:bg-[#1a0e2e] dark:text-gray-100 dark:placeholder:text-gray-500 focus:border-lib-purple focus:ring-lib-purple/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="univId" className="text-sm font-medium">
                      Student/Library
                    </Label>
                    <Input
                      id="univId"
                      placeholder="e.g. 2024-00001"
                      value={onboardingData.universityId}
                      onChange={(e) =>
                        setOnboardingData({ universityId: e.target.value })
                      }
                      className="h-12 rounded-xl border-gray-200 dark:border-white/10 dark:bg-[#1a0e2e] dark:text-gray-100 dark:placeholder:text-gray-500 focus:border-lib-purple focus:ring-lib-purple/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-purple-gradient flex items-center justify-center mb-4 self-center dark:shadow-md dark:shadow-lib-purple/20"
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">
                  Academic Information
                </h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Select your program
                </p>
                <div className="space-y-4">
                  {onboardingData.role !== "visitor" && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Program
                      </Label>
                      <select
                        value={onboardingData.program}
                        onChange={(e) =>
                          setOnboardingData({ program: e.target.value })
                        }
                        className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 px-3 text-sm bg-white dark:bg-[#1a0e2e] dark:text-gray-100 focus:border-lib-purple focus:ring-lib-purple/20 focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select program</option>
                        {programs.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {onboardingData.role === "visitor" && (
                    <div className="bg-lib-purple-50 dark:bg-lib-purple-900/30 rounded-xl p-4 text-center border border-lib-purple-100 dark:border-lib-purple-800">
                      <Info className="w-5 h-5 text-lib-purple dark:text-lib-purple-300 mx-auto mb-2" />
                      <p className="text-sm text-lib-purple dark:text-lib-purple-300">
                        As a visitor, you can browse the catalog and use the QR
                        check-in feature.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-purple-gradient flex items-center justify-center mb-4 self-center dark:shadow-md dark:shadow-lib-purple/20"
                >
                  <ShieldCheck className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground mb-1 text-center">
                  Account Setup
                </h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Create your login credentials
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={onboardingData.email}
                      onChange={(e) =>
                        setOnboardingData({ email: e.target.value })
                      }
                      className="h-12 rounded-xl border-gray-200 dark:border-white/10 dark:bg-[#1a0e2e] dark:text-gray-100 dark:placeholder:text-gray-500 focus:border-lib-purple focus:ring-lib-purple/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={onboardingData.password}
                        onChange={(e) =>
                          setOnboardingData({ password: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-200 dark:border-white/10 dark:bg-[#1a0e2e] dark:text-gray-100 dark:placeholder:text-gray-500 focus:border-lib-purple focus:ring-lib-purple/20 pr-10 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lib-purple dark:hover:text-lib-purple-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {onboardingData.password.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        {[
                          { key: "hasAt", label: "@" },
                          { key: "hasNumber", label: "Number" },
                          { key: "hasLower", label: "Small letter" },
                          { key: "hasUpper", label: "Capital letter" },
                          { key: "hasSymbol", label: "Symbol" },
                        ].map((req) => {
                          const met = passwordReqs[req.key as keyof typeof passwordReqs];
                          return (
                            <div key={req.key} className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                                met ? "bg-green-500" : "bg-gray-200 dark:bg-white/10"
                              }`}>
                                {met && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className={`text-xs transition-colors duration-200 ${
                                met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              }`}>
                                {req.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 dark:border-white/10 dark:bg-[#1a0e2e] dark:text-gray-100 dark:placeholder:text-gray-500 focus:border-lib-purple focus:ring-lib-purple/20 pr-10 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lib-purple dark:hover:text-lib-purple-300 transition-colors"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {confirmPassword.length > 0 &&
                      confirmPassword !== onboardingData.password && (
                        <p className="text-xs text-red-500">
                          Passwords do not match
                        </p>
                      )}
                    {confirmPassword.length > 0 &&
                      confirmPassword === onboardingData.password && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}


          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="px-6 pb-6 pt-4">
        <Button
          onClick={handleContinue}
          disabled={!canContinue() || isSubmitting}
          className={`w-full h-12 rounded-xl text-white font-semibold text-base disabled:opacity-50 transition-all active:scale-[0.98] ${
            step === totalSteps - 1
              ? "bg-gradient-to-r from-lib-purple via-lib-purple-light to-lib-purple dark:shadow-lg dark:shadow-lib-purple/30"
              : "bg-lib-purple hover:bg-lib-purple-dark"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : step === totalSteps - 1 ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Get Started
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
