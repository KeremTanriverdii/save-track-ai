import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserSettings } from "@/lib/types/type";
import { Delete } from "lucide-react";


export default function UserChangePPClient({ settings }: { settings: UserSettings }) {

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Public Profile
                    </CardTitle>
                    <CardDescription>
                        This information will be displayed publicly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                    >
                        <hr />
                        <div
                            className="flex gap-5 mt-5"
                        >
                            <Avatar>
                                <AvatarImage
                                    src={settings.photoURL}
                                    height={60}
                                    width={60}
                                />
                                <AvatarFallback>
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div
                            >
                                <h2
                                    className="me-auto"
                                >
                                    Profile Photo
                                </h2>
                                <CardAction
                                    className="flex gap-5"
                                >
                                    <div>
                                        <Button
                                            className="rounded-sm cursor-pointer"
                                        >
                                            Change Photo
                                        </Button>
                                        <br />
                                        <span
                                            className="text-muted mt-2"
                                        >
                                            JPG, PNG. 1MB max.
                                        </span>
                                    </div>
                                    <Button className="text-red-600 bg-transparent hover:bg-transparent cursor-pointer">Remove Photo <Delete /> </Button>
                                </CardAction>
                            </div>
                            <br />
                        </div>
                        <CardAction className="me-auto w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                                <div>
                                    <label
                                        htmlFor="fullName"
                                    >
                                        <span>
                                            Full Name
                                        </span>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={settings.displayName}

                                        />
                                    </label>
                                </div>
                                <div>

                                    <label
                                        htmlFor="email"
                                    >
                                        <span>
                                            Email
                                        </span>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={settings.email}
                                            disabled
                                        />
                                    </label>
                                    <br />
                                    <span
                                        className="text-muted mt-2"
                                    >
                                        Contact support to change your email.
                                    </span>
                                </div>
                            </div>
                        </CardAction>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Financal Preferences
                    </CardTitle>
                    <CardDescription>
                        Set your default currency and monthly spending limits.
                    </CardDescription>
                </CardHeader>


                <CardContent>
                    <hr />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
                        <div>
                            <label
                                htmlFor="currency"
                            >
                                <span>
                                    Preferred Currency
                                </span>
                                <Select >
                                    <SelectTrigger className="w-full" >
                                        <SelectValue
                                            placeholder={settings.currency}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>

                                        <SelectItem
                                            value="USD"
                                        >
                                            USD
                                        </SelectItem>

                                        <SelectItem
                                            value="EUR"
                                        >
                                            EUR
                                        </SelectItem>

                                    </SelectContent>


                                </Select>
                            </label>
                        </div>

                        <div>
                            <label htmlFor="budget">
                                <span>
                                    Monthly Budget Goal
                                </span>
                                <Input
                                    id="budget"
                                    type="number"
                                // value={settings.budget}
                                />
                            </label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                    <Button
                    // onReset={reset}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-violet-600 text-white hover:bg-violet-600 hover:scale-110"
                    // onClick={saveChange}
                    >
                        Save Changes
                    </Button>


                </CardFooter>
            </Card>

            <Card
                className="border-red-500">
                <CardHeader>
                    <CardTitle
                        className="text-red-500">
                        Delete Account
                    </CardTitle>
                    <CardDescription>
                        Once you delete your account, you will lose all of your data. This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <CardAction
                        className="me-auto"
                    >
                        <Button
                            className="bg-red-600 text-white hover:bg-red-600 hover:scale-110"
                        // onClick={deleteAccount}
                        >
                            Delete Account
                        </Button>
                    </CardAction>

                </CardContent>

            </Card>
        </div>
    )
}
