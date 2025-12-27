"use client"
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserSettings } from "@/lib/types/type";
import { Delete, Loader2, Lock } from "lucide-react";
import { setSettings } from "@/lib/userSettings/actionSettings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { removeProfilePhoto } from "@/lib/userSettings/removePhoto";

export default function UserChangePPClient({ settings }: { settings: UserSettings }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, setIsPending] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(settings.photoURL);
    const [isRemoving, setIsRemoving] = useState(false);
    const isOAuthUser = settings.isOAuthUser; // Get from settings
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePhoto = async () => {
        if (isOAuthUser) {
            toast.error("Cannot remove photo managed by your authentication provider");
            return;
        }

        if (!confirm("Are you sure you want to remove your profile photo?")) {
            return;
        }

        setIsRemoving(true);
        try {
            const result = await removeProfilePhoto();

            if (result.success) {
                toast.success("Profile photo removed successfully!");
                setPreviewUrl(''); // Clear preview

                // Clear file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                router.refresh();
            } else {
                toast.error(result.error || "Failed to remove photo");
            }
        } catch (error) {
            console.error("Remove photo error:", error);
            toast.error("Something went wrong");
        } finally {
            setIsRemoving(false);
        }
    };

    const handleFormAction = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await setSettings(formData);
            if (result.success) {
                toast.success("Settings updated successfully!");
            } else {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };
    return (
        <form action={handleFormAction} className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>
                        {isOAuthUser
                            ? "Profile information is managed by your authentication provider (Google/Apple)."
                            : "This information will be displayed publicly."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <hr />

                    {/* Profile Photo Section - Disabled for OAuth users */}
                    <div className="flex items-center gap-5 mt-5">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={previewUrl} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm font-medium">
                                Profile Photo
                                {isOAuthUser && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (Managed by {settings.provider === 'google.com' ? 'Google' : 'Apple'})
                                    </span>
                                )}
                            </h2>
                            <div className="flex gap-3">
                                <input
                                    type="file"
                                    name="profileImage"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={isOAuthUser}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isOAuthUser}
                                >
                                    {isOAuthUser && <Lock className="mr-2 h-4 w-4" />}
                                    Change Photo
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                    disabled={isOAuthUser || isRemoving || !previewUrl}
                                    onClick={handleRemovePhoto}
                                >
                                    {isRemoving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Removing...
                                        </>
                                    ) : (
                                        <>
                                            Remove Photo
                                            <Delete className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {isOAuthUser
                                    ? "Photo managed by your provider"
                                    : "JPG, PNG. 5MB max."
                                }
                            </span>
                        </div>
                    </div>

                    {/* Name and Email - Name disabled for OAuth */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Full Name
                                {isOAuthUser && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (From provider)
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={settings.displayName}
                                    placeholder="Your Name"
                                    disabled={isOAuthUser}
                                    className={isOAuthUser ? "bg-muted" : ""}
                                />
                                {isOAuthUser && (
                                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                value={settings.email}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Contact support to change email.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Preferences - Always editable */}
            <Card>
                <CardHeader>
                    <CardTitle>Financial Preferences</CardTitle>
                    <CardDescription>Set your default currency and monthly spending limits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <hr />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Preferred Currency</label>
                            <Select name="currency" defaultValue={settings.currency}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select Currency</SelectLabel>
                                        <SelectItem value="₺">TRY ₺</SelectItem>
                                        <SelectItem value="$">USD $</SelectItem>
                                        <SelectItem value="€">EUR €</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="budget" className="text-sm font-medium">Monthly Budget Goal</label>
                            <Input
                                id="budget"
                                name="budget"
                                type="number"
                                defaultValue={settings.budget}
                                placeholder={`00.0 ${settings.currency}`}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}