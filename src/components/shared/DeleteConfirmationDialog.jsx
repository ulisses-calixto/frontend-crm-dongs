import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="
          w-[90vw]
          max-w-[400px]
          sm:max-w-[460px]
          p-4
          md:p-6
          rounded-md
          bg-white
          max-h-[85vh]
          animate-fade-in
          fade-in-0
        "
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className="text-xl sm:text-2xl font-bold text-red-700"
          >
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription
            className="text-md sm:text-md text-gray-600 mt-2 leading-relaxed"
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="rounded-md hover:bg-red-100 hover:text-red-700"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              className="
                rounded-md
                px-5 
                bg-red-700 
                hover:bg-red-900 
                text-white
                w-full sm:w-auto
              "
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
