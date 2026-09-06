import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema } from "@/validation/listingSchema";
import { submitListing } from "@/services/listing";

export function useBookListing() {
  const form = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      images: [],
      title: "",
      author: "",
      isbn: "",
      edition: "",
      publisher: "",
      language: "",
      category: "",
      condition: undefined,
      price: "",
      negotiable: false,
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (_data) => {
    await submitListing();
  });

  return {
    form,
    onSubmit,
  };
}
