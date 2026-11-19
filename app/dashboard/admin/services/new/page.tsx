"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
    Scissors,
    Tag,
    Clock,
    DollarSign,
    ImagePlus,
    X,
    Loader2,
    CheckCircle2,
    EyeOff,
} from "lucide-react";
import type {
    ServiceFormValues,
    FormErrors,
    FieldProps,
    IconInputProps,
} from "@/typescript";
import { createService } from "@/lib/actions/services";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


const CATEGORIES = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

const MAX_IMAGE_MB = 5;
const MAX_DESC = 300;

const initialForm: ServiceFormValues = {
    serviceName: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    status: "active",
    image: "",
    adminId: "",
};


const inputBase =
    "h-11 w-full rounded-lg border border-[#eaddd8] bg-white pl-10 pr-3 text-base text-[#2b2b2b] placeholder:text-[#8a7f7a] outline-none transition focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/25";

function Field({ label, error, children, right }: FieldProps) {
    return (
        <div className="min-w-0">
            <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="text-base font-medium text-[#2b2b2b]">{label}</label>
                {right}
            </div>
            {children}
            {error && <p className="mt-1.5 text-sm font-medium text-[#b42318]">{error}</p>}
        </div>
    );
}

function IconInput({ icon: Icon, children }: IconInputProps) {
    return (
        <div className="relative">
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7f7a]" />
            {children}
        </div>
    );
}

function readForm(form: HTMLFormElement, imageUrl: string, adminId: string): ServiceFormValues {
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    return {
        serviceName: value("serviceName"),
        category: value("category"),
        description: value("description"),
        price: Number(value("price")),
        duration: Number(value("duration")),
        status: value("status") === "inactive" ? "inactive" : "active",
        image: imageUrl,
        adminId,
    };
}

