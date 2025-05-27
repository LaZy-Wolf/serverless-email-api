"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Send } from "lucide-react";

interface EmailFormData {
  receiver_email: string;
  subject: string;
  body_text: string;
}

interface FormErrors {
  receiver_email?: string;
  subject?: string;
  body_text?: string;
}

export default function EmailSenderPage() {
  const [formData, setFormData] = useState<EmailFormData>({
    receiver_email: "",
    subject: "",
    body_text: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.receiver_email.trim()) {
      newErrors.receiver_email = "Email address is required";
    } else if (!validateEmail(formData.receiver_email)) {
      newErrors.receiver_email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.body_text.trim()) {
      newErrors.body_text = "Message body is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://us-central1-lone-461009.cloudfunctions.net/email-api-dev-sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email Sent Successfully!", {
          description: "Your email has been sent.",
        });
        setFormData({
          receiver_email: "",
          subject: "",
          body_text: "",
        });
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to send email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Send Email</CardTitle>
          <CardDescription className="text-gray-600">Fill out the form below to send an email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiver_email" className="text-sm font-medium text-gray-700">
                Recipient Email
              </Label>
              <Input
                id="receiver_email"
                type="email"
                placeholder="recipient@example.com"
                value={formData.receiver_email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("receiver_email", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.receiver_email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                disabled={isLoading}
              />
              {errors.receiver_email && (
                <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
                  {errors.receiver_email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("subject", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.subject
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                disabled={isLoading}
              />
              {errors.subject && (
                <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{errors.subject}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body_text" className="text-sm font-medium text-gray-700">
                Message
              </Label>
              <Textarea
                id="body_text"
                placeholder="Enter your message here..."
                rows={4}
                value={formData.body_text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("body_text", e.target.value)}
                className={`transition-all duration-200 resize-none ${
                  errors.body_text
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                disabled={isLoading}
              />
              {errors.body_text && (
                <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{errors.body_text}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}