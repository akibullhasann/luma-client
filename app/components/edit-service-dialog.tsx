"use client"

import * as React from "react"
import { ImagePlus, Loader2, Pencil } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updateService } from "@/lib/actions/services"
import type { Service } from "@/lib/api/services"
import type { FormErrors, ServiceStatus } from "@/typescript"

const CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
]

const MAX_IMAGE_MB = 5
const MAX_DESC = 300

const inputClass =
  "h-11 w-full rounded-lg border border-[#eaddd8] bg-white px-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/25"

const labelClass = "mb-1.5 block text-sm font-medium text-[#2b2b2b]"
const errorClass = "mt-1 text-sm text-[#b42318]"

type EditServiceDialogProps = {
  service: Service
  onUpdated: (service: Service) => void 
}


type EditFormState = {
  serviceName: string
  category: string
  description: string
  price: string
  duration: string
  status: ServiceStatus
}

function toFormState(service: Service): EditFormState {
  return {
    serviceName: service.serviceName,
    category: service.category,
    description: service.description,
    price: String(service.price),
    duration: String(service.duration),
    status: service.status,
  }
}

export function EditServiceDialog({ service, onUpdated }: EditServiceDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<EditFormState>(() => toFormState(service))
  const [imageUrl, setImageUrl] = React.useState(service.image)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  
  function handleOpenChange(next: boolean) {
    if (saving) return 

    if (next) {
      setForm(toFormState(service))
      setImageUrl(service.image)
      setErrors({})
    }
    setOpen(next)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  
  async function handleImage(file?: File) {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Choose an image file (JPG, PNG or WebP)." }))
      return
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: `Image must be smaller than ${MAX_IMAGE_MB} MB.` }))
      return
    }

    try {
      setUploading(true)
      setErrors((p) => ({ ...p, image: "" }))

      const fd = new FormData()
      fd.append("image", file)

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
        { method: "POST", body: fd }
      )
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error("Image upload failed.")

      setImageUrl(data.data.url)
    } catch {
      toast.error("Image upload failed. Try again.")
    } finally {
      setUploading(false)
    }
  }

  function validate() {
    const next: FormErrors = {}
    if (!form.serviceName.trim()) next.serviceName = "Enter a service name."
    if (!form.category) next.category = "Select a category."
    if (!form.description.trim()) next.description = "Add a short description."
    if (!(Number(form.price) > 0)) next.price = "Price must be greater than 0."
    if (!(Number(form.duration) > 0)) next.duration = "Duration must be greater than 0."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (uploading) {
      toast.error("Wait for the image upload to finish.")
      return
    }
    if (!validate()) return

    const changes = {
      serviceName: form.serviceName.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      status: form.status,
      image: imageUrl,
    }

    try {
      setSaving(true)
      await updateService(service._id, changes)

      onUpdated({ ...service, ...changes }) 
      toast.success("Service updated.")
      setOpen(false)
    } catch {
      toast.error("Could not update the service. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const id = service._id 

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#6d2e46] ring-1 ring-[#eaddd8] transition hover:bg-[#fdf9f6]"
          />
        }
      >
        <Pencil className="h-4 w-4" />
        Edit
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>
            Update the details below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor={`name-${id}`} className={labelClass}>
              Service name
            </label>
            <input
              id={`name-${id}`}
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.serviceName && <p className={errorClass}>{errors.serviceName}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor={`cat-${id}`} className={labelClass}>
              Category
            </label>
            <select
              id={`cat-${id}`}
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category}</p>}
          </div>

          {/* Price + duration */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`price-${id}`} className={labelClass}>
                Price
              </label>
              <input
                id={`price-${id}`}
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.price && <p className={errorClass}>{errors.price}</p>}
            </div>

            <div>
              <label htmlFor={`dur-${id}`} className={labelClass}>
                Duration (minutes)
              </label>
              <input
                id={`dur-${id}`}
                type="number"
                name="duration"
                min="0"
                step="5"
                value={form.duration}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.duration && <p className={errorClass}>{errors.duration}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor={`desc-${id}`} className="text-sm font-medium text-[#2b2b2b]">
                Description
              </label>
              <span className="text-xs text-[#8a7f7a]">
                {form.description.length}/{MAX_DESC}
              </span>
            </div>
            <textarea
              id={`desc-${id}`}
              name="description"
              rows={4}
              maxLength={MAX_DESC}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#eaddd8] bg-white px-3 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/25"
            />
            {errors.description && <p className={errorClass}>{errors.description}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor={`status-${id}`} className={labelClass}>
              Status
            </label>
            <select
              id={`status-${id}`}
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <p className={labelClass}>Service image</p>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg object-cover"
              />
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6d2e46] ring-1 ring-[#eaddd8] hover:bg-[#fdf9f6]">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Change image"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleImage(e.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            </div>
            {errors.image && <p className={errorClass}>{errors.image}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}