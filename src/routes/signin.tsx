import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/signin")({
    component: SigninPage,
});

const SigninSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SigninPage() {
    const router = useRouter();
    const { signin } = useAuthStore();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onChange: SigninSchema,
        },
        onSubmit: async ({ value }) => {
            const user = signin(value.email, value.password);

            if (!user) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Signin successfully");
                router.navigate({ to: "/" });
            }
        },
    });

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <Logo className="flex justify-center gap-2 md:justify-start" />
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <form
                            className="flex flex-col gap-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                        >
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to signin to your account
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <FormInput form={form} type="email" name="email" label="Email" placeholder="admin@gmail.com" />
                                <FormInput form={form} type="password" name="password" label="Password" />
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit]}
                                    children={([canSubmit]) => (
                                        <Button type="submit" className="w-full" disabled={!canSubmit}>
                                            Signin
                                        </Button>
                                    )}
                                />
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account? <span className="underline underline-offset-4">Sign up</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
