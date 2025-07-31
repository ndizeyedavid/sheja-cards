"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    Github,
    Chrome,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    return (
        <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-background dark:to-muted/20 p-4">
            <Card className="w-full max-w-lg border-2 shadow-2xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-black/80 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">
                            Create Your Account
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Join us today and start your journey
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Registration Form */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number (Optional)</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="pl-10 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="pl-10 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={() => {
                                        setAcceptTerms(!acceptTerms);
                                    }}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor="terms"
                                    className="text-sm leading-relaxed"
                                >
                                    I agree to the{" "}
                                    <Button
                                        variant="link"
                                        className="px-0 h-auto text-sm"
                                    >
                                        Terms of Service
                                    </Button>{" "}
                                    and{" "}
                                    <Button
                                        variant="link"
                                        className="px-0 h-auto text-sm"
                                    >
                                        Privacy Policy
                                    </Button>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="newsletter" />
                                <Label htmlFor="newsletter" className="text-sm">
                                    Send me product updates and marketing emails
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full gap-2"
                            disabled={!acceptTerms}
                        >
                            Create Account
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="login">
                            <Button variant="link" className="px-0 font-medium">
                                Sign in here
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
