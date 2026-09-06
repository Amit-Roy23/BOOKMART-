"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editListingSchema, type EditListing, type EditListingFormValues } from "@/types/listing";
import {
  deleteListing,
  fetchListingById,
  updateListing,
} from "@/services/listings";

function toFormValues(listing: EditListing): EditListingFormValues {
  return {
    images: listing.images,
    title: listing.title,
    author: listing.author,
    category: listing.category,
    isbn: listing.isbn,
    description: listing.description,
    condition: listing.condition,
    price: listing.price,
    originalPrice: listing.originalPrice,
    visibility: listing.visibility,
    status: listing.status,
    college: listing.college,
  };
}

export function useEditListing(id: string) {
  const [listing, setListing] = useState<EditListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EditListingFormValues>({
    resolver: zodResolver(editListingSchema),
    mode: "onChange",
    defaultValues: {
      images: [],
      title: "",
      author: "",
      category: "",
      isbn: "",
      description: "",
      condition: "good",
      price: "",
      originalPrice: "",
      visibility: "everyone",
      status: "active",
      college: null,
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await fetchListingById(id);
      if (!data) {
        setNotFound(true);
        return;
      }
      setListing(data);
      form.reset(toFormValues(data));
    } catch {
      setError("We couldn't load this listing. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const save = useCallback(
    async (values: EditListingFormValues) => {
      setIsSaving(true);
      try {
        await updateListing(id, values);
        form.reset(values);
        return true;
      } catch {
        setError("Failed to save changes. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [id, form]
  );

  const remove = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteListing(id);
      return true;
    } catch {
      setError("Failed to delete listing. Please try again.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [id]);

  return {
    form,
    listing,
    loading,
    error,
    notFound,
    reload: load,
    save,
    isSaving,
    remove,
    isDeleting,
  };
}
