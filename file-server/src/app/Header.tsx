import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header(){
    return (
    <div className="border-b py-4 bg-gray-200">
        <div className="items-center container mx-auto justify-between flex ">
            <div>FileDrive</div>

            <div className="flex gap-2">
                
                <OrganizationSwitcher></OrganizationSwitcher>
                
                <UserButton></UserButton>
                <SignedOut>
                    <SignInButton>
                        <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>

        </div>
    </div>
    );
}