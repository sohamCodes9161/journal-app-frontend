import React, { useState, useEffect, useRef } from "react";
import { AuthContext } from "@/features/auth/providers/AuthProvider";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui";
import API from "@/services/api";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { user, setUser } = React.useContext(AuthContext);
  const [isSaving, setIsSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    profilePicture: "",
    bio: "",
    themePreference: "dark",
    timezone: "UTC",
    journalingGoal: "",
    productivityGoal: "",
    reminderSettings: {
      journalingReminder: false,
      todoReminder: false,
      reminderTime: "20:00",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
        themePreference: user.themePreference || "dark",
        timezone: user.timezone || "UTC",
        journalingGoal: user.journalingGoal || "",
        productivityGoal: user.productivityGoal || "",
        reminderSettings: {
          journalingReminder:
            user.reminderSettings?.journalingReminder || false,
          todoReminder: user.reminderSettings?.todoReminder || false,
          reminderTime: user.reminderSettings?.reminderTime || "20:00",
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedReminderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Compute dirty/changed fields only
    const updatedFields = {};
    const keysToCompare = [
      "username",
      "bio",
      "themePreference",
      "timezone",
      "journalingGoal",
      "productivityGoal",
    ];

    keysToCompare.forEach((key) => {
      if (formData[key] !== (user[key] || "")) {
        updatedFields[key] = formData[key];
      }
    });

    const nestedChanged = {};
    const reminders = ["journalingReminder", "todoReminder", "reminderTime"];

    reminders.forEach((subKey) => {
      const currentVal = formData.reminderSettings[subKey];
      const initialVal =
        user.reminderSettings?.[subKey] ??
        (subKey === "reminderTime" ? "20:00" : false);
      if (currentVal !== initialVal) {
        nestedChanged[subKey] = currentVal;
      }
    });

    if (Object.keys(nestedChanged).length > 0) {
      updatedFields.reminderSettings = {
        ...user.reminderSettings,
        ...nestedChanged,
      };
    }

    // ─── FIX 1: INCLUDE AVATAR FILE IN CHANGE DETECTION ───────────────────
    if (Object.keys(updatedFields).length === 0 && !avatarFile) {
      toast.error("No adjustments detected. Profile data remains accurate.");
      setIsSaving(false);
      return;
    }

    try {
      const multipartPayload = new FormData();

      // ─── FIX 2: CORRECTED TYPO ("avater" -> "avatar") ─────────────────────
      if (avatarFile) {
        multipartPayload.append("avatar", avatarFile);
      }

      // Append your other updated fields by serializing objects/primitives cleanly
      Object.keys(updatedFields).forEach((key) => {
        if (typeof updatedFields[key] === "object") {
          multipartPayload.append(key, JSON.stringify(updatedFields[key]));
        } else {
          multipartPayload.append(key, updatedFields[key]);
        }
      });

      // ─── FIX 3: SEND THE MULTIPART PAYLOAD OBJECT WITH MULTIPART HEADERS ───
      const { data } = await API.patch("/auth/settings", multipartPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setUser(data.data);
        setAvatarFile(null); // Reset pending selection file
        toast.success("Preferences preserved smoothly.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update settings.";
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <PageHeader
        title="Account Preferences"
        description="Tune your environmental adjustments, notification sync triggers, and personalized telemetry settings."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Identity Profile Card Parameters */}
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl space-y-4">
          <h2 className="text-sm font-semibold text-violet-400 tracking-wider uppercase">
            Identity Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Username (Read Only Email Address Protected)
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Profile Picture Avatar
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : formData.profilePicture ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.username}`
                  }
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-white/10"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-white/5 border border-white/5 text-xs text-slate-300 hover:bg-white/10"
                >
                  Choose Image
                </Button>
                {avatarFile && (
                  <span className="text-xs text-violet-400 font-medium animate-pulse">
                    Ready to commit change
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              User Biography Overview
            </label>
            <textarea
              name="bio"
              rows="3"
              maxLength="300"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us a bit about your journey..."
              className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition resize-none"
            />
          </div>
        </div>

        {/* SECTION 2: Environmental Layout Properties */}
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl space-y-4">
          <h2 className="text-sm font-semibold text-violet-400 tracking-wider uppercase">
            Workspace Configurations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Visual Layout Theme
              </label>
              <select
                name="themePreference"
                value={formData.themePreference}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none cursor-pointer transition"
              >
                <option value="dark">Dark Theme Sanctuary (Default)</option>
                <option value="light">Light Theme Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Target Dynamic Timezone Alignment
              </label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Performance Goals Mapping */}
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl space-y-4">
          <h2 className="text-sm font-semibold text-violet-400 tracking-wider uppercase">
            Telemetry Framework Goals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Core Journaling Core Target Statement
              </label>
              <input
                type="text"
                name="journalingGoal"
                placeholder="e.g., Write down 3 wins every evening"
                value={formData.journalingGoal}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Productivity Metric Milestone
              </label>
              <input
                type="text"
                name="productivityGoal"
                placeholder="e.g., Clear daily task list layout boundaries"
                value={formData.productivityGoal}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Notifications Engine Toggles */}
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl space-y-4">
          <h2 className="text-sm font-semibold text-violet-400 tracking-wider uppercase">
            Automated Reminder Configurations
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={formData.reminderSettings.journalingReminder}
                onChange={(e) =>
                  handleNestedReminderChange(
                    "journalingReminder",
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-600 focus:ring-0 outline-none cursor-pointer"
              />
              <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">
                Enable System Reflection Journal Reminders
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={formData.reminderSettings.todoReminder}
                onChange={(e) =>
                  handleNestedReminderChange("todoReminder", e.target.checked)
                }
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-600 focus:ring-0 outline-none cursor-pointer"
              />
              <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">
                Enable System Productivity Todo Reminders
              </span>
            </label>

            <div className="pt-2 max-w-[200px]">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Target Notification Broadcast Time
              </label>
              <input
                type="time"
                value={formData.reminderSettings.reminderTime}
                onChange={(e) =>
                  handleNestedReminderChange("reminderTime", e.target.value)
                }
                className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none transition [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            className="shadow-lg shadow-violet-500/20 px-8"
          >
            Commit Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