const AddServicesPage = () => {
    const [form, setForm] = useState<ServiceFormValues>(initialForm);
    const [preview, setPreview] = useState("");
    const [dragging, setDragging] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = React.useState<ServiceFormValues | null>(null)

    const router = useRouter();
    const { data: session } = useSession()

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const processFile = async (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors((p) => ({ ...p, image: "Choose an image file (JPG, PNG or WebP)." }));
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setErrors((p) => ({ ...p, image: `Image must be smaller than ${MAX_IMAGE_MB} MB.` }));
            return;
        }

        setPreview(URL.createObjectURL(file));
        setErrors((p) => ({ ...p, image: "" }));

        try {
            setUploading(true);
            const fd = new FormData();
            fd.append("image", file);

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
                { method: "POST", body: fd }
            );
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error("Image upload failed.");

            setImageUrl(data.data.url);
        } catch (error) {
            console.error(error);
            setPreview("");
            setImageUrl("");
            toast.error("Image upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview("");
        setImageUrl("");
    };

    const validate = () => {
        const next: FormErrors = {};
        if (!form.serviceName.trim()) next.serviceName = "Enter a service name.";
        if (!form.category) next.category = "Select a category.";
        if (!form.description.trim()) next.description = "Add a short description.";
        if (!(Number(form.price) > 0)) next.price = "Price must be greater than 0.";
        if (!(Number(form.duration) > 0)) next.duration = "Duration must be greater than 0.";
        if (!imageUrl) next.image = "Upload a service image.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (uploading) {
            toast.error("Wait for the image upload to finish.");
            return;
        }

        if (!validate()) {
            toast.error("Fix the highlighted fields and try again.");
            return;
        }



        try {
            setLoading(true);
            const service = readForm(e.currentTarget, imageUrl, session?.user?.id ?? "");
            console.log('new service', service)
            setSubmitted(service);
            const result = await createService(service);
            console.log('created service', result)

            if (result.insertedId) {
                toast.success({
                    title: 'service has been created',
                    description: 'the service has been suceesfully created'
                })
                router.push('/dashboard/recruiter/jobs')
            }

            
            setForm(initialForm);
            removeImage();
            setErrors({});
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Something went wrong. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf9f6] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 sm:mb-8">
                    <h1 className="text-2xl font-semibold text-[#2b2b2b] sm:text-3xl">
                        Add a new service
                    </h1>
                    <p className="mt-1 max-w-xl text-base text-[#8a7f7a] sm:text-lg">
                        Active services appear on the Browse Services page and can be booked
                        right away.
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="grid gap-5 sm:gap-6 lg:grid-cols-3"
                >
                    {/* Details */}
                    <div className="min-w-0 space-y-5 rounded-2xl border border-[#eaddd8] bg-white p-4 sm:p-6 lg:col-span-2 lg:p-8">
                        <h2 className="text-lg font-semibold text-[#2b2b2b]">Service details</h2>

                        <Field label="Service name" error={errors.serviceName}>
                            <IconInput icon={Scissors}>
                                <input
                                    name="serviceName"
                                    value={form.serviceName}
                                    onChange={handleChange}
                                    placeholder="e.g. Layered haircut and blow-dry"
                                    className={inputBase}
                                />
                            </IconInput>
                        </Field>

                        <Field label="Category" error={errors.category}>
                            <IconInput icon={Tag}>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={inputBase}
                                >
                                    <option value="">Select a category</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </IconInput>
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Price" error={errors.price}>
                                <IconInput icon={DollarSign}>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="45.00"
                                        className={inputBase}
                                    />
                                </IconInput>
                            </Field>
                            <Field label="Duration (minutes)" error={errors.duration}>
                                <IconInput icon={Clock}>
                                    <input
                                        type="number"
                                        name="duration"
                                        min="0"
                                        step="5"
                                        value={form.duration}
                                        onChange={handleChange}
                                        placeholder="60"
                                        className={inputBase}
                                    />
                                </IconInput>
                            </Field>
                        </div>

                        <Field
                            label="Description"
                            error={errors.description}
                            right={
                                <span className="text-sm text-[#8a7f7a]">
                                    {form.description.length}/{MAX_DESC}
                                </span>
                            }
                        >
                            <textarea
                                name="description"
                                rows={5}
                                maxLength={MAX_DESC}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="A precision cut shaped to your face, finished with a wash and blow-dry."
                                className="w-full rounded-lg border border-[#eaddd8] bg-white px-3.5 py-3 text-base text-[#2b2b2b] placeholder:text-[#8a7f7a] outline-none transition focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/25"
                            />
                        </Field>

                        <Field label="Status">
                            <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#eaddd8] bg-[#fdf9f6] p-1">
                                {(["active", "inactive"] as const).map((s) => {
                                    const selected = form.status === s;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setForm((p) => ({ ...p, status: s }))}
                                            aria-pressed={selected}
                                            className={`flex items-center justify-center gap-2 rounded-md py-2 text-base font-medium transition ${selected
                                                ? "bg-white text-[#2b2b2b] shadow-sm ring-1 ring-[#eaddd8]"
                                                : "text-[#8a7f7a] hover:text-[#2b2b2b]"
                                                }`}
                                        >
                                            {s === "active" ? (
                                                <CheckCircle2
                                                    className={`h-4 w-4 ${selected ? "text-[#2e7d32]" : ""}`}
                                                />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                            {s === "active" ? "Active" : "Inactive"}
                                        </button>
                                    );
                                })}
                            </div>
                        </Field>
                    </div>

                    {/* Image, preview, submit */}
                    <div className="min-w-0 space-y-5 sm:space-y-6 lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-2xl border border-[#eaddd8] bg-white p-4 sm:p-5">
                            <Field label="Service image" error={errors.image}>
                                {preview ? (
                                    <div className="relative overflow-hidden rounded-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={preview}
                                            alt="Selected service"
                                            className="aspect-[4/3] w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            aria-label="Remove image"
                                            className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-[#2b2b2b] shadow hover:bg-white"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragging(true);
                                        }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDragging(false);
                                            processFile(e.dataTransfer.files?.[0]);
                                        }}
                                        className={`flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 text-center transition sm:aspect-[4/3] ${dragging
                                            ? "border-[#d98c9a] bg-[#fdf9f6]"
                                            : errors.image
                                                ? "border-[#b42318]/50 bg-[#fdf9f6]"
                                                : "border-[#eaddd8] bg-[#fdf9f6] hover:border-[#d98c9a]"
                                            }`}
                                    >
                                        <span className="rounded-full bg-white p-3 text-[#6d2e46] ring-1 ring-[#eaddd8]">
                                            <ImagePlus className="h-6 w-6" />
                                        </span>
                                        <span className="text-base font-medium text-[#2b2b2b]">
                                            Tap or drop an image here
                                        </span>
                                        <span className="text-sm text-[#8a7f7a]">
                                            JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => processFile(e.target.files?.[0])}
                                            className="sr-only"
                                        />
                                    </label>
                                )}
                            </Field>
                        </div>

                        {/* Live preview (hidden on very small phones to keep the form short) */}
                        <div className="hidden rounded-2xl border border-[#eaddd8] bg-white p-4 min-[420px]:block sm:p-5">
                            <p className="mb-3 text-base font-medium text-[#2b2b2b]">
                                How customers will see it
                            </p>
                            <div className="overflow-hidden rounded-lg border border-[#eaddd8]">
                                <div className="aspect-[16/9] bg-[#fdf9f6]">
                                    {preview && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="" className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <div className="space-y-1.5 p-3.5">
                                    <span className="inline-block max-w-full truncate rounded-full border border-[#eaddd8] bg-[#fdf9f6] px-2.5 py-0.5 text-sm font-medium text-[#6d2e46]">
                                        {form.category || "Category"}
                                    </span>
                                    <h3 className="truncate font-semibold text-[#2b2b2b]">
                                        {form.serviceName || "Service name"}
                                    </h3>
                                    <div className="flex items-center justify-between text-base text-[#8a7f7a]">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {form.duration || "0"} min
                                        </span>
                                        <span className="font-semibold text-[#c9a227]">
                                            ${Number(form.price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#6d2e46] text-base font-medium text-white transition hover:bg-[#512033] focus:outline-none focus:ring-4 focus:ring-[#d98c9a]/40 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {(loading || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                            {uploading ? "Uploading image..." : loading ? "Adding service..." : "Add service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServicesPage;