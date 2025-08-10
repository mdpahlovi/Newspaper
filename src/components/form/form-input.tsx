import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

type FormInputProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    type?: string;
    name: string;
    label: string;
    placeholder?: string;
    textarea?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldError({ field }: { field: any }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em className="text-red-500 text-xs">{field.state.meta.errors[0].message}</em>
            ) : null}
        </>
    );
}

export function FormInput({ form, name, label, type = "text", placeholder, textarea = false }: FormInputProps) {
    return (
        <form.Field
            name={name}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            children={(field: any) => (
                <div className="grid">
                    <div className="mb-2 flex items-center">
                        <Label htmlFor={field.name}>{label}</Label>
                    </div>
                    {textarea ? (
                        <Textarea
                            id={field.name}
                            rows={6}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={placeholder}
                        />
                    ) : (
                        <Input
                            id={field.name}
                            type={type}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={placeholder}
                        />
                    )}
                    <FieldError field={field} />
                </div>
            )}
        />
    );
}
